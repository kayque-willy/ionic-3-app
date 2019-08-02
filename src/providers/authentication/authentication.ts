import { DatabaseProvider, User } from './../database/database';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthenticationProvider {

  authenticationState = new BehaviorSubject(false);

  constructor(
    private db: DatabaseProvider
  ) { 
    this.authenticationState.next(true);
  }

  login(user: User): any {
    this.db.login(user)
      .then((data) => {
        this.authenticationState.next(true);
        return true;
      }, (error) => {
        return false;
      });
  }

  logout() {
    this.authenticationState.next(false);
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

}