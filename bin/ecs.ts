#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
// import { EcsStack } from '../lib/ecs-stack';
import { ContainerRepositoryStack } from '../lib/container-repository-stack';
import { NetworkingStack } from '../lib/network-infrastructure-stack';
import { EcsStack } from '../lib/ecs-stack';


const app = new cdk.App();

const env = { 
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

new ContainerRepositoryStack(app, 'ContainerRepositoryStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// Create the networking stack
const networkStack = new NetworkingStack(app, 'NetworkingStack', { env });

// Create the ECS stack
const ecsStack = new EcsStack(app, 'EcsStack', {
  vpc: networkStack.pocVpc,
  env: env,
});

// Correctly add the dependency
ecsStack.addDependency(networkStack);

// Add tags to all resources in both stacks
cdk.Tags.of(networkStack).add('Project', 'MyPoC');
cdk.Tags.of(ecsStack).add('Project', 'MyPoC');

app.synth();

