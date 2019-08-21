import { Component, OnInit, Input } from "@angular/core";
import { LocationByDay } from "src/models/weather.model";

@Component({
  selector: "app-weather-day",
  templateUrl: "./weather-day.component.html",
  styleUrls: ["./weather-day.component.scss"]
})
export class WeatherDayComponent implements OnInit {
  @Input() day: LocationByDay; //Day of data

  constructor() {}

  ngOnInit() {}
}
