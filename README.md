Libraries on Twitter
====================

Listing public libraries on Twitter.  The project is currently deployed to http://twitter.librarieshacked.org with data updated around every hour for authorities and individual libraries.

Potentially to be replaced by the project at socialmedia-librarydata.

How it works
------------

A google sheet available at [https://s.coop/libtwit/](https://s.coop/libtwit/) holds spreadsheet tabs for Library Authorities, Individual Libraries and Specialist Libraries.

Primarily this data was compiled from lists by the Libraries Taskforce in England, although also with help from @ShedSue. The vast majority then are English Library authorities and libraries. Though there are 151 authorities in England and around 160 (at 27/09/2017) in the authorities sheet.

For each listing the sheet holds the twitter account name.  A google apps script runs every hour to read the data from the Google sheet and then go off to query the Twitter API.  It retrives further information such as the current latest tweet, number of followers, tweets, last tweeted date, etc.  This data is compiled and then directly uploaded to this website. The data is then used by the table and gallery in this project.

Future
------

The sheet is starting to hold data on other social media accounts: YouTube, Instagram, Flickr, and Facebook. In future the project will be updated to query all these social media APIs on a regular basis, to build up a picture of social media use across those libraries. This could be used just for browsing purposes or for in depth analysis.

Licence
-------

MIT
