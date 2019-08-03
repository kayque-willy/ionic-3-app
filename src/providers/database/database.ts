import { Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number,
  name: string,
  email: string,
  password: string,
  img: string
}

@Injectable()
export class DatabaseProvider {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  users = new BehaviorSubject([]);
  products = new BehaviorSubject([]);

  constructor(
    private plt: Platform,
    private sqlite: SQLite,
    private http: HttpClient
  ) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'users.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.seedDatabase();
        this.loadUsers();
      }).catch(e => console.error(e));
    });
  }

  //Preenche o banco de dados
  seedDatabase() {
    this.database .sqlBatch([
      ['CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT,  password TEXT, img TEXT);'],
      ['CREATE TABLE IF NOT EXISTS product( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, creatorId INTEGER);'],
      ['INSERT or IGNORE INTO user (id, name, email, password, img) VALUES (1, \'Simon\', \'email1@email.com\', \'123\', \'https://pbs.twimg.com/profile_images/858987821394210817/oMccbXv6_bigger.jpg\');'],
      ['INSERT or IGNORE INTO user (id, name, email, password, img) VALUES (2, \'Max\', \'email2@email.com\', \'123\', \'https://pbs.twimg.com/profile_images/953978653624455170/j91_AYfd_400x400.jpg\');'],
      ['INSERT or IGNORE INTO user (id, name, email, password, img) VALUES (3, \'Ben\', \'email3@email.com\', \'123\', \'https://pbs.twimg.com/profile_images/1060037170688417792/vZ7iAWXV_400x400.jpg\');'],
      ['INSERT or IGNORE INTO product(id, name, creatorId) VALUES (1, \'Ionic Academy\', 1);\');'],
      ['INSERT or IGNORE INTO product(id, name, creatorId) VALUES (2, \'Software Startup Manual\', 1);'],
      ['INSERT or IGNORE INTO product(id, name, creatorId) VALUES (3, \'Ionic Framework\', 2);'],
      ['INSERT or IGNORE INTO product(id, name, creatorId) VALUES (4, \'Drifty Co\', 2);'],
      ['INSERT or IGNORE INTO product(id, name, creatorId) VALUES (5, \'Drifty Co\', 3);']
    ]).then(_ => {
      this.dbReady.next(true);
      console.log("Banco criado com sucesso!");
    }).catch(e => console.error(e));
    this.loadUsers();
    this.loadProducts();

    // this.http.get('assets/seed.sql', { responseType: 'text' })
    //   .subscribe(sql => {
    //     this.database.executeSql(sql, []).then(_ => {
    //         this.loadUsers();
    //         this.loadProducts();
    //         this.dbReady.next(true);
    //         console.log("Banco criado com sucesso!");
    //       }).catch(e => console.error(e));
    //   });
  }

  //CRU DO USUARIO
  //Carrega todos os usuários
  loadUsers() {
    return this.database.executeSql('SELECT id, name, email, img FROM user', []).then(data => {
      let users: User[] = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          users.push({
            id: data.rows.item(i).id,
            name: data.rows.item(i).name,
            email: data.rows.item(i).email,
            password: data.rows.item(i).password,
            img: data.rows.item(i).img
          });
        }
      }
      this.users.next(users);
    }).catch(e => console.error(e));
  }

  // adiciona usuario
  addUser(name, email, password, img) {
    let data = [name, email, password, img];
    return this.database.executeSql('INSERT INTO user (name, email, password, img) VALUES (?, ?, ?, ?)', data).then(data => {
      console.log("Usuario adicionado com sucesso!");
      this.loadUsers();
    }).catch(e => console.error(e));
  }

  // retorna usuario pelo id
  getUser(id): Promise<User> {
  return this.database.executeSql('SELECT * FROM user WHERE id = ?', [id]).then(data => {
    return {
      id: data.rows.item(0).id,
      name: data.rows.item(0).name,
      email: data.rows.item(0).email,
      password: data.rows.item(0).password,
      img: data.rows.item(0).img
    }
  });
  }

  //Verifica o login
  login(user: User): any {
    let data = [user.email, user.password];
    return this.database.executeSql('SELECT * FROM user WHERE email = ? and password = ?', data);
  }

  //remove usuario
  deleteUser(id) {
    return this.database.executeSql('DELETE FROM user WHERE id = ?', [id]).then(_ => {
      console.log("Usuario removido com sucesso!");
      this.loadUsers();
      this.loadProducts();
    }).catch(e => console.error(e));
  }

  // atualiza usuario
  updateUser(user: User) {
    let data = [user.name, user.password, user.email, user.img];
    return this.database.executeSql(`UPDATE user SET name = ?, password = ?,  email = ?, img = ? WHERE id = ${user.id}`, data).then(data => {
      this.loadUsers();
    }).catch(e => console.error(e));;
  }

  //CRUD DO PRODUTO
  //Carrega todos os produtos
  loadProducts() {
    let query = 'SELECT product.name, product.id, user.name AS creator FROM product JOIN user ON user.id = product.creatorId';
    return this.database.executeSql(query, []).then(data => {
      let products = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          products.push({
            name: data.rows.item(i).name,
            id: data.rows.item(i).id,
            creator: data.rows.item(i).creator,
          });
        }
      }
      this.products.next(products);
    }).catch(e => console.error(e));
  }

  //Adiciona um produto
  addProduct(name, creator) {
    let data = [name, creator];
    return this.database.executeSql('INSERT INTO product (name, creatorId) VALUES (?, ?)', data).then(data => {
      this.loadProducts();
    }).catch(e => console.error(e));
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getUsers(): Observable<User[]> {
    return this.users.asObservable();
  }

  getProducts(): Observable<any[]> {
    return this.products.asObservable();
  }

}
