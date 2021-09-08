"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
async function run() {
    const token = core.getInput('repo-token', { required: true });
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        core.setFailed('Could not get pull_request from context, exiting');
        return;
    }
    // core.info('pull request payload: ' + pullRequest)
    console.log('pull_request: ', pullRequest);
    console.log('merged: ', pullRequest.merged);
    console.log('state: ', pullRequest.state);
    console.log('milestone: ', pullRequest.milestone);
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
