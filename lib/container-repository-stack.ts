import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

interface ContainerRepositoryStackProps extends cdk.StackProps {
  repositoryName: string;
  maxImageCount: number;
}

export class ContainerRepositoryStack extends cdk.Stack {
  public readonly repository: ecr.Repository;

  constructor(scope: Construct, id: string, props: ContainerRepositoryStackProps) {
    super(scope, id, props);

    this.repository = new ecr.Repository(this, 'ContainerRepository', {
      repositoryName: props.repositoryName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteImages: true,
      lifecycleRules: [
        {
          maxImageCount: props.maxImageCount,
          description: 'Keep only the most recent images',
        },
      ],
    });

    new cdk.CfnOutput(this, 'RepositoryUri', {
      value: this.repository.repositoryUri,
      description: 'The URI of the ECR repository',
      exportName: `${props.repositoryName}-uri`,
    });
  }
}