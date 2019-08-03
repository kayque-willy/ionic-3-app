import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { TabsPage } from './../tabs/tabs';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Slides } from 'ionic-angular';
import { DatabaseProvider, User } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild('slides') slides: Slides;
  public wavesPosition: number = 0;
  public wavesDiference: number = 80;
  private loading: any;
  public userLogin: User = {
    id: null,
    name: '',
    email: '',
    password: '',
    img: '/assets/img/profile.png'
  }
  public userRegister: User= {
    id: null,
    name: '',
    email: '',
    password: '',
    img: '/assets/img/profile.png'
  }

  constructor(
    //Exibição da mensagem de loading
    private loadingCtrl: LoadingController,
    //Exibição de outras mensagens
    private toastCtrl: ToastController,
    //Autenticador do login
    private authService: AuthenticationProvider,
    //Banco de dados SQLite
    private db: DatabaseProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() { }

  segmentChanged(event: any) {
    if (event.value == "login") {
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDiference;
    } else {
      this.slides.slideNext();
      this.wavesPosition -= this.wavesDiference;
    }
  }

  async login() {
    await this.presentLoading();
    if(this.authService.login(this.userLogin)){
      this.loading.dismiss();
      this.navCtrl.push(TabsPage);
    }else{
      this.loading.dismiss();
      this.presentToast("Usuário ou senha inválidos!");
    }
  }

  async register() {
    await this.presentLoading();
    try {
      this.db.addUser(this.userRegister['name'],this.userRegister['email'],this.userRegister['password'], this.userRegister['img']);
    } catch (error) {
      this.presentToast(error.message);
    } finally {
      this.loading.dismiss();
      this.presentToast("Cadastro efetuado com sucesso!");
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDiference;
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({content: "Aguarde...",});
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

}