import { DatabaseProvider, User } from './../database/database';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthenticationProvider {

  authenticationState = new BehaviorSubject(false);

  constructor(
    private db: DatabaseProvider
  ) { }

  login(user: User): any {
    if (this.db.login(user)) {
      this.authenticationState.next(true);
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.authenticationState.next(false);
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

}