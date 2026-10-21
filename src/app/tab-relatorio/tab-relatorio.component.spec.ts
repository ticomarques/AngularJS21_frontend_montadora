import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { TabRelatorioComponent } from './tab-relatorio.component';
import { TransacaoService } from '../../service/transacao.service';
import { PaisQuantidadeRelatorio } from '../../domain/relatorio';

const mockRelatorio: PaisQuantidadeRelatorio[] = Array.from({ length: 15 }, (_, i) => ({
  pais: `Pais${i}`,
  quantidade: i + 1,
}));

const mockFile = new File([''], 'series.txt', { type: 'text/plain' });

describe('TabRelatorioComponent', () => {
  let fixture: ComponentFixture<TabRelatorioComponent>;
  let component: TabRelatorioComponent;
  let mockService: { relatorio: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockService = { relatorio: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [TabRelatorioComponent],
      providers: [{ provide: TransacaoService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TabRelatorioComponent);
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

  describe('onRelatar()', () => {
    it('não deve chamar o serviço se não houver arquivos', () => {
      component.onRelatar({ files: [] });
      expect(mockService.relatorio).not.toHaveBeenCalled();
    });

    it('deve chamar transacaoService.relatorio com o arquivo correto', () => {
      mockService.relatorio.mockReturnValue(of([]));
      component.onRelatar({ files: [mockFile] });
      expect(mockService.relatorio).toHaveBeenCalledWith(mockFile);
    });

    it('deve popular relatorio e ativar uploadFeito após resposta de sucesso', () => {
      mockService.relatorio.mockReturnValue(of(mockRelatorio));
      component.onRelatar({ files: [mockFile] });
      expect(component.relatorio).toEqual(mockRelatorio);
      expect(component.uploadFeito).toBe(true);
    });

    it('deve resetar first para 0 após upload', () => {
      component.first = 5;
      mockService.relatorio.mockReturnValue(of(mockRelatorio));
      component.onRelatar({ files: [mockFile] });
      expect(component.first).toBe(0);
    });

    it('deve popular itensPaginados com os primeiros 10 itens', () => {
      mockService.relatorio.mockReturnValue(of(mockRelatorio));
      component.onRelatar({ files: [mockFile] });
      expect(component.itensPaginados.length).toBe(10);
      expect(component.itensPaginados).toEqual(mockRelatorio.slice(0, 10));
    });

    it('não deve alterar o estado em caso de erro', () => {
      mockService.relatorio.mockReturnValue(throwError(() => new Error('falha')));
      component.onRelatar({ files: [mockFile] });
      expect(component.uploadFeito).toBe(false);
      expect(component.relatorio).toEqual([]);
    });
  });

  describe('onPageChange()', () => {
    beforeEach(() => {
      mockService.relatorio.mockReturnValue(of(mockRelatorio));
      component.onRelatar({ files: [mockFile] });
    });

    it('deve atualizar first e rows', () => {
      component.onPageChange({ first: 10, rows: 5, page: 2, pageCount: 3 });
      expect(component.first).toBe(10);
      expect(component.rows).toBe(5);
    });

    it('deve fatiar os itens conforme a página', () => {
      component.onPageChange({ first: 10, rows: 5, page: 2, pageCount: 3 });
      expect(component.itensPaginados).toEqual(mockRelatorio.slice(10, 15));
    });

    it('deve usar valores padrão quando first/rows são undefined', () => {
      component.onPageChange({ first: undefined, rows: undefined });
      expect(component.first).toBe(0);
      expect(component.rows).toBe(10);
    });
  });
});
