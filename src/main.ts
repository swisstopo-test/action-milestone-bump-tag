import * as core from '@actions/core';
import * as github from '@actions/github';
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
        const tags = await client.rest.repos.listTags();

        console.log('Last tag: ', tags[0].name);
    }
}

run().catch((error) => {
    core.setFailed(error.message);
  });