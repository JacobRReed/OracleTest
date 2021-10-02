# OracleTest

 - Simple weather app written in Angular 8 for an interview I had before I started working at Oracle
 - Added some additional features:
    - You can enter `Manchester,NH` or just `Manchester`. It will ignore whitespace, and will find city based on api return, but use state code for accuracy.
    - You can get weather info based on your geolocation (this only works if geolocation is turned on, or you approve the prompt first time you navigate to the site, if you decline permissions you must change the settings for the specific site in your browser settings, or open an incognito tab **this is by design as you can never request a user's permission again after they decline it**. If you decline, or already declined the feature will be disabled and the button will not be clickable
    - Added a multi select with all the country codes, if you would like to search outside the US simply select the appropriate country code from dropdown and search as normal (default is United States). 
    - Added tooltips to most items in the site for "user help", including the country names when hovering over country codes.

# To Run:
  1. Navigate via terminal to root directory of project
    - `npm i`

  2. After packages are done installing:
      - `npm start`
  3. Open web browser and navigate to `http://localhost:8080`
      - if you want to change the port, you can do so in package.json 
      - if you want to build for prod and use via a server with NodeJS, `npm run build-prod`, copy contents of `dist/OracleTest` folder to server under folder `oracle-test`
