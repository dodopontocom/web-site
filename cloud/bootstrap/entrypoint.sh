#!/usr/bin/env sh

echo n | npm install
echo n | npm install -g --silent --save express
echo n | npm install -g --silent @angular/cli
# execute in container
/usr/local/bin/ng serve --host 0.0.0.0 &