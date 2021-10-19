import * as core from '@actions/core'
import * as github from '@actions/github'
import simpleGit from 'simple-git'

import { PullRequestWebhookPayload, GetTag } from './interfaces'
import { getLastTag, getNewTag, getTagPattern } from './tags'

async function run() {
    const token = core.getInput('repo_token', { required: true })
    const custom_tag = core.getInput('custom_tag')
    const initial_tag_number = Number(core.getInput('initial_tag_number'))
    const milestone_pattern = core.getInput('milestone_pattern')
    milestone_pattern
    const pullRequest = (github.context.payload as PullRequestWebhookPayload).pull_request
    if (!pullRequest) {
        throw 'Could not get pull_request from context, exiting'
    }
    console.log('pull_request: ', pullRequest)
    console.log('merged: ', pullRequest.merged)
    console.log('state: ', pullRequest.state)
    console.log('milestone: ', pullRequest.milestone)

    if (pullRequest.merged) {
        const milestone = pullRequest.milestone ? pullRequest.milestone.title : null
        const tagPattern = getTagPattern(custom_tag, milestone_pattern, milestone)
        const lastTag = await getLastTag(token, pullRequest.base.repo.tags_url, tagPattern)
        console.log('Last Tag: ', lastTag)

        const newTag = getNewTag(
            custom_tag,
            milestone_pattern,
            initial_tag_number,
            lastTag,
            milestone
        )
        console.log('New Tag: ', newTag)

        // const client = github.getOctokit(token);
        // get list of tags
        // console.log(`GET ${pullRequest.base.repo.tags_url}`);
        // const response = await client.request(`GET ${pullRequest.base.repo.tags_url}`);
        // console.log('get tags: ', response)
        // const tags = response.data;
        // console.log('Last tag: ', tags[0].name);

        // const git = simpleGit(process.cwd());
        // await git.fetch();
        // const gitTags = await git.tags();
        // console.log(gitTags);

        // const logs = await git.log({maxCount: 3})
        // console.log(logs)
    } else {
        console.log('Ignore non merged pull request')
    }
}

run().catch((error) => {
    core.setFailed(error.message)
})
