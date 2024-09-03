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

      const pocCluster = new ecs.Cluster(this, 'PocCluster', {
        clusterName: 'poc-ecs-cluster',
        vpc: props.vpc
      });

      pocCluster.addCapacity('DefaultAutoScalingGroup', {
        instanceType: new ec2.InstanceType('t2.micro'),
        minCapacity: 1,
        maxCapacity: 3,
    });

      const pocTaskDefinition = new ecs.Ec2TaskDefinition(this, 'PocTaskDef',{
        networkMode: ecs.NetworkMode.BRIDGE,
        
      })
      const pocContainer = pocTaskDefinition.addContainer('pocContainer', {
        image: ecs.ContainerImage.fromEcrRepository(props.repository),
        memoryLimitMiB: 256,
        cpu: 256,
        logging: new ecs.AwsLogDriver({
            streamPrefix: 'pocContainer',
            }),
      });

        pocContainer.addPortMappings({
            containerPort: 80,
            hostPort: 80,
            protocol: ecs.Protocol.TCP,
        });

        const pocService = new ecs.Ec2Service(this, 'PocService', {
            cluster: pocCluster,
            taskDefinition: pocTaskDefinition,
        });

        //create a load balancer
        pocService.connections.allowFromAnyIpv4(ec2.Port.tcp(80));
        pocService.connections.allowFromAnyIpv4(ec2.Port.tcp(443));

        const pocLoadBalancer = new elbv2.ApplicationLoadBalancer(this, 'PocLoadBalancer', {
            vpc: props.vpc,
            internetFacing: true,
        });

        const listener = pocLoadBalancer.addListener('Listener', {
            port: 80,
            open: true
        });

        listener.addTargets('ECS', {
            port: 80,
            targets: [pocService.loadBalancerTarget({
                containerName: 'pocContainer',
                containerPort: 80,
            })],
            healthCheck: {
                interval:cdk.Duration.seconds(60),
                path: '/',
                timeout: cdk.Duration.seconds(5),
            }
        });


    }
}