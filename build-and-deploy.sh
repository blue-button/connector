#!/bin/bash
# Build the site
git pull origin master;
npm run build-organizations;
npm run build-apps;
git status;
git add --all;
git commit -am "update data for one or more profiles";
git push origin master;
git subtree push --prefix public origin gh-pages;