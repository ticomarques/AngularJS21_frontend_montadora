import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TransacaoService } from './transacao.service';
import { Serie } from '../domain/serie';
import { SerieVerificada } from '../domain/serie-verificada';

const mockFile = new File(['conteudo'], 'teste.txt', { type: 'text/plain' });

const mockSeries: Serie[] = [
  { ano: '2024', modelo: 'X1', pais: 'BR', reservado: '0', tipo: 'A', serie: 'ABC123', hexa: 'FF' },
  { ano: '2023', modelo: 'X2', pais: 'AR', reservado: '1', tipo: 'B', serie: 'DEF456', hexa: 'AA' },
];

const mockSeriesVerificadas: SerieVerificada[] = [
  { ano: '2024', modelo: 'X1', pais: 'BR', reservado: '0', tipo: 'A', serie: 'ABC123', hexa: 'FF', status: true },
  { ano: '2023', modelo: 'X2', pais: 'AR', reservado: '1', tipo: 'B', serie: 'DEF456', hexa: 'AA', status: false },
];

describe('TransacaoService', () => {
  let service: TransacaoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TransacaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('adicionar()', () => {
    it('deve fazer POST para /adicionar e retornar array de Serie', () => {
      service.adicionar(mockFile).subscribe(result => {
        expect(result).toEqual(mockSeries);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/trans/adicionar');
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBe(true);
      req.flush(mockSeries);
    });

    it('deve incluir o arquivo no FormData com a chave "file"', () => {
      service.adicionar(mockFile).subscribe();

      const req = httpMock.expectOne('http://localhost:8080/api/trans/adicionar');
      const formData: FormData = req.request.body;
      expect(formData.get('file')).toBeTruthy();
      req.flush([]);
    });
  });

  describe('verificar()', () => {
    it('deve fazer POST para /verificar e retornar array de SerieVerificada', () => {
      service.verificar(mockFile).subscribe(result => {
        expect(result).toEqual(mockSeriesVerificadas);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/trans/verificar');
      expect(req.request.method).toBe('POST');
      req.flush(mockSeriesVerificadas);
    });
  });

  describe('relatorio()', () => {
    it('deve fazer POST para /relatorio e converter o objeto em array de PaisQuantidadeRelatorio', () => {
      const respostaBackend = { Brazil: 3, Argentina: 3, Mexico: 2 };

      service.relatorio(mockFile).subscribe(result => {
        expect(result).toEqual([
          { pais: 'Brazil', quantidade: 3 },
          { pais: 'Argentina', quantidade: 3 },
          { pais: 'Mexico', quantidade: 2 },
        ]);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/trans/relatorio');
      expect(req.request.method).toBe('POST');
      req.flush(respostaBackend);
    });

    it('deve retornar array vazio quando o backend retornar objeto vazio', () => {
      service.relatorio(mockFile).subscribe(result => {
        expect(result).toEqual([]);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/trans/relatorio');
      req.flush({});
    });
  });
});
