import {expect, test} from '@jest/globals'
import nock from 'nock'

import {
  report_deployment,
  JELLYFISH_BASE_URL,
  JELLYFISH_DEPLOYMENT_RESOURCE,
  JELLYFISH_API_KEY_HEADER,
  JELLYFISH_BACKFILL_COMMITS_HEADER,
  JELLYFISH_DRY_RUN_HEADER,
  ActionConfig,
  RequestBody
} from '../src/main'

// shows how the runner will run a javascript action with env / stdout protocol
test('test report_deployment function', async () => {
  const now = new Date().toISOString()

  const apiToken = 'abc'
  const referenceId = 'xyz'
  const isSuccessful = true
  const deployedAt = now
  const repoName = 'test-repo'
  const commitShas = ['b5d99fe']
  const shouldBackfillCommits = true
  const sourceUrl = 'https://github.com'
  const name = 'test run'
  const isDryRun = true

  const scope = nock(JELLYFISH_BASE_URL)
    .post('/' + JELLYFISH_DEPLOYMENT_RESOURCE, body => {
      const requestBody = body as unknown as RequestBody
      expect(requestBody.reference_id).toBe(referenceId)
      expect(requestBody.is_successful).toBe(isSuccessful)
      expect(requestBody.deployed_at).toBe(deployedAt)
      expect(requestBody.commit_shas).toEqual(commitShas)
      expect(requestBody.source_url).toBe(sourceUrl)
      expect(requestBody.name).toBe(name)
      return true
    })
    .reply(200, function () {
      const headers = this.req.headers
      expect(headers[JELLYFISH_API_KEY_HEADER]).toBe(apiToken)
      expect(headers[JELLYFISH_BACKFILL_COMMITS_HEADER]).toEqual('true')
      expect(headers[JELLYFISH_DRY_RUN_HEADER]).toBe('true')
    })

  const config: ActionConfig = {
    apiToken,
    referenceId,
    isSuccessful,
    deployedAt,
    repoName,
    commitShas,
    shouldBackfillCommits,
    sourceUrl,
    name,
    isDryRun
  }

  await report_deployment(config)

  expect(scope.done).toBeTruthy()
})
