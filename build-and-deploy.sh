#!/bin/bash
# Build the GH-Pages site, from Travis CI
git config user.name ${GIT_NAME}
git config user.email ${GIT_EMAIL}
git fetch;
git status;
npm run build-organizations;
npm run build-apps;
git add --all;
git commit -am "update data for one or more profiles";
git subtree split --prefix public -b gh-pages;
git status;
git checkout gh-pages;
git status;
git push -f "https://${GH_TOKEN}@${GH_REF}" gh-pages:gh-pages