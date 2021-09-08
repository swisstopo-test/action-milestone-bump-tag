import * as core from '@actions/core';
import * as github from '@actions/github';
import { PullRequestWebhookPayload } from './interfaces';


async function run() {
    const pullRequest = (github.context.payload as PullRequestWebhookPayload).pull_request;
    if (!pullRequest) {
        core.setFailed('Could not get pull_request from context, exiting');
        return;
    }
    core.debug(`pull request payload: ${pullRequest}`)
    core.info(`pull request payload: ${pullRequest}`)
    console.log(`pull request payload: ${JSON.stringify(pullRequest,null, 2)}`)
}

run().catch((error) => {
    core.setFailed(error.message);
  });