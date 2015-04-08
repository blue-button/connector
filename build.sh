#!/bin/bash
# Build the site
git pull origin master;
npm run build-organizations;
npm run build-apps;
git status;
cd ../gh-pages;
git pull origin gh-pages;
cd ../connector;
grunt dist;
git add --all;
git commit -am "update data for one or more profiles";
git push origin master;
cd ../gh-pages;
git add --all;
git commit -am "update data for one or more profiles";
git push origin gh-pages;