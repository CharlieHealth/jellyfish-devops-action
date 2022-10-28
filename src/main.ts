import * as core from '@actions/core'
import axios, {AxiosError} from 'axios'

export const JELLYFISH_BASE_URL = 'https://webhooks.jellyfish.co'
export const JELLYFISH_DEPLOYMENT_RESOURCE = 'deployment'

interface ActionConfig {
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

interface RequestBody {
  reference_id: string
  is_successful: boolean
  deployed_at: string
  repo_name: string
  commit_shas?: string[]
  prs?: string[]
  labels?: JSON
}

export async function report_deployment(config: ActionConfig): Promise<void> {
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

  const body: RequestBody = {
    reference_id: config.referenceId,
    is_successful: config.isSuccessful,
    deployed_at: config.deployedAt,
    repo_name: config.repoName
  }

  if (config.commitShas && config.commitShas.length > 0) {
    body['commit_shas'] = config.commitShas
  }

  if (config.prs && config.prs.length > 0) {
    body['prs'] = config.prs
  }

  if (config.labels && Object.keys(config.labels).length > 0) {
    body['labels'] = config.labels
  }

  await axios.post(url, body, {headers})
}

async function run(): Promise<void> {
  try {
    const config = {
      apiToken: core.getInput('apiToken'),
      referenceId: core.getInput('referenceId'),
      isSuccessful: core.getBooleanInput('isSuccessful'),
      deployedAt: core.getInput('deployedAt') || new Date().toISOString(),
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
    if (error instanceof AxiosError)
      core.error(JSON.stringify(error.toJSON(), null, 2))
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
