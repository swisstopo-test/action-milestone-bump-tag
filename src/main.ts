import * as core from '@actions/core';
import * as github from '@actions/github';
import simpleGit from 'simple-git';

import { PullRequestWebhookPayload } from './interfaces';


async function run() {
    const token = core.getInput('repo-token', { required: true });
    const pullRequest = (github.context.payload as PullRequestWebhookPayload).pull_request;
    if (!pullRequest) {
        core.setFailed('Could not get pull_request from context, exiting');
        return;
    }
    // core.info('pull request payload: ' + pullRequest)
    console.log('pull_request: ', pullRequest)
    console.log('merged: ', pullRequest.merged)
    console.log('state: ', pullRequest.state)
    console.log('milestone: ', pullRequest.milestone)

    if (pullRequest.merged && pullRequest.milestone) {
        const client = github.getOctokit(token);
        // get list of tags
        console.log(`GET ${pullRequest.base.repo.tags_url}`);
        const response = await client.request(`GET ${pullRequest.base.repo.tags_url}`);
        console.log('get tags: ', response)
        const tags = response.data;
        console.log('Last tag: ', tags[0].name);

        const git = simpleGit(process.cwd());
        await git.fetch();
        const gitTags = await git.tags();
        console.log(gitTags);

        const logs = await git.log({maxCount: 3})
        console.log(logs)
    }
}

run().catch((error) => {
    core.setFailed(error.message);
  });