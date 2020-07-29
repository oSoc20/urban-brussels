# Urban-brussels
Together with Urban.Brussels, we want to build an open web application that will visualize and map more than 35k urban properties to preserve the cultural heritage and history of Brussels.

# Table of contents
* [About the project](#about-the-project)
* [Getting started](#getting-started)
* [Usage](#usage)

# About project

Raise public awareness around Brussels’heritage and build the city of tomorrow today.

This project focuses primarily on architectural students and researchers but also on people who
want to modify certain aspects of buildings and landscape and want to check the legality of this.
Another target audience are tourists who would like to inform themselves about Brussels & architecture.
Our goal is to build the bridge between the urban database on streets, statues and regional areas and the community of
Brussels in an interactive and user-friendly way.


# Getting started (INSTALL.md)

# Usage
**Landing Page**

The landing page is built up with a large dynamic map as background. On top of the map in
the top right corner we have a button that directly redirects to the dashboard page (see later), and a button to change your language (from dutch to french and vice versa). 

On the center left we have a component which stores the search bar, a random search or‘get lucky’ button and a fun facts container.

The random search button automatically generates a random building and brings the userto the detail page of that building. This was implemented to give tourists or users who don’t immediately know what to search for in this database a quick and easy way to get to know more by showing a specific building, after which they might look into more buildings of that same typology or style for example.

The fun fact container was also made for the same reason as the random search button, namely to get the user up to speed with the database. These fun facts contain insights we found while analysing the database and some information about rare buildings and what’s so special about them. When clicking a tag that’s incorporated in the fun fact, you will immediately be redirected to the building list, where you will find the results for searching on that tag.

**Building List Page**

This is then the building list page or also called the search results page. This is where you will end up when you have entered a search into the search bar on the home page (or if you clicked on a tag in a fun fact for example). we have the toggle next to ‘search as I move the map’. Toggling this feature on will
disable automatic filtering when you move the map.

**Detail Page**

The building details include the position on the map and the different style, type and architect tags. Furthermore we show the address, and if there is a name of the building in our database, that will also be shown above the address. Under the details we have a Get to know more button, which redirects to the Iris Monument page of this specific building, as there is often more information to be found there.

**Dashboard**

This is the so-called dashboard. On the dashboard we want to visualise the data in the dataset, or if you search for something, the data that corresponds to your search.


