import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Serie } from '../domain/serie';
import { SerieVerificada } from '../domain/serie-verificada';
import { PaisQuantidadeRelatorio, RelatorioResponse } from '../domain/relatorio';

const BASE_URL = 'http://localhost:8080/api/trans';

@Injectable({ providedIn: 'root' })
export class TransacaoService {
  private http = inject(HttpClient);

  private buildFormData(file: File): FormData {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return formData;
  }

  adicionar(file: File): Observable<Serie[]> {
    return this.http.post<Serie[]>(`${BASE_URL}/adicionar`, this.buildFormData(file));
  }

  verificar(file: File): Observable<SerieVerificada[]> {
    return this.http.post<SerieVerificada[]>(`${BASE_URL}/verificar`, this.buildFormData(file));
  }

  relatorio(file: File): Observable<PaisQuantidadeRelatorio[]> {
    return this.http.post<RelatorioResponse>(`${BASE_URL}/relatorio`, this.buildFormData(file)).pipe(
      map(resposta => Object.entries(resposta).map(([pais, quantidade]) => ({ pais, quantidade })))
    );
  }
}
