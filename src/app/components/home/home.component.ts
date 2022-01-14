import { Component, OnInit } from '@angular/core';
import { FavoritesService } from 'src/app/services/favorites.service';
import { WeatherService } from 'src/app/services/weather.service';
import { CountryInfoModel } from '../models/country-info.model';
import { CurrentConditionsModel } from '../models/current-conditions.model';
import { FiveDayModel } from '../models/five-day,model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private weatherService: WeatherService,
    private favoritesService: FavoritesService
  ) { }

  countryName: string;
  autoCompleteData: CountryInfoModel[] = [];
  currentConditionsData: CurrentConditionsModel[] = [];
  fiveDaysData: FiveDayModel[] = [];
  fromTemp: string = 'Fahrenheit';
  toTemp: string = 'Celsius';
  favorites: any[] = [];
  storageCheck: any[] = [];
  autoCompleteCountryNumber: number = 0;
  headlineText: string = '';
  acceptPostion: boolean = false;

  ngOnInit(): void {
    const storage = localStorage.getItem('favorite');
    if (storage !== null) {
      this.favoritesService.changeFavoriteLocation(JSON.parse(storage));
    }
    this.favoritesService.currentFavoriteLocationToDisplay.subscribe((data) => {
      if (data.length > 0) {
        this.autoCompleteData = [];
        this.autoCompleteData[0] = data[0].fav;
        this.searchForFiveDayInformation(
          this.autoCompleteData[this.autoCompleteCountryNumber].key
        );
      }
    });
    if (this.autoCompleteData.length <= 0) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          this.acceptPostion = true;
          this.onLoadingGetGeoInformation(position);
        } else {
          this.acceptPostion = false;
        }
      });
    }
  }

  onLoadingGetGeoInformation(position) {
    let result = [];
    this.weatherService
      .geoPositionSearch(position.coords.latitude, position.coords.longitude)
      .subscribe((items) => {
        if (items === 'we asked to much') {
          this.customAlert(
            'Ops...',
            'We have used to many time the API try again tomorrow',
            'error',
            'Close'
          );
          return;
        }
        result = [items];
        result.forEach((item) => {
          let autoCompleteDataObj: CountryInfoModel = {
            localizedName: item.LocalizedName,
            countryLocalizedName: item.Country.LocalizedName,
            countryID: item.Country.ID,
            key: item.Key,
          };
          this.autoCompleteData.push(autoCompleteDataObj);
        });
        this.searchForFiveDayInformation(
          this.autoCompleteData[this.autoCompleteCountryNumber].key
        );
        this.checkFavoriteLocation(
          this.autoCompleteData[this.autoCompleteCountryNumber]
        );
      });
  }

  changeCounty(status) {
    if (status === 'min') {
      if (this.autoCompleteCountryNumber !== 0) {
        this.autoCompleteCountryNumber--;
        this.searchForFiveDayInformation(
          this.autoCompleteData[this.autoCompleteCountryNumber].key
        );
      }
    } else {
      if (this.autoCompleteCountryNumber < this.autoCompleteData.length - 1) {
        this.autoCompleteCountryNumber++;
        this.searchForFiveDayInformation(
          this.autoCompleteData[this.autoCompleteCountryNumber].key
        );
      }
    }
  }

  changeTemp() {
    this.fromTemp === 'Fahrenheit'
      ? ((this.fromTemp = 'Celsius'), (this.toTemp = 'Fahrenheit'))
      : ((this.fromTemp = 'Fahrenheit'), (this.toTemp = 'Celsius'));
  }

  checkFavoriteLocation(favorite) {
    this.favoritesService.currentFavoriteLocation.subscribe((data) => {
      this.storageCheck = data;
    });
    const testingIfFavoriteAlreadyExist = this.storageCheck.some((item) => {
      return item.fav.localizedName === favorite.localizedName;
    });
    return testingIfFavoriteAlreadyExist ? true : false;
  }

  addFavorite(favorite, dayInformation) {
    this.favoritesService.currentFavoriteLocation.subscribe((data) => {
      this.storageCheck = data;
    });
    if (this.storageCheck !== null) {
      const testingIfFavoriteAlreadyExist = this.storageCheck.some(
        (item) => item.fav.localizedName === favorite.localizedName
      );
      if (!testingIfFavoriteAlreadyExist) {
        this.storageCheck.push({ fav: favorite, info: dayInformation });

        this.favoritesService.changeFavoriteLocation(this.storageCheck);
        localStorage.setItem('favorite', JSON.stringify(this.storageCheck));
      }
    } else {
      this.storageCheck = this.storageCheck;
      this.storageCheck.push({ fav: favorite, info: dayInformation });
      this.favoritesService.changeFavoriteLocation(this.storageCheck);
    }
    return;
  }

  removeFavorite(favorite) {
    this.favoritesService.currentFavoriteLocation.subscribe((data) => {
      this.storageCheck = data;
    });
    if (this.storageCheck !== null) {
      const testingIfFavoriteAlreadyExist = this.storageCheck.some(
        (item) => item.fav.localizedName === favorite.localizedName
      );
      if (testingIfFavoriteAlreadyExist) {
        const itemToRemove = this.storageCheck.findIndex(
          (item) => item.fav.localizedName === favorite.localizedName
        );
        this.storageCheck.splice(itemToRemove, 1);
        this.favoritesService.changeFavoriteLocation(this.storageCheck);
        localStorage.setItem('favorite', JSON.stringify(this.storageCheck));
      }
    }
    return;
  }

  customAlert(title, text, icon, btnText) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: btnText,
    });
  }

  searchForWeatherWithAutoComplete() {
    try {
      this.acceptPostion = true;
      if (!this.countryName) {
        this.customAlert(
          'Warning...',
          'You can not search for City without writing the city name.',
          'warning',
          'Close'
        );
      } else {
        this.weatherService
          .autoComplete(this.countryName)
          .subscribe((items) => {
            if (items === 'we asked to much') {
              this.customAlert(
                'Ops...',
                'We have used to many time the API try again tomorrow',
                'error',
                'Close'
              );
              return;
            }
            if (items.length === 0) {
              this.customAlert(
                'Sorry',
                "We didn't found the City you are looking for.",
                'info',
                'Close'
              );
              return;
            } else {
              this.autoCompleteData = [];
              let result = [];
              result = items;
              result.forEach((item) => {
                let autoCompleteDataObj: CountryInfoModel = {
                  localizedName: item.LocalizedName,
                  countryLocalizedName: item.Country.LocalizedName,
                  countryID: item.Country.ID,
                  key: item.Key,
                };
                this.autoCompleteData.push(autoCompleteDataObj);
              });
              this.searchForFiveDayInformation(
                this.autoCompleteData[this.autoCompleteCountryNumber].key
              );
              this.checkFavoriteLocation(
                this.autoCompleteData[this.autoCompleteCountryNumber]
              );
            }
          });
      }
    } catch (error) {
      console.error(error);
    }
  }

  getCurrentConditions() {
    let currentInfo = [];
    this.weatherService
      .currentConditions(
        this.autoCompleteData[this.autoCompleteCountryNumber].key
      )
      .subscribe((items) => {
        if (items === 'we asked to much') {
          this.customAlert(
            'Ops...',
            'We have used to many time the API try again tomorrow',
            'error',
            'Close'
          );
          return;
        }
        currentInfo = items;
        currentInfo.forEach((item) => {
          let currentConditionsDataObj: CurrentConditionsModel = {
            localObservationDateTime: item.LocalObservationDateTime,
            WeatherIcon: item.WeatherIcon,
            temperature: item.Temperature.Imperial.Value,
          };
          this.currentConditionsData.push(currentConditionsDataObj);
        });
      });
  }

  searchForFiveDayInformation(key) {
    this.fiveDaysData = [];
    let result = [];
    this.weatherService.fiveDaysForecasts(key).subscribe((items) => {
      result = [items];
      this.headlineText = result[0].Headline.Text;
      result[0].DailyForecasts.map((item) => {
        let fiveDayObj: FiveDayModel = {
          date: item.Date,
          temperatureMaximum: item.Temperature.Maximum.Value,
          temperatureMinimum: item.Temperature.Minimum.Value,
          dayIcon: item.Day.Icon,
        };
        this.fiveDaysData.push(fiveDayObj);
      });
    });
    this.getCurrentConditions();
  }
}
