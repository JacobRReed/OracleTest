import { Component, OnInit, HostListener } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { WeatherService } from "src/services/weather.service";
import { LocationCurrent, LocationByDay } from "src/models/weather.model";
import { CountryCodePair, countryCodes } from "src/models/country-codes.model";

@Component({
  selector: "app-weather-panel",
  templateUrl: "./weather-panel.component.html",
  styleUrls: ["./weather-panel.component.scss"]
})
export class WeatherPanelComponent implements OnInit {
  locationFormControl = new FormControl("", [Validators.required]); //Form control for location
  currentWeather: LocationCurrent; //Holds data for current location
  weeklyWeather: LocationByDay[]; //Holds forecast data for current location
  geolocationEnabled: boolean = true; //Whether or not geolocation is enabled for user's browser
  geoNavigator: any; //Legacy browser support for navigator typings
  countryCodeSelected: string = "US"; //Defaults to United States
  countryCodes: CountryCodePair[] = countryCodes; //Holds all country codes for selecting other countries

  constructor(private weatherServ: WeatherService) {
    this.geoNavigator = window.navigator; //Grabs navigator from window
  }

  ngOnInit() {
    //Check if geolocation permissions are allowed, if not disable geolocation button
    this.geoNavigator.permissions
      .query({ name: "geolocation" })
      .then(status => {
        if (status.state === "denied") {
          this.geolocationEnabled = false;
        }
      });
  }

  /**
   * Checks if user has geo location permission granted
   * if so uses coordinates to get weather data
   * otherwise requests permissions
   */
  useGeolocation(): void {
    if (this.geolocationEnabled) {
      if (this.geoNavigator.geolocation) {
        this.geoNavigator.geolocation.getCurrentPosition(
          position => {
            this.geolocationEnabled = true;
            const long = position.coords.longitude;
            const lat = position.coords.latitude;

            //Get current weather for location based on coordinates
            this.weatherServ.getCurrentWeatherByCoords(lat, long).subscribe(
              data => {
                this.currentWeather = data; //Sets current weather data
                this.countryCodeSelected = data.country; //Set country code to coordinates
                this.locationFormControl.setValue(data["name"]); //Set city name in search input for user to see, since they searched via coordinates
              },
              error => {
                //No location found, wipe form and set text to show user nothing was found
                this.currentWeather = undefined;
                this.locationFormControl.setValue("No Location Found");
              }
            );

            //Get weekly forecast for location via coordinates
            this.weatherServ.getWeeklyWeatherByCoords(lat, long).subscribe(
              data => {
                this.weeklyWeather = data; //Sets forecast data
              },
              error => {
                //No location found, wipe form and set text to show user nothing was found
                this.weeklyWeather = [];
                this.locationFormControl.setValue("No Location Found");
              }
            );
          },
          error => {
            //user denied permissions for geolocation tracking, set boolean to disable button and set tooltip for help
            this.geolocationEnabled = false;
          }
        );
      } else {
        console.warn(
          "No support for geolocation. Change options in browser to allow geo location."
        );
      }
    }
  }

  /**
   * When location is submitted via Enter key or pressing search icon
   */
  locationSubmit() {
    let location: string = this.locationFormControl.value; //Get input value from form
    location.replace(" ", ""); //remove white space
    location += "," + this.countryCodeSelected; //Tack on country code

    //Get current weather for location based on input
    this.weatherServ.getCurrentWeather(location).subscribe(
      data => {
        this.currentWeather = data; //Sets current weather data
      },
      error => {
        //No location found, wipe form and set text to show user nothing was found
        this.currentWeather = undefined;
        this.locationFormControl.setValue("No Location Found");
      }
    );

    //Weekly forecast for city
    this.weatherServ.getWeeklyWeather(location).subscribe(
      data => {
        this.weeklyWeather = data; //Sets forecast data
      },
      error => {
        //No location found, wipe form and set text to show user nothing was found
        this.weeklyWeather = [];
        this.locationFormControl.setValue("No Location Found");
      }
    );
  }

  /**
   * Resets search
   * Sets location field to blank
   * Resets country code to default
   */
  resetLocation() {
    this.locationFormControl.reset();
    this.weeklyWeather = [];
    this.currentWeather = undefined;
    this.countryCodeSelected = "US";
  }
}
