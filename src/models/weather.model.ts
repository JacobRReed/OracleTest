/**
 * Current weather data for location
 */
export interface LocationCurrent {
  temperature: number;
  visibility: string;
  humidity: number;
  name?: string;
  country: string;
}

/**
 * Data for a day at location
 */
export interface LocationByDay {
  date: Date;
  image: string;
  temperature: number;
  lowTemp: number;
  description: string;
}
