#!/bin/bash

# deploy new layer by redeploying 

set -e

stack_name="evo-ingress-serverless-layer-dev"
output_name="PackagesLambdaLayer"
arn=$(aws cloudformation describe-stacks --stack-name $stack_name --query "Stacks[0].Outputs[?ExportName=='$output_name'].OutputValue" --output text)

echo $arn

cp serverless.yml serverless.tmp.yml

# -E for extra Regex stuff, -n for quiet mode
sed -Ei '' "s~Fn::ImportValue: $output_name~$arn~" serverless.tmp.yml

sls deploy -c serverless.tmp.yml
sls deploy -c serverless-layer.yml
sls deploy

rm serverless.tmp.yml
