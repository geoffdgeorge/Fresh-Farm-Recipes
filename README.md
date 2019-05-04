# **Fresh Farm Recipes**
Fresh Farm Recipes is a front-end application relying primarily on two APIs to provide recipe suggestions to any user, based on up to three fresh ingredients they can submit as search parameters. The application also provides the locations and schedules of nearby farmers markets where ingredients can be obtained, based on a zip code submitted by the user.

# Table of Contents

* ### [Dependencies](https://github.com/geoffdgeorge/Fresh-Farm-Recipes/tree/develop#dependencies-1)
* ### [How It Works](https://github.com/geoffdgeorge/Fresh-Farm-Recipes/tree/develop#how-it-works-1)
* ### [Future Plans](https://github.com/geoffdgeorge/Fresh-Farm-Recipes/tree/develop#future-plans-1)

# Dependencies

The Fresh Farm Recipes app relies on two APIs and three libraries:

* [The Edamam API](https://developer.edamam.com/) (which returns recipes based on provided ingredients)
* [The USDA Farmers Market API](https://search.ams.usda.gov/farmersmarkets/v1/svcdesc.html) (which returns the locations and schedules of more than 8,600 registered farmers markets across the US)
* [jQuery](https://jquery.com/) (to power the site's front-end functionality, including the AJAX requests to the two APIs)
* [Leaflet](https://leafletjs.com/) (to build and populate the map displaying the names, addresses, and schedules of nearby farmers markets)
* [Bootstrap](https://getbootstrap.com/) (to rapidly and uniformly build out the app's HTML/CSS)

# How It Works

Ninety-nine percent of what happens on the Fresh Farm Recipes app is handled essentially by two large click functions tied to the app's two submit forms. When a user submits one, two, or three ingredients via the first form, an AJAX call is made to the Edamam API with the values of the input fields concatenated into the full query URL string. The data that's returned from the AJAX is then used to build a quintet of cards with recipe names, photos, and links. The user is shown only the top five results, so as not to overwhelm them with too many options and to keep the layout of the page tidy.

When a user submits a zip code via the second form, an AJAX call is made to the USDA Farmers Market API, which returns the IDs of nearby markets. A nested AJAX call is then made within the first call to obtain the data tied to each unique ID, and this data is then used to populate both a map and an accompanying list of farmer's market locations.

The map is built with Leaflet, which relies on coordinates not only to center the map over a specific area but also to populate the map with markers containing the farmers market data. The USDA Farmers Market API provides the coordinates for each market, but embedded within a Google Maps link, so a series of split calls is used to pull the longitude and latitude out of the longer URL string, like so:

```JS
const marketMapURL = secondaryResults.marketdetails.GoogleLink;
const frontChop = marketMapURL.split('q=');
const backChop = frontChop[1].split('(');
const lonLatChop = backChop[0].split('%2C');
const latChop = lonLatChop[1].split('%20');
const lon = lonLatChop[0];
const lat = latChop[1];
const marker = L.marker([lon, lat]).addTo(newMap);
```

The map is then centered on the marker for the closest market.

# Future Plans