Blue Button "Connector" web site.
---

# NOTE: As of May 2017, the Connector website is essentially "deprecated." It will no longer be updated/maintained.

## API
The Connector provides a simple public HTTP API. Check out the [API documentation](http://api.bluebuttonconnector.healthit.gov) or check out its [repository](https://github.com/blue-button/connector-API).


## Technical architecture
The website is built using some Node.js-based tools and the API as the data source. To reduce the cost of maintenance and increase reliability, as of this writing the site is generated as a set of static files and uses free or low-cost hosting systems. The one exception is searching for Meaningful Use Stage 2 providers, which makes xhr calls to the API (see below).

### Updating the data
Corrections and additions are handle via two public web forms. Each entry is staged until an admin approves (or rejects) it.

### Building the site
A Grunt.js script handles building many of the base files; CSS from Stylus, HTML from Jade, uglifying the JavaScript. The organization directory and profile pages are built by running `npm run build-organizations`. Likewise the app (a.k.a "receivers") directory is built with `npm run build-apps`. Note that these steps require data from the API during the build.

In addition to the individual `npm` commands, there is a higher level `build-and-deploy.sh` bash script that combines these commands with the necessary `git` commands, changing directories and branches as necessary, and pushes changes to the site. Currently, this build script run once per day to check for any approved updates to the data in the API. See details on [the Wiki](https://github.com/blue-button/connector/wiki/Automated-builds).

### Meaningful Use Stage 2
The MUStage2 data is its own party. A few times a year, new exports are published on the [CMS.gov site](http://www.cms.gov/Regulations-and-Guidance/Legislation/EHRIncentivePrograms/DataAndReports.html) (scroll down to "CSV Files"). Those two files need to be put in the `scripts` directory. Then run `node src/scripts/import-stage2.js`. This formats the data in a way that it can be more easily used here on the Connector, and spits out `stage2.json` and `stage2.csv` files under `public/data`. Finally, the .json file is imported directly into the database that backs the API.

### Deploying
Running `build-and-deploy.sh` will pull the latest changes from the API, bulid the files, commit, and push to both master and subtree to gh-pages. will then deploy the site to Github pages.
