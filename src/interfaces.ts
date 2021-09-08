import { WebhookPayload } from '@actions/github/lib/interfaces';

export interface PullRequestWebhookPayload extends WebhookPayload {
    // eslint-disable-next-line camelcase
    pull_request?: {
        [key: string]: any;
        number: number;
        // eslint-disable-next-line camelcase
        html_url?: string;
        body?: string;
        merged: boolean;
        milestone?: string;
        base: {
            ref: string;
        },
        head: {
            ref: string;
        },
    },
  }