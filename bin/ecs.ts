import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ContainerRepositoryStack } from '../lib/container-repository-stack';
import { NetworkingStack } from '../lib/network-infrastructure-stack';
import { EcsStack } from '../lib/ecs-stack';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();

const env = { 
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const ecrStack = new ContainerRepositoryStack(app, 'ContainerRepositoryStack', {
  repositoryName: 'poc-ecs-repo',
  maxImageCount: 5,
  env,
});

const networkStack = new NetworkingStack(app, 'NetworkingStack', { env });

const ecsStack = new EcsStack(app, 'EcsStack', {
  vpc: networkStack.pocVpc,
  repository: ecrStack.repository,
  env,
});

const pipelineStack = new PipelineStack(app, 'PipelineStack', {
  ecrRepository: ecrStack.repository,
  ecsService: ecsStack.service,
  env,
});

ecsStack.addDependency(networkStack);
ecsStack.addDependency(ecrStack);
pipelineStack.addDependency(ecsStack);

cdk.Tags.of(app).add('Project', 'MyPoC');

app.synth();