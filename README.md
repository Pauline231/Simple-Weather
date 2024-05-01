# Simple Weather App

As instructed, this a very simple weather app which uses following APIs:

Weather API: https://open-meteo.com/en/docs/#latitude=28&longitude=84&timezone=auto
Geo Location API : https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/#code-samples

The program first takes input from the user about the location which is then sent to GeoLocation Api and latitude and longitude of
the location is returned. They are then sent as parameters to the Weather API to fetch the required weather of the location.
The API fetches prediction for 4 days including today, current apparent temperature, cloud, windgush, humidity and rain info. 
The images are also made to change according to some conditions which you can see in the code.

In order to change the location, you need to type in the text and press 'Enter' key and only then the APi will be triggered. 
The UI is made responsive with Tailwind CSS. 

Api-client.ts consists the API controllers as there is no requirement of any Backend server.
All of my confusions, incorrect codes, miscalculations and different methods that I used during its development are not erased and are commented for you to see.