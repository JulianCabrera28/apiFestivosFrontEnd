import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Pais} from '../../shared/entidades/Pais';

@Injectable({
  providedIn: 'root',
})
export class PaisService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.urlBase}paises`;
  }

  public listar(): Observable<Pais[]> {
    return this.http.get<Pais[]>(this.url);
  }

  public buscar(indice: number, dato: String): Observable<Pais[]> {
    return this.http.get<Pais[]>(`${this.url}/buscar/${indice}/${dato}`);
  }

  public agregar(pais: Pais): Observable<Pais> {
    return this.http.post<Pais>(this.url, pais);
  }

  public modificar(id: number, pais: Pais): Observable<Pais> {
    return this.http.put<Pais>(`${this.url}/${id}`, pais);
  }

  public eliminar(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}/${id}`);
  }
}
