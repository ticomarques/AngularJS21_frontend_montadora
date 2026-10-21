import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TransacaoService } from '../../service/transacao.service';
import { PaisQuantidadeRelatorio } from '../../domain/relatorio';

@Component({
  selector: 'app-tab-relatorio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FileUploadModule, TableModule, PaginatorModule],
  template: `
    <div class="flex flex-col gap-4 mt-2">
      <h2 class="text-lg font-bold mt-1">Relatório</h2>
      <p class="text-surface-500 mt-1">Nesta seção você pode gerar um relatório usando uma lista de series com DV, para listar informações sobre países e quantidades.</p>
    </div>

    <form class="flex mt-5">
      <p-fileUpload
        mode="advanced"
        name="file"
        chooseIcon="pi pi-upload"
        accept=".txt"
        maxFileSize="1000000"
        [customUpload]="true"
        (uploadHandler)="onRelatar($event)"
        chooseLabel="Selecionar"
        uploadLabel="Enviar"
        cancelLabel="Cancelar"
      />
    </form>

    @if (!uploadFeito) {
      <div class="flex items-center gap-2 mt-10 text-surface-500">
        <i class="pi pi-info-circle"></i>
        <span>Aguardando upload do arquivo para carregar a tabela.</span>
      </div>
    }

    @if (uploadFeito) {
      <p-table [value]="itensPaginados" [tableStyle]="{ 'min-width': '20rem' }" class="mt-10">
        <ng-template #header>
          <tr>
            <th>País</th>
            <th>Quantidade</th>
          </tr>
        </ng-template>
        <ng-template #body let-item>
          <tr>
            <td>{{ item.pais }}</td>
            <td>{{ item.quantidade }}</td>
          </tr>
        </ng-template>
      </p-table>

      <div class="flex justify-center mt-4">
        <p-paginator
          (onPageChange)="onPageChange($event)"
          [first]="first"
          [rows]="rows"
          [totalRecords]="relatorio.length"
          [rowsPerPageOptions]="[10, 20, 30]"
        />
      </div>
    }
  `
})
export class TabRelatorioComponent {
  private transacaoService = inject(TransacaoService);
  private cd = inject(ChangeDetectorRef);

  relatorio: PaisQuantidadeRelatorio[] = [];
  itensPaginados: PaisQuantidadeRelatorio[] = [];
  uploadFeito = false;
  first = 0;
  rows = 10;

  onRelatar(event: FileUploadHandlerEvent): void {
    if (!event.files?.length) return;
    this.transacaoService.relatorio(event.files[0]).subscribe({
      next: (resposta) => {
        this.relatorio = resposta;
        this.uploadFeito = true;
        this.first = 0;
        this.paginar();
      },
      error: (erro) => console.error('Erro ao gerar relatório:', erro)
    });
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.paginar();
  }

  private paginar(): void {
    this.itensPaginados = this.relatorio.slice(this.first, this.first + this.rows);
    this.cd.markForCheck();
  }
}
