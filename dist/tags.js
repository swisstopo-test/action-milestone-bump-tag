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
exports.getNewTag = exports.getTagPattern = exports.getLastTag = exports.lastTag = exports.getTags = void 0;
const github = __importStar(require("@actions/github"));
async function getTags(token, tags_url) {
    const client = github.getOctokit(token);
    console.log(`GET ${tags_url}`);
    const response = await client.request(`GET ${tags_url}`);
    console.log(response);
    if (response.status !== 200) {
        throw `Could not get tags: GET ${tags_url} ${response.status}`;
    }
    return response.data;
}
exports.getTags = getTags;
function lastTag(tags, tag_pattern) {
    let _tags;
    let _lastTag = null;
    _tags = tags.filter((t) => tag_pattern.test(t.name));
    _tags = _tags.sort((a, b) => {
        if (a.name < b.name) {
            return 1;
        }
        else if (a.name > b.name) {
            return -1;
        }
        return 0;
    });
    if (_tags.length) {
        _lastTag = _tags[0].name;
    }
    return _lastTag;
}
exports.lastTag = lastTag;
async function getLastTag(token, tags_url, tag_pattern) {
    let tags = await getTags(token, tags_url);
    // filter the tags by pattern and sort them
    return lastTag(tags, tag_pattern);
}
exports.getLastTag = getLastTag;
function getTagPattern(custom_tag, milestone_pattern, milestone) {
    let regexStr = custom_tag;
    if (milestone) {
        regexStr = regexStr.replace('${MILESTONE}', milestone);
    }
    else {
        regexStr = regexStr.replace('${MILESTONE}', `(?<MILESTONE>${milestone_pattern})`);
    }
    regexStr = regexStr.replace('${TAG_NUMBER}', '(?<TAG_NUMBER>\\d+)');
    return new RegExp(`^${regexStr}$`);
}
exports.getTagPattern = getTagPattern;
function getNewTag(custom_tag, milestone_pattern, initial_tag_number, lastTag, milestone) {
    let newTag;
    let tag_pattern = getTagPattern(custom_tag, milestone_pattern, null);
    if (lastTag) {
        const m = lastTag.match(tag_pattern);
        if (!m || !m.groups || !m.groups.MILESTONE) {
            throw `Invalid lastTag ${lastTag}, don't match ${tag_pattern.toString()}, cannot get new Tag`;
        }
        if (!m.groups.TAG_NUMBER) {
            // if there is no TAG_NUMBER in the custom_tag then we cannot bump the tag
            newTag = lastTag;
        }
        else {
            newTag = custom_tag
                .replace('${MILESTONE}', m.groups.MILESTONE)
                .replace('${TAG_NUMBER}', `${Number(m.groups.TAG_NUMBER) + 1}`);
        }
    }
    else {
        if (!milestone) {
            throw 'No last tag found and PR not attached to a milestone, cannot get new Tag';
        }
        newTag = custom_tag
            .replace('${MILESTONE}', milestone)
            .replace('${TAG_NUMBER}', `${initial_tag_number}`);
    }
    return newTag;
}
exports.getNewTag = getNewTag;
