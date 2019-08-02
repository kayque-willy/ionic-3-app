import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class MovieProvider {
  private api_path = "https://api.themoviedb.org/3/"
  private api_key = "?api_key=8ed4ec61f85e1d644dee824cd87a9a01"

  constructor(
    public http: HttpClient) {
  }

  getLatesMovies() {
    return this.http.get(this.api_path + "movie/popular" + this.api_key);
  }

}
