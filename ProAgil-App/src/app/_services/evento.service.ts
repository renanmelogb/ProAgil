import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

// Isso permite ser utilizado dentro de toda aplicação
@Injectable({
  providedIn: 'root'
})
export class EventoService {
  baseURL = 'http://localhost:5000/api/evento';

constructor(private http: HttpClient) {
  // É necessário passar o token no header para carregar as informações Obs substituido pelo interceptor
  // this.tokenHeader = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
}

getAllEvento(): Observable<Evento[]> {
  return this.http.get<Evento[]>(this.baseURL);
}

getEventoByTema(tema: string): Observable<Evento[]> {
  return this.http.get<Evento[]>(`${this.baseURL}/getByTema/${tema}`);
}

getEventoById(id: number): Observable<Evento> {
  return this.http.get<Evento>(`${this.baseURL}/${id}`);
}

postUpload(file: File, name: string) {
  const fileToUpload = <File>file[0];
  const formData = new FormData();
  formData.append('file', fileToUpload, name);

  return this.http.post(`${this.baseURL}/upload`, formData);
}

postEvento(evento: Evento) {
  return this.http.post(this.baseURL, evento);
}

putEvento(evento: Evento) {
  return this.http.put(`${this.baseURL}/${evento.id}`, evento );
}

deleteEvento(id: number) {
  return this.http.delete(`${this.baseURL}/${id}`);
}

}
