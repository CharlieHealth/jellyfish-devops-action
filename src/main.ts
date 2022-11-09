import * as core from '@actions/core'
import axios, {AxiosError} from 'axios'

export const JELLYFISH_BASE_URL = 'https://webhooks.jellyfish.co'
export const JELLYFISH_DEPLOYMENT_RESOURCE = 'deployment'

export const JELLYFISH_API_KEY_HEADER = 'x-jf-api-token'
export const JELLYFISH_BACKFILL_COMMITS_HEADER = 'x-jf-api-backfill-commits'
export const JELLYFISH_DRY_RUN_HEADER = 'x-jf-api-dry-run'

export interface ActionConfig {
  name?: string
  sourceUrl?: string
  apiToken: string
  referenceId: string
  isSuccessful: boolean
  deployedAt: string
  repoName: string
  commitShas?: string[]
  prs?: string[]
  labels?: string[]
  shouldBackfillCommits: boolean
  isDryRun: boolean
}

export interface RequestBody {
  name?: string
  source_url?: string
  reference_id: string
  is_successful: boolean
  deployed_at: string
  repo_name: string
  commit_shas?: string[]
  prs?: string[]
  labels?: string[]
}

export async function report_deployment(config: ActionConfig): Promise<void> {
  const url = [JELLYFISH_BASE_URL, JELLYFISH_DEPLOYMENT_RESOURCE].join('/')
  const headers: Record<string, string | boolean | number> = {
    [JELLYFISH_API_KEY_HEADER]: config.apiToken
  }

  if (config.shouldBackfillCommits) {
    headers[JELLYFISH_BACKFILL_COMMITS_HEADER] = config.shouldBackfillCommits
  }

  if (config.isDryRun) {
    headers[JELLYFISH_DRY_RUN_HEADER] = config.isDryRun
  }

  const body: RequestBody = {
    reference_id: config.referenceId,
    is_successful: config.isSuccessful,
    deployed_at: config.deployedAt,
    repo_name: config.repoName
  }

  if (config.name) {
    body['name'] = config.name
  }

  if (config.sourceUrl) {
    body['source_url'] = config.sourceUrl
  }

  if (config.commitShas && config.commitShas.length > 0) {
    body['commit_shas'] = config.commitShas
  }

  if (config.prs && config.prs.length > 0) {
    body['prs'] = config.prs
  }

  if (config.labels && config.labels.length > 0) {
    body['labels'] = config.labels
  }

  core.info('Payload')
  core.info(JSON.stringify(body, null, 2))

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
      labels: core.getMultilineInput('prs'),
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
