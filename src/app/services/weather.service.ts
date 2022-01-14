import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  apiKey: string = 'frFiBGSWgU9glxo5fiv608R9chQiG2ZB';

  constructor(private httpClient: HttpClient) {}

  autoComplete(countryName): Observable<any> {
    return this.httpClient
      .get(
        `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${this.apiKey}&q=${countryName}`
      )
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    return ['we asked to much'];
  }
  currentConditions(countryKey): Observable<any> {
    return this.httpClient
      .get(
        `https://dataservice.accuweather.com/currentconditions/v1/${countryKey}?apikey=${this.apiKey}`
      )
      .pipe(catchError(this.handleError));
  }

  fiveDaysForecasts(countryKey): Observable<any> {
    return this.httpClient.get(
      `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${countryKey}?apikey=${this.apiKey}`
    );
  }

  geoPositionSearch(lat, lon): Observable<any> {
    return this.httpClient
      .get(
        `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${this.apiKey}&q=${lat}%2C${lon}`
      )
      .pipe(catchError(this.handleError));
  }
}
