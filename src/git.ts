import * as core from '@actions/core'
import { context, getOctokit } from '@actions/github'

import { Tag } from './interfaces'

const octokit = getOctokit(core.getInput('github_token', { required: true }))

/**
 * Fetch all tags for the given repository recursively
 */
export async function listTags(
    shouldFetchAllTags = false,
    fetchedTags: Tag[] = [],
    page = 1
): Promise<Tag[]> {
    const tags = await octokit.rest.repos.listTags({
        ...context.repo,
        per_page: 100,
        page
    })

    if (tags.data.length < 100 || shouldFetchAllTags === false) {
        return [...fetchedTags, ...tags.data]
    }

    return listTags(shouldFetchAllTags, [...fetchedTags, ...tags.data], page + 1)
}

/** Create and push a Tag for given commit */
export async function createTag(newTag: string, GITHUB_SHA: string): Promise<void> {
    core.info(`Creating and pushing new tag to the repo.`)
    await octokit.rest.git.createRef({
        ...context.repo,
        ref: `refs/tags/${newTag}`,
        sha: GITHUB_SHA
    })
}
