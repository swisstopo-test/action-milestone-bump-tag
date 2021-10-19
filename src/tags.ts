import * as github from '@actions/github'
import { GetTag } from './interfaces'

export async function getTags(token: string, tags_url: string): Promise<GetTag[]> {
    const client = github.getOctokit(token)

    console.log(`GET ${tags_url}`)
    const response = await client.request(`GET ${tags_url}`)
    console.log(response)
    if (response.status !== 200) {
        throw `Could not get tags: GET ${tags_url} ${response.status}`
    }
    return response.data
}

export function lastTag(tags: GetTag[], tag_pattern: RegExp): string | null {
    let _tags: GetTag[]
    let _lastTag: string | null = null

    _tags = tags.filter((t: GetTag) => tag_pattern.test(t.name))
    _tags = _tags.sort((a: GetTag, b: GetTag) => {
        if (a.name < b.name) {
            return 1
        } else if (a.name > b.name) {
            return -1
        }
        return 0
    })
    if (_tags.length) {
        _lastTag = _tags[0].name
    }

    return _lastTag
}

export async function getLastTag(
    token: string,
    tags_url: string,
    tag_pattern: RegExp
): Promise<string | null> {
    let tags = await getTags(token, tags_url)

    // filter the tags by pattern and sort them
    return lastTag(tags, tag_pattern)
}

export function getTagPattern(
    custom_tag: string,
    milestone_pattern: string,
    milestone: string | undefined | null
): RegExp {
    let regexStr = custom_tag

    if (milestone) {
        regexStr = regexStr.replace('${MILESTONE}', milestone)
    } else {
        regexStr = regexStr.replace('${MILESTONE}', `(?<MILESTONE>${milestone_pattern})`)
    }
    regexStr = regexStr.replace('${TAG_NUMBER}', '(?<TAG_NUMBER>\\d+)')
    return new RegExp(`^${regexStr}$`)
}

export function getNewTag(
    custom_tag: string,
    milestone_pattern: string,
    initial_tag_number: number,
    lastTag: string | null,
    milestone: string | undefined | null
): string {
    let newTag: string
    let tag_pattern = getTagPattern(custom_tag, milestone_pattern, null)

    if (lastTag) {
        const m = lastTag.match(tag_pattern)
        if (!m || !m.groups || !m.groups.MILESTONE) {
            throw `Invalid lastTag ${lastTag}, don't match ${tag_pattern.toString()}, cannot get new Tag`
        }
        if (!m.groups.TAG_NUMBER) {
            // if there is no TAG_NUMBER in the custom_tag then we cannot bump the tag
            newTag = lastTag
        } else {
            newTag = custom_tag
                .replace('${MILESTONE}', m.groups.MILESTONE)
                .replace('${TAG_NUMBER}', `${Number(m.groups.TAG_NUMBER) + 1}`)
        }
    } else {
        if (!milestone) {
            throw 'No last tag found and PR not attached to a milestone, cannot get new Tag'
        }
        newTag = custom_tag
            .replace('${MILESTONE}', milestone)
            .replace('${TAG_NUMBER}', `${initial_tag_number}`)
    }

    return newTag
}
