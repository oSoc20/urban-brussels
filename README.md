# Urban-brussels
Together with Urban.Brussels, we want to build an open web application that will visualize and map more than 35k urban properties to preserve the cultural heritage and history of Brussels.

# Table of contents
* [About the project](#about-the-project)
* [Getting started](#getting-started)
* [Usage](#usage)
* [Contact](#contact)

# About project

Raise public awareness around Brussels’heritage and build the city of tomorrow today.

This project focuses primarily on architectural students and researchers but also on people who
want to modify certain aspects of buildings and landscape and want to check the legality of this.
Another target audience are tourists who would like to inform themselves about Brussels & architecture.


# Getting started
1. Install the used npm packages
```
npm install
```
2. Run Lockally
```
npm run bundle
```
3. Build
Ctrl + click

4. API Repo

# Usage
*Landing Page*
The landing page is built up with a large dynamic map as background. On top of the map in
the top right corner we have a button that directly redirects to the dashboard page (see later), and a button to change your language (from dutch to french and vice versa). In the bottom right corner we have a button to change the map shown. Here we see the version where we clicked on the button already, showing the different options. These options are defined to be either our custom Mapbox map (shown here as background), the black and white BruGIS/UrbGIS map or an aerial map of Brussels.

On the center left we have a component which stores the search bar, a random search or‘get lucky’ button and a fun facts container.

The search bar helps the user search through the database with help of an autocomplete algorithm?. 

The random search button automatically generates a random building and brings the userto the detail page of that building. This was implemented to give tourists or users who don’t immediately know what to search for in this database a quick and easy way to get to know more by showing a specific building, after which they might look into more buildings of that same typology or style for example.

The fun fact container was also made for the same reason as the random search button, namely to get the user up to speed with the database. These fun facts contain insights we found while analysing the database and some information about rare buildings and what’s so special about them. When clicking a tag that’s incorporated in the fun fact, you will immediately be redirected to the building list, where you will find the results for searching on that tag.


# Contact
list of git profiles of the team
