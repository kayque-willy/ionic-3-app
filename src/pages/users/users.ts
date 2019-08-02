import { DatabaseProvider } from './../../providers/database/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers/database/database';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})

export class UsersPage {

  users: User[] = [];
  products: Observable<any[]>;
  user: User = {
    id: null,
    name: '',
    email: '',
    password: '',
    img: '/assets/img/profile.png'
  }
  product = {
    name: '',
    creator: ''
  };
  selectedView = 'users';

  constructor(
    private db: DatabaseProvider,
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getUsers().subscribe(users => {
          this.users = users;
        })
        this.db.getProducts().subscribe(products => {
          this.products = this.db.getProducts();
        })
      }
    });
  }

  addUser() {
    this.db.addUser(this.user['name'], this.user['email'], this.user['password'], this.user['img'])
    .then(_ => { 
      this.user = {
        id: null,
        name: '',
        email: '',
        password: '',
        img: '/assets/img/profile.png'
      }
    });
  }
 
  addProduct() {
    this.db.addProduct(this.product['name'], this.product['creator'])
    .then(_ => {
      this.product  = {
        name: '',
        creator: ''
      };
    });
  }

}
