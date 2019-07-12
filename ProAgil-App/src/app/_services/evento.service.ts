import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Isso permite ser utilizado dentro de toda aplicação
@Injectable({
  providedIn: 'root'
})
export class EventoService {
  baseURL = 'http://localhost:5000/api/evento';


constructor(private http: HttpClient) { }

getEvento()
{
  return this.http.get(this.baseURL);
}

}
