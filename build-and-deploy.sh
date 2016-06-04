#!/bin/bash
# Build the GH-Pages site, from Travis CI
git config user.name ${GIT_NAME}
git config user.email ${GIT_EMAIL}
git fetch;
npm run build-organizations;
npm run build-apps;
git status;
git add --all;
git commit -am "update data for one or more profiles";
git subtree push --force --prefix=public "https://${GH_TOKEN}@${GH_REF}" gh-pages;