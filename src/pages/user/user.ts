import { UsersPage } from './../users/users';
import { User, DatabaseProvider } from './../../providers/database/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})

export class UserPage {
  user: User = {
    id: null,
    name: '',
    email: '',
    password: '',
    img: '/assets/img/profile.png'
  }

  constructor(
    private toast: ToastController,
    private db: DatabaseProvider,
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
      let userId = navParams.get('id');
      this.db.getUser(userId).then(data => {
        this.user = data;
      });
  }

  delete() {
    this.db.deleteUser(this.user.id).then(async() => {
      let toast = await this.toast.create({
        message: 'Usuário removido!',
        duration: 3000
      });
     this.navCtrl.push(UsersPage);
     toast.present();
    });
  }

  updateUser() {
    this.db.updateUser(this.user).then(async (res) => {
      let toast = await this.toast.create({
        message: 'Usuário atualizado!',
        duration: 3000
      });
      this.navCtrl.push(UsersPage);
      toast.present();
    });
  }

}
