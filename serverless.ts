/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';
import { functions } from './serverless/functions';
import { resources } from './serverless/resources';

const region: any = "${opt:region, 'us-east-1'}";
const stage = "${opt:stage, 'dev'}";

export const service: AWS = {
  service: 'service-name',
  package: {
    individually: true
  },
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: {
        forceExclude: [
          'aws-sdk'
        ]
      },
      excludeFiles: '**/*.test.ts'
    },
    prune: {
      automatic: true,
      number: 3
    }
  },
  plugins: [
    'serverless-webpack',
    'serverless-prune-plugin',
    'serverless-dotenv-plugin',
    'serverless-deployment-bucket',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
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
      REGION: '${self:provider.region}'
    }
  },
  functions,
  resources
};

module.exports = service;