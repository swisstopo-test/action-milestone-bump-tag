import * as core from '@actions/core'
// import * as github from '@actions/github'
// import simpleGit from 'simple-git'

import action from './action'

async function run(): Promise<void> {
    try {
        action()
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        }
    }
}

run()
