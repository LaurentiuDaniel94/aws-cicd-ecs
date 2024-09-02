#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
// import { EcsStack } from '../lib/ecs-stack';
import { ContainerRepositoryStack } from '../lib/container-repository-stack';


const app = new cdk.App();

new ContainerRepositoryStack(app, 'ContainerRepositoryStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});