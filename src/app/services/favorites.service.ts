import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  // save favorites locations
  private favoriteLocations = new BehaviorSubject<any[]>([]);
  currentFavoriteLocation = this.favoriteLocations.asObservable();
  // display on click favorite location
  private displayFavoriteLocation = new BehaviorSubject<any[]>([]);
  currentFavoriteLocationToDisplay =
    this.displayFavoriteLocation.asObservable();
  constructor() {}

  changeFavoriteLocation(favoritePlaces: any[]) {
    this.favoriteLocations.next(favoritePlaces);
  }
  changeFavoriteLocationToDisplay(favoritePlace: any[]) {
    this.displayFavoriteLocation.next(favoritePlace);
  }
}
