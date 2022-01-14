import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private _renderer: Renderer2) {}
  savedTheme = localStorage.getItem('theme');
  toggleTheme = new FormControl(false);
  isChecked: boolean = false;

  checkThemeOnPageLoad() {
    if (this.savedTheme !== null) {
      if (this.savedTheme === 'true') {
        this.toggleTheme = new FormControl(true);
        this._renderer.addClass(document.body, 'dark-theme');
        this.isChecked = true;
      } else {
        this._renderer.addClass(document.body, 'light-theme');
        this.toggleTheme = new FormControl(false);
        this.isChecked = false;
      }
    }
  }

  ngOnInit(): void {
    this.checkThemeOnPageLoad()
    this.toggleTheme.valueChanges.subscribe((toggleValue) => {
      if (toggleValue === true) {
        this.isChecked = true;
        this._renderer.addClass(document.body, 'dark-theme');
        this._renderer.removeClass(document.body, 'light-theme');
        localStorage.setItem('theme', toggleValue);
      } else {
        this.isChecked = false;
        this._renderer.addClass(document.body, 'light-theme');
        this._renderer.removeClass(document.body, 'dark-theme');
        localStorage.setItem('theme', toggleValue);
      }
    });
  }
}
