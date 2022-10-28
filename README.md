# GitHub Action for Jellyfish DevOps Metrics Reporting

Use this action to report DevOps metrics to Jellyfish. Based on the [TypeScript Action Template](https://github.com/actions/typescript-action) and the [Jellyfish DevOps Metrics Documentation](https://help.jellyfish.co/hc/en-us/articles/9281148741901-Sending-deployment-data-via-the-API-s-Deployment-POST-Endpoint)

## Using the action

Add the following step to your actions workflow. Details on the arguments available at https://help.jellyfish.co/hc/en-us/articles/9281148741901-Sending-deployment-data-via-the-API-s-Deployment-POST-Endpoint

```
steps:
  - uses: CharlieHealth/jellyfish-devops-action@v1
    with:
      apiToken: ${{ secrets.JELLYFISH_API_KEY }}
      referenceId: $GITHUB_SHA
      isSuccessful: True
      repoName: test-repo
      commitShas: |
        $GITHUB_SHA
      labels: '{"team": "testTeam"}'
      shouldBackfillCommits: False
      isDryRun: True

```

## Development

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies

```bash
$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  __tests__/main.test.ts
  ✓ test report_deployment function (10 ms)

...
```

## Publish to a distribution branch

To publish your package, run the package command. Then checkin and merge changes to the `dist` folder and [create a release branch](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

```bash
$ npm run package
```
