import * as core from '@actions/core'
import * as github from '@actions/github'
// import simpleGit from 'simple-git'

import { createTag, listTags } from './git'
import { getLastTag, getNewTag, getTagPattern } from './utils'
import { PullRequestWebhookPayload } from './interfaces'

export default async function action(): Promise<void> {
    const custom_tag = core.getInput('custom_tag')
    const initial_tag_number = Number(core.getInput('initial_tag_number'))
    const milestone_pattern = core.getInput('milestone_pattern')
    const pullRequest = (github.context.payload as PullRequestWebhookPayload).pull_request

    if (!pullRequest) {
        throw Error('Could not get pull_request from context, exiting')
    }
    core.debug(`pull_request: ${pullRequest}`)
    core.info(`PR merged: ${pullRequest.merged}`)
    core.info(`PR state: ${pullRequest.state}`)

    if (pullRequest.merged) {
        const { GITHUB_SHA } = process.env
        if (!GITHUB_SHA) {
            throw Error('GITHUB_SHA not defined')
        }
        const milestone = pullRequest.milestone ? pullRequest.milestone.title : null
        core.info(`PR milestone: ${milestone}`)
        const tagPattern = getTagPattern(custom_tag, milestone_pattern, milestone)
        const tags = await listTags(true)
        const lastTag = getLastTag(tags, tagPattern)
        core.info(`Tag Pattern: ${tagPattern}`)
        core.info(`Tags: ${tags.map((t) => t.name)}`)
        core.info(`Last Tag: ${lastTag}`)

        const newTag = getNewTag(
            custom_tag,
            milestone_pattern,
            initial_tag_number,
            lastTag,
            milestone
        )
        core.info(`New Tag: ${newTag}`)
        core.setOutput('new_tag', newTag)
        core.setOutput('previous_tag', lastTag)

        createTag(newTag, GITHUB_SHA)

        // const client = github.getOctokit(token);
        // get list of tags
        // core.debug(`GET ${pullRequest.base.repo.tags_url}`);
        // const response = await client.request(`GET ${pullRequest.base.repo.tags_url}`);
        // core.debug('get tags: ', response)
        // const tags = response.data;
        // core.debug('Last tag: ', tags[0].name);

        // const git = simpleGit(process.cwd());
        // await git.fetch();
        // const gitTags = await git.tags();
        // core.debug(gitTags);

        // const logs = await git.log({maxCount: 3})
        // core.debug(logs)
    } else {
        core.debug('Ignore non merged pull request')
    }
}
