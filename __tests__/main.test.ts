import {expect, test} from '@jest/globals'
import nock from 'nock'

import {
  report_deployment,
  JELLYFISH_BASE_URL,
  JELLYFISH_DEPLOYMENT_RESOURCE
} from '../src/main'

// shows how the runner will run a javascript action with env / stdout protocol
test('test report_deployment function', async () => {
  const scope = nock(JELLYFISH_BASE_URL)
    .post('/' + JELLYFISH_DEPLOYMENT_RESOURCE)
    .reply(200)

  const now = new Date().toUTCString()

  const config = {
    apiToken: 'abc',
    referenceId: 'xyz',
    isSuccessful: true,
    deployedAt: now,
    repoName: 'test-repo',
    commitShas: ['b5d99fe'],
    shouldBackfillCommits: false,
    isDryRun: true
  }

  await report_deployment(config)

  expect(scope.done).toBeTruthy()
})
