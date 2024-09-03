import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

interface EcsStackProps extends cdk.StackProps {
    vpc: ec2.IVpc;
}

export class EcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: EcsStackProps) {
      super(scope, id, props);

      const pocCluster = new ecs.Cluster(this, 'PocCluster', {
        clusterName: 'poc-ecs-cluster',
        vpc: props.vpc
      });
    }
}