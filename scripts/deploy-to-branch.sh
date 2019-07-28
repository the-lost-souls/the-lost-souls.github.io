#!/bin/sh
set -e

TOKEN=$1
BRANCH=$2
BRANCH_DIR=branch-$BRANCH

# All git output below is sent to dev/null to avoid exposing anything sensitive in build logs

echo checkout $BRANCH
mkdir $BRANCH_DIR
cd $BRANCH_DIR

git config --global user.name "CircleCI"  > /dev/null 2>&1
git init  > /dev/null 2>&1
git remote add --fetch origin https://$TOKEN@github.com/the-lost-souls/tls-home.git > /dev/null 2>&1

git checkout $BRANCH > /dev/null 2>&1

rm -rf * > /dev/null 2>&1
# Revert the deletion of this one, we wanna keep it
git checkout -- README.md

# Copy angular app in here
echo copy app
cp -a "../dist/." .
cp index.html 404.html

echo add files
git add -A > /dev/null 2>&1

echo commit and push
# need 'ci skip' to ignore this branch in CircleCI
git commit --allow-empty -m "Deploy to branch '$BRANCH' [ci skip]"  > /dev/null 2>&1
git push --force --quiet origin $BRANCH > /dev/null 2>&1

echo cleanup
cd ..
rm -rf $BRANCH_DIR