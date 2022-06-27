#!/bin/bash
set -eo pipefail
mkdir -p lib/nodejs
rm -rf node_modules lib/nodejs/node_modules
npm install
mv node_modules lib/nodejs/

ln -s lib/nodejs/node_modules node_modules