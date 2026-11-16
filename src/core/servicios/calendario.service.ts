import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {FestivoDto} from '../../shared/entidades/FestivoDto';

@Injectable({
  providedIn: 'root',
})
export class CalendarioService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.urlBase}calendario`;
  }

  public verificar(idPais: number, anio: number, mes: number, dia: number): Observable<string> {
    return this.http.get(`${this.url}/verificar/${idPais}/${anio}/${mes}/${dia}`, {responseType: 'text'});
  }

  public listarFestivos(idPais: number, anio: number): Observable<FestivoDto[]> {
    return this.http.get<FestivoDto[]>(`${this.url}/festivos/${idPais}/${anio}`);
  }
}
