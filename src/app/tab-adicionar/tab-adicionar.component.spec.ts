import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { TabAdicionarComponent } from './tab-adicionar.component';
import { TransacaoService } from '../../service/transacao.service';
import { Serie } from '../../domain/serie';

const mockSeries: Serie[] = Array.from({ length: 15 }, (_, i) => ({
  ano: `202${i}`,
  modelo: `M${i}`,
  pais: 'BR',
  reservado: '0',
  tipo: 'A',
  serie: `S${i}`,
  hexa: `F${i}`,
}));

const mockFile = new File([''], 'series.txt', { type: 'text/plain' });

describe('TabAdicionarComponent', () => {
  let fixture: ComponentFixture<TabAdicionarComponent>;
  let component: TabAdicionarComponent;
  let mockService: { adicionar: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockService = { adicionar: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [TabAdicionarComponent],
      providers: [{ provide: TransacaoService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TabAdicionarComponent);
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

  describe('onUpload()', () => {
    it('não deve chamar o serviço se não houver arquivos', () => {
      component.onUpload({ files: [] });
      expect(mockService.adicionar).not.toHaveBeenCalled();
    });

    it('deve chamar transacaoService.adicionar com o arquivo correto', () => {
      mockService.adicionar.mockReturnValue(of([]));
      component.onUpload({ files: [mockFile] });
      expect(mockService.adicionar).toHaveBeenCalledWith(mockFile);
    });

    it('deve popular series e ativar uploadFeito após resposta de sucesso', () => {
      mockService.adicionar.mockReturnValue(of(mockSeries));
      component.onUpload({ files: [mockFile] });
      expect(component.series).toEqual(mockSeries);
      expect(component.uploadFeito).toBe(true);
    });

    it('deve resetar first para 0 após upload', () => {
      component.first = 5;
      mockService.adicionar.mockReturnValue(of(mockSeries));
      component.onUpload({ files: [mockFile] });
      expect(component.first).toBe(0);
    });

    it('deve popular itensPaginados com os primeiros 10 itens', () => {
      mockService.adicionar.mockReturnValue(of(mockSeries));
      component.onUpload({ files: [mockFile] });
      expect(component.itensPaginados.length).toBe(10);
      expect(component.itensPaginados).toEqual(mockSeries.slice(0, 10));
    });

    it('não deve alterar o estado em caso de erro', () => {
      mockService.adicionar.mockReturnValue(throwError(() => new Error('falha')));
      component.onUpload({ files: [mockFile] });
      expect(component.uploadFeito).toBe(false);
      expect(component.series).toEqual([]);
    });
  });

  describe('onPageChange()', () => {
    beforeEach(() => {
      mockService.adicionar.mockReturnValue(of(mockSeries));
      component.onUpload({ files: [mockFile] });
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
