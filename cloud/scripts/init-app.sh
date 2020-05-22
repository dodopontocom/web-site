#!/bin/bash

project_name="web-site"
git_clone_url="https://github.com/dodopontocom/${project_name}.git"

VM_EXTERNAL_IP=${1:-$(curl -H "Metadata-Flavor: Google" http://metadata/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip)}

#install docker
sudo apt-get update
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common \
    mongodb \
    npm

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce

curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

echo n | npm install -g --silent --save express
echo n | npm install -g --silent @angular/cli

#clone odroid-contas repository
git clone ${git_clone_url}
cd ${project_name}
git checkout terraform-v2

sed -i 's/${VM_EXTERNAL_IP}/'${VM_EXTERNAL_IP}/ src/environments/environment.ts

echo n | npm install
ng serve --host 0.0.0.0 & npm run start:server