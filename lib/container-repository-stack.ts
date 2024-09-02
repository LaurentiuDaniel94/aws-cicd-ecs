import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

export class ContainerRepositoryStack extends cdk.Stack {
        constructor(scope: Construct, id: string, props: cdk.StackProps) {
          super(scope, id, props);

          new ecr.Repository(this, 'ContainerRepository', {
            repositoryName: 'test-container-repository',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            emptyOnDelete: true
        })
        }
    }