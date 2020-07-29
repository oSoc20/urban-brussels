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


# Getting started

## Run locally

1. Clone the project
   ```bash
   git clone https://github.com/oSoc20/urban-brussels.git
   ```

2. Copy the `.env.example` to `.env`
   ``` bash
   cp .env.example .env
   ```

3. Replace the `MY_SECRET_MAPBOX_ACCESS_TOKEN` value by your generated Mapbox access token

4. Install the necessary packages
   ``` bash
   npm install
   ```

5. Run the project
   ``` bash
   npm run bundle
   ```

Navigate to http://localhost:1234. You should see the project running.

**NOTE:** The default api url used is https://api.urban-brussels.osoc.be, get to know more about it in the 
[the backend](https://github.com/oSoc20/urban-brussels-api) repository.

# Usage
**Landing Page**

The landing page is built up with a large dynamic map as background. 
On the center left we have a component which stores the search bar, a random search or ‘get lucky’ button and a fun facts container.

The random search button automatically generates a random building and brings the user to the detail page of that building. 

When clicking a tag that’s incorporated in the fun fact, you will immediately be redirected to the building list, where you will find the results for searching on that tag.

**Building List Page**

This is where you will end up when you have entered a search into the search bar on the home page (or if you clicked on a tag in a fun fact for example). we have the toggle next to ‘search as I move the map’. Toggling this feature on will
disable automatic filtering when you move the map.

**Detail Page**

The building details include the position on the map and the different style, type and architect tags. To Get to know more button, which redirects to the Iris Monument page of this specific building, as there is often more information to be found there.

**Dashboard**

On the dashboard we want to visualise the data in the dataset, or if you search for something, the data that corresponds to your search.


