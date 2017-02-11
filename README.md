# Site M Helper

**Site M Helper** is Site M helper NodeJS application.

## Features

Every 24 hours this application does the following procedure:
1. Acquires the list of projects currently on siteM from a Cloudant database.

2. Retrieves either personal repos or repos I have contributed in, that are in part 1's list.

3. Checks if any of these repos has had a push commit that is newer than the one currently
   in the database, if so updates the date.

4. Pushes all repo dates that where updated to the Cloudant database.

## Usages
SiteM acquires projects information from the same Cloudant database, which this application updates every 24 hours.
