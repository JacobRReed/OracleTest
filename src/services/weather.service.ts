import { Injectable } from "@angular/core";
import * as config from "../../client-configuration.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { LocationCurrent, LocationByDay } from "src/models/weather.model";

@Injectable({
  providedIn: "root"
})
export class WeatherService {
  apiKey: string = config.api.apiKey; //api key
  currentWeatherURL: string =
    config.api.apiUrl + "weather?appid=" + this.apiKey + "&units=imperial"; //Sets current weather endpoint with units in Farenheit
  weeklyWeatherURL: string =
    config.api.apiUrl + "forecast?appid=" + this.apiKey + "&units=imperial"; //Sets forecast weather endpoint with units in Farenheit

  constructor(private http: HttpClient) {} //Inject HttpClient for requests

  /**
   * Searches OpenWeatherMap api for location string weather (current)
   * @param location Location string to search
   */
  getCurrentWeather(location: string): Observable<LocationCurrent> {
    return this.http.get(this.currentWeatherURL + "&q=" + location).pipe(
      map(res => {
        //Map results to interface model
        let mapped: LocationCurrent = {
          country: res["sys"]["country"],
          humidity: res["main"]["humidity"],
          temperature: res["main"]["temp"],
          visibility: String(res["weather"][0]["description"]).replace(
            //Regex, change first letter of each word to caps
            /\w\S*/g,
            function(txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
          )
        };
        return mapped;
      })
    );
  }

  /**
   * Gets 5 day weekly forecast from OpenWeatherMap api based on location string
   * @param location Location string to search
   */
  getWeeklyWeather(location: string): Observable<LocationByDay[]> {
    return this.http.get(this.weeklyWeatherURL + "&q=" + location).pipe(
      map(res => {
        //Map data to interface model
        let mapped: LocationByDay[] = [];
        let fiveDay: any[] = []; //any because data coming back from api is large
        //Pull out every 8 from results (5 days total, 3hrs per result, 8*3=24hrs) and push to new array
        for (let i = 0; i < res["list"].length; i += 8) {
          fiveDay.push(res["list"][i]);
        }

        //For each day of results parsed, map to interface model
        fiveDay.forEach(day => {
          mapped.push({
            temperature: day["main"]["temp"],
            date: new Date(day["dt"] * 1000),
            image:
              "http://openweathermap.org/img/w/" +
              day["weather"][0]["icon"] +
              ".png", //URL for image
            description: String(day["weather"][0]["description"]).replace(
              //Regex, change first letter of each word to caps
              /\w\S*/g,
              function(txt) {
                return (
                  txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                );
              }
            ),
            lowTemp: day["main"]["temp_min"]
          });
        });
        return mapped;
      })
    );
  }

  /**
   * Searches OpenWeatherMap api for location based on coordinates (Current weather)
   * @param lat Latitude
   * @param long Longitude
   */
  getCurrentWeatherByCoords(
    lat: number,
    long: number
  ): Observable<LocationCurrent> {
    return this.http
      .get(this.currentWeatherURL + "&lat=" + lat + "&lon=" + long)
      .pipe(
        map(res => {
          //Map results to interface model
          let mapped: LocationCurrent = {
            country: res["sys"]["country"],
            name: res["name"],
            humidity: res["main"]["humidity"],
            temperature: res["main"]["temp"],
            visibility: String(res["weather"][0]["description"]).replace(
              //Regex, change first letter of each word to caps
              /\w\S*/g,
              function(txt) {
                return (
                  txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                );
              }
            )
          };
          return mapped;
        })
      );
  }

  /**
   * Gets 5 day weekly forecast from OpenWeatherMap api based on coordinates
   * @param lat Latitude
   * @param long Longitude
   */
  getWeeklyWeatherByCoords(
    lat: number,
    long: number
  ): Observable<LocationByDay[]> {
    return this.http
      .get(this.weeklyWeatherURL + "&lat=" + lat + "&lon=" + long)
      .pipe(
        map(res => {
          let mapped: LocationByDay[] = [];
          let fiveDay: any[] = []; //any because the data coming back from api isn't ours, and is large

          //Pull out every 8 from results (5 days total, 3hrs per result, 8*3=24hrs) and push to new array
          for (let i = 0; i < res["list"].length; i += 8) {
            fiveDay.push(res["list"][i]);
          }

          //For each day parsed, map to interface model
          fiveDay.forEach(day => {
            mapped.push({
              temperature: day["main"]["temp"],
              date: new Date(day["dt"] * 1000),
              image:
                "http://openweathermap.org/img/w/" +
                day["weather"][0]["icon"] +
                ".png", //URL for image
              lowTemp: day["main"]["temp_min"],
              description: String(day["weather"][0]["description"]).replace(
                //Regex, change first letter of each word to caps
                /\w\S*/g,
                function(txt) {
                  return (
                    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                  );
                }
              )
            });
          });
          return mapped;
        })
      );
  }
}
