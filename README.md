Blue Button "Connector" web site.
---

## API
The Connector provides a simple public HTTP API. Check out the [API documentation](http://api.bluebuttonconnector.healthit.gov) or check out its [repository](https://github.com/blue-button/connector-API).


## Technical architecture
The website is built using some Node.js-based tools and the API as the data source. To reduce the cost of maintenance and increase reliability, as of this writing the site is generated as a set of static files and uses free or low-cost hosting systems. The one exception is searching for MU Stage 2 providers, which makes xhr calls to the API. The build scripts run once per day and check for any approved updates to the data in the API.


### Updating the data
Corrections and additions are handle via two public web forms. Each entry is staged until an admin approves (or rejects) it.

### Building the site
A Grunt.js script handles building many of the base files; CSS from Stylus, HTML from Jade, uglifying the JavaScript. The organization directory and profile pages are built by running `npm run build-organizations`. Likewise the app (a.k.a "receivers") directory is built with `npm run build-apps`. Note that these steps require data from the API during the build.

### Deploying
Running `grunt dist` will create a set of deployable files in the `public` directory, which are then copied to `../gh-pages`. It is assumed that a directory by that name will be there, which should be a clone of this repository set to the `gh-pages` branch. `git push origin gh-pages` will then deploy the site to Github pages.
