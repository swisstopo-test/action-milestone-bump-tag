import { WebhookPayload } from '@actions/github/lib/interfaces'

export interface RepoWebhookPayload {
    ref: string
    repo: {
        git_tags_url: string
        tags_url: string
    }
}

export interface PullRequestWebhookPayload extends WebhookPayload {
    // eslint-disable-next-line camelcase
    pull_request?: {
        [key: string]: any
        number: number
        // eslint-disable-next-line camelcase
        html_url?: string
        body?: string
        merged: boolean
        milestone?: {
            title: string
            state: string
            id: number
            [key: string]: any
        }
        base: RepoWebhookPayload
        head: RepoWebhookPayload
    }
}

export interface Tag {
    name: string
}
