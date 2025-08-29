#!/usr/bin/env bash

set -e

git fetch
git checkout master
git pull origin master

git merge origin/master --commit --stat

npm run build

git add bundle.js

python2 files generate.py

git commit -m "heatmap update"
git push origin master

git checkout -

