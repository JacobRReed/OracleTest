/*Holds base URL for api and api key
Would normally put this in a client-config.json, and use NgRx store
to save data to store and keep it persistent while navigating app, but it is a small app with no navigation.
For simplicity
*/
export var api = {
  apiUrl: "http://api.openweathermap.org/data/2.5/",
  apiKey: "20f0da32b3423f7795a28b32627bc970"
};
