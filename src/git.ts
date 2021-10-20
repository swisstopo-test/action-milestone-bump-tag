import * as core from '@actions/core'
import { context, getOctokit } from '@actions/github'

import { Tag } from './interfaces'

const octokit = getOctokit(core.getInput('github_token', { required: true }))

/**
 * Fetch all tags for a given repository recursively
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
