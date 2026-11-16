import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Tipo} from '../../shared/entidades/Tipo';

@Injectable({
  providedIn: 'root',
})
export class TipoService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.urlBase}tipos`;
  }

  public listar(): Observable<Tipo[]> {
    return this.http.get<Tipo[]>(this.url);
  }

  public buscar(indice: number, dato: String): Observable<Tipo[]> {
    return this.http.get<Tipo[]>(`${this.url}/buscar/${indice}/${dato}`);
  }

  public agregar(tipo: Tipo): Observable<Tipo> {
    return this.http.post<Tipo>(this.url, tipo);
  }

  public modificar(id: number, tipo: Tipo): Observable<Tipo> {
    return this.http.put<Tipo>(`${this.url}/${id}`, tipo);
  }

  public eliminar(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}/${id}`);
  }
}
