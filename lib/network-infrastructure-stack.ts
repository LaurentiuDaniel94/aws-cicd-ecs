import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class NetworkingStack extends cdk.Stack {
    public readonly pocVpc: ec2.Vpc;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
       
      //create vpc for the cluster
      this.pocVpc = new ec2.Vpc(this, 'PocVpc', {
          cidr: '10.0.0.0/16',
          maxAzs: 2,
          subnetConfiguration: [
              {
                  cidrMask: 24,
                  name: 'Public',
                  subnetType: ec2.SubnetType.PUBLIC,
              },
              {
                  cidrMask: 24,
                  name: 'Private',
                  subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
              },
          ],
          natGateways: 1,
      });

      new cdk.CfnOutput(this, 'VpcId', { 
          value: this.pocVpc.vpcId,
          exportName: 'VpcId'
      });
    }
}