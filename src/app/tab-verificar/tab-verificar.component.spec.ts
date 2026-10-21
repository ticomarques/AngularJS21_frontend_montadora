import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { TabVerificarComponent } from './tab-verificar.component';
import { TransacaoService } from '../../service/transacao.service';
import { SerieVerificada } from '../../domain/serie-verificada';

const mockSeries: SerieVerificada[] = Array.from({ length: 15 }, (_, i) => ({
  ano: `202${i}`,
  modelo: `M${i}`,
  pais: 'BR',
  reservado: '0',
  tipo: 'A',
  serie: `S${i}`,
  hexa: `F${i}`,
  status: i % 2 === 0,
}));

const mockFile = new File([''], 'series.txt', { type: 'text/plain' });

describe('TabVerificarComponent', () => {
  let fixture: ComponentFixture<TabVerificarComponent>;
  let component: TabVerificarComponent;
  let mockService: { verificar: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockService = { verificar: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [TabVerificarComponent],
      providers: [{ provide: TransacaoService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TabVerificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir mensagem de aguardo antes do upload', () => {
    const msg = fixture.nativeElement.querySelector('div.text-surface-500 span');
    expect(msg?.textContent).toContain('Aguardando upload do arquivo');
  });

  it('não deve exibir a tabela antes do upload', () => {
    const tabela = fixture.nativeElement.querySelector('p-table');
    expect(tabela).toBeNull();
  });

  describe('onVerificar()', () => {
    it('não deve chamar o serviço se não houver arquivos', () => {
      component.onVerificar({ files: [] });
      expect(mockService.verificar).not.toHaveBeenCalled();
    });

    it('deve chamar transacaoService.verificar com o arquivo correto', () => {
      mockService.verificar.mockReturnValue(of([]));
      component.onVerificar({ files: [mockFile] });
      expect(mockService.verificar).toHaveBeenCalledWith(mockFile);
    });

    it('deve popular series e ativar uploadFeito após resposta de sucesso', () => {
      mockService.verificar.mockReturnValue(of(mockSeries));
      component.onVerificar({ files: [mockFile] });
      expect(component.series).toEqual(mockSeries);
      expect(component.uploadFeito).toBe(true);
    });

    it('deve resetar first para 0 após upload', () => {
      component.first = 5;
      mockService.verificar.mockReturnValue(of(mockSeries));
      component.onVerificar({ files: [mockFile] });
      expect(component.first).toBe(0);
    });

    it('deve popular itensPaginados com os primeiros 10 itens', () => {
      mockService.verificar.mockReturnValue(of(mockSeries));
      component.onVerificar({ files: [mockFile] });
      expect(component.itensPaginados.length).toBe(10);
      expect(component.itensPaginados).toEqual(mockSeries.slice(0, 10));
    });

    it('não deve alterar o estado em caso de erro', () => {
      mockService.verificar.mockReturnValue(throwError(() => new Error('falha')));
      component.onVerificar({ files: [mockFile] });
      expect(component.uploadFeito).toBe(false);
      expect(component.series).toEqual([]);
    });
  });

  describe('status do item', () => {
    it('deve refletir status true e false nas series', () => {
      mockService.verificar.mockReturnValue(of(mockSeries));
      component.onVerificar({ files: [mockFile] });
      expect(component.series[0].status).toBe(true);
      expect(component.series[1].status).toBe(false);
    });
  });

  describe('onPageChange()', () => {
    beforeEach(() => {
      mockService.verificar.mockReturnValue(of(mockSeries));
      component.onVerificar({ files: [mockFile] });
    });

    it('deve atualizar first e rows', () => {
      component.onPageChange({ first: 10, rows: 5, page: 2, pageCount: 3 });
      expect(component.first).toBe(10);
      expect(component.rows).toBe(5);
    });

    it('deve fatiar os itens conforme a página', () => {
      component.onPageChange({ first: 10, rows: 5, page: 2, pageCount: 3 });
      expect(component.itensPaginados).toEqual(mockSeries.slice(10, 15));
    });

    it('deve usar valores padrão quando first/rows são undefined', () => {
      component.onPageChange({ first: undefined, rows: undefined });
      expect(component.first).toBe(0);
      expect(component.rows).toBe(10);
    });
  });
});
