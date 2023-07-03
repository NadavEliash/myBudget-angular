import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'my-budget'

  onSelectPage(page: string) {
    this.currPage = {
      home: false,
      ministry: false,
      statistics: false
    }
    this.currPage[page] = true
  }

  currPage: { [key: string]: boolean } = {
    home: true,
    ministry: false,
    statistics: false
  }
}
