import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit {
  constructor(
    private favoritesService: FavoritesService,
    private router: Router
  ) {}
  fromTemp: string = 'Fahrenheit';
  toTemp: string = 'Celsius';
  storageCheck: any[] = [];

  changeTemp() {
    this.fromTemp === 'Fahrenheit'
      ? ((this.fromTemp = 'Celsius'), (this.toTemp = 'Fahrenheit'))
      : ((this.fromTemp = 'Fahrenheit'), (this.toTemp = 'Celsius'));
  }

  displayCardOnMainPage(placeToDisplay) {
    this.favoritesService.changeFavoriteLocationToDisplay([placeToDisplay]);
    this.router.navigateByUrl('/home');
  }

  ngOnInit(): void {
    const storage = localStorage.getItem('favorite');
    if (storage !== null) {
      this.favoritesService.changeFavoriteLocation(JSON.parse(storage));
    }
    this.favoritesService.currentFavoriteLocation.subscribe((data) => {
      this.storageCheck = data;
    });
  }
}
