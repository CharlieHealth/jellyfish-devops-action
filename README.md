# GitHub Action for Jellyfish DevOps Metrics Reporting

Use this action to report DevOps metrics to Jellyfish. Based on the [TypeScript Action Template](https://github.com/actions/typescript-action) and the [Jellyfish DevOps Metrics Documentation](https://app.jellyfish.co/docs/devops-metrics/)

## Getting Started

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
