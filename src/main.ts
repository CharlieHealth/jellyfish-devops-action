import * as core from '@actions/core'
import axios from 'axios'

export const JELLYFISH_BASE_URL = 'https://webhooks.jellyfish.co'
export const JELLYFISH_DEPLOYMENT_RESOURCE = 'deployment'

interface ACTION_CONFIG {
  apiToken: string
  referenceId: string
  isSuccessful: boolean
  deployedAt: string
  repoName: string
  commitShas?: string[]
  prs?: string[]
  labels?: JSON
  shouldBackfillCommits: boolean
  isDryRun: boolean
}

export async function report_deployment(config: ACTION_CONFIG): Promise<void> {
  const url = [JELLYFISH_BASE_URL, JELLYFISH_DEPLOYMENT_RESOURCE].join('/')
  const headers: Record<string, string | boolean | number> = {
    'X-jf-api-token': config.apiToken
  }

  if (config.shouldBackfillCommits) {
    headers['X-jf-api-backfill-commits'] = config.shouldBackfillCommits
  }

  if (config.isDryRun) {
    headers['X-jf-api-dry-run'] = config.isDryRun
  }

  const data = {
    reference_id: config.referenceId,
    is_successful: config.isSuccessful,
    deployed_at: config.deployedAt,
    repo_name: config.repoName,
    commit_shas: config.commitShas,
    prs: config.prs,
    labels: config.labels
  }

  await axios.post(url, data, {headers})
}

async function run(): Promise<void> {
  try {
    const config = {
      apiToken: core.getInput('apiToken'),
      referenceId: core.getInput('referenceId'),
      isSuccessful: core.getBooleanInput('isSuccessful'),
      deployedAt: core.getInput('deployedAt'),
      repoName: core.getInput('repoName'),
      commitShas: core.getMultilineInput('commitShas'),
      prs: core.getMultilineInput('prs'),
      labels: JSON.parse(core.getInput('labels')),
      shouldBackfillCommits: core.getBooleanInput('shouldBackfillCommits'),
      isDryRun: core.getBooleanInput('isDryRun')
    }

    if (!config.commitShas && !config.prs) {
      throw new Error('commitShas and prs cannot both be undefined')
    }

    await report_deployment(config)
  } catch (error) {
    core.debug(JSON.stringify(error, null, 2))
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
