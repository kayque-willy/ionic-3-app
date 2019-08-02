import { AuthenticationProvider } from './../providers/authentication/authentication';
import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  // templateUrl: 'app.html'
  template: '<ion-nav #nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  @ViewChild('nav') navCtrl: NavController
  rootPage:any = LoginPage;
  // rootPage:any = TabsPage;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    // navCtrl: NavController, 
    splashScreen: SplashScreen,
    private authenticationProvider: AuthenticationProvider,
    ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.authenticationProvider.authenticationState.subscribe(state => {
        if (state) {
          this.navCtrl.push(TabsPage);
        } else {
          this.navCtrl.push(LoginPage);
        }
      });
    });
  }
}
