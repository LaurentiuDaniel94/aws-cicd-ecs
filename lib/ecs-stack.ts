import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

interface EcsStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  repository: ecr.IRepository;
}

export class EcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EcsStackProps) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, 'DemoCluster', {
      vpc: props.vpc
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'DemoTaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
    });

    const container = taskDefinition.addContainer('DemoContainer', {
      image: ecs.ContainerImage.fromEcrRepository(props.repository, 'latest'),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'DemoContainer' }),
    });

    container.addPortMappings({
      containerPort: 80,
      protocol: ecs.Protocol.TCP,
    });

    const service = new ecs.FargateService(this, 'DemoService', {
      cluster,
      taskDefinition,
      desiredCount: 2,
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, 'DemoLB', {
      vpc: props.vpc,
      internetFacing: true
    });

    const listener = lb.addListener('DemoListener', {
      port: 80,
    });

    listener.addTargets('DemoTarget', {
      port: 80,
      targets: [service],
      healthCheck: {
        path: '/',
        interval: cdk.Duration.seconds(60),
      },
    });

    new cdk.CfnOutput(this, 'LoadBalancerDNS', { value: lb.loadBalancerDnsName });
  }
}