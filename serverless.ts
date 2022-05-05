/* eslint-disable import/no-import-module-exports */
/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';
import { esbuild } from './serverless/configs/esbuild.custom';
import { prune } from './serverless/configs/prune.custom';
import { functions } from './serverless/functions';
import { resources } from './serverless/resources';

const region: any = "${opt:region, 'us-east-1'}";
const stage = "${opt:stage, 'dev'}";

export const service: AWS = {
  service: 'service-name',
  frameworkVersion: '3',
  package: {
    individually: true,
    patterns: [
      '!**/*.test.ts'
    ]
  },
  custom: {
    esbuild,
    prune
  },
  plugins: [
    'serverless-esbuild',
    'serverless-prune-plugin',
    'serverless-dotenv-plugin',
    'serverless-deployment-bucket',
    'serverless-analyze-bundle-plugin',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage,
    region,
    memorySize: 256,
    lambdaHashingVersion: '20201221',
    apiGateway: {
      shouldStartNameWithService: true,
      minimumCompressionSize: 1024
    },
    deploymentBucket: {
      name: '${self:service}-deployments',
      maxPreviousDeploymentArtifacts: 3
    },
    environment: {
      ENV: '${self:provider.stage}',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      REGION: '${self:provider.region}',
      NODE_OPTIONS: '--enable-source-maps'
    }
  },
  functions,
  resources
};

module.exports = service;