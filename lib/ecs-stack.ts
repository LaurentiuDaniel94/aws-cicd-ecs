import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';

interface EcsStackProps extends cdk.StackProps {
    vpc: ec2.IVpc;
    repository: ecr.IRepository;
}

export class EcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: EcsStackProps) {
      super(scope, id, props);

      const pocCluster = new ecs.Cluster(this, 'PocCluster', {
        clusterName: 'poc-ecs-cluster',
        vpc: props.vpc
      });

      pocCluster.addCapacity('DefaultAutoScalingGroup', {
        instanceType: new ec2.InstanceType('t2.micro'),
        minCapacity: 1,
        maxCapacity: 3,
    });

      const pocTaskDefinition = new ecs.Ec2TaskDefinition(this, 'PocTaskDef');
      const pocContainer = pocTaskDefinition.addContainer('pocContainer', {
        image: 
        memoryLimitMiB: 256,
      });
    }
}