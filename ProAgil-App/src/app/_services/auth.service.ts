import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = 'http://localhost:5000/api/user/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  rolelst: any;

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(`${this.baseURL}login`, model).pipe(
        map((response: any) => {
          const user = response;
          this.rolelst = response.rolename;
          if (user) {
            // Salvando informação de token dentro de localStorage->token, localstorage
            // é o armazenamento local que existe dentro do browser
            localStorage.setItem('token', user.token);
            // Decodificando a primeira parte do token que não usa chave de descriptografia
            // A real parte que faz a descriptografia está em startup
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
          }
        })
      );
  }

  register(model: any) {
    return this.http.post(`${this.baseURL}register`, model);
  }

  loggedIn() {
    // Pega o token que está dentro da localstorage
    const token = localStorage.getItem('token');
    // Se o token não estiver expirado está logado
    return !this.jwtHelper.isTokenExpired(token);
  }

}
