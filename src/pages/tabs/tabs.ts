import { Component } from '@angular/core';

import { FeedPage } from './../feed/feed';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = FeedPage;

  constructor() {

  }
}
