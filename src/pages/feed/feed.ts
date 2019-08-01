import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MovieProvider } from '../../providers/movie/movie';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
  providers: [
    MovieProvider
  ]
})

export class FeedPage {
  lista_filmes = new Array<any>();
  loading;
  isLoading = false;
  public objeto_feed = {
    nome: "Kayque Oliveira",
    data: "29 de julho de 2019",
    descricao: "Estou criando um App IONIC",
    likes: 12,
    comments: 4,
    time_comment: "12 horas atrás"
  }

  constructor(
    private movieProvider: MovieProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.movieProvider.getLatesMovies().subscribe(
      data => {
        const objeto_retorno = JSON.parse(JSON.stringify(data));
        this.lista_filmes = objeto_retorno.results;
        console.log(this.lista_filmes);
      }, error => {
        console.log(error);
      }
    );
  }


}
