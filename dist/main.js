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
const tags_1 = require("./tags");
async function run() {
    const token = core.getInput('repo_token', { required: true });
    const custom_tag = core.getInput('custom_tag');
    const initial_tag_number = Number(core.getInput('initial_tag_number'));
    const milestone_pattern = core.getInput('milestone_pattern');
    milestone_pattern;
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        throw 'Could not get pull_request from context, exiting';
    }
    // console.log('pull_request: ', pullRequest)
    console.log('merged: ', pullRequest.merged);
    console.log('state: ', pullRequest.state);
    console.log('milestone: ', pullRequest.milestone);
    if (pullRequest.merged) {
        const milestone = pullRequest.milestone ? pullRequest.milestone.title : null;
        const tagPattern = (0, tags_1.getTagPattern)(custom_tag, milestone_pattern, milestone);
        const lastTag = await (0, tags_1.getLastTag)(token, pullRequest.base.repo.tags_url, tagPattern);
        console.log('Last Tag: ', lastTag);
        const newTag = (0, tags_1.getNewTag)(custom_tag, milestone_pattern, initial_tag_number, lastTag, milestone);
        console.log('New Tag: ', newTag);
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
    }
    else {
        console.log('Ignore non merged pull request');
    }
}
run().catch((error) => {
    core.setFailed(error.message);
});
