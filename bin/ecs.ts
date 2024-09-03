#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
// import { EcsStack } from '../lib/ecs-stack';
import { ContainerRepositoryStack } from '../lib/container-repository-stack';
import { NetworkingStack } from '../lib/network-infrastructure-stack';
import { EcsStack } from '../lib/ecs-stack';


const app = new cdk.App();

new ContainerRepositoryStack(app, 'ContainerRepositoryStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const networkStack = new NetworkingStack(app, 'NetworkingStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

new EcsStack(app, 'EcsStack', {
  vpc: networkStack.pocVpc,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

EcsStack.addDependency(NetworkingStack);