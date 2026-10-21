import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TransacaoService } from '../../service/transacao.service';
import { Serie } from '../../domain/serie';

@Component({
  selector: 'app-tab-adicionar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FileUploadModule, TableModule, PaginatorModule],
  template: `
    <div class="flex flex-col gap-4 mt-2">
      <h2 class="text-lg font-bold mt-1">Adicionar DV</h2>
      <p class="text-surface-500 mt-1">Nesta seção você pode subir um arquivo contendo series sem DV para que o sistema possa gerar o DV.</p>
    </div>

    <form class="flex mt-5">
      <p-fileUpload
        mode="advanced"
        name="file"
        chooseIcon="pi pi-upload"
        accept=".txt"
        maxFileSize="1000000"
        [customUpload]="true"
        (uploadHandler)="onUpload($event)"
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
      <p-table [value]="itensPaginados" selectionMode="single" dataKey="serie" [tableStyle]="{ 'min-width': '50rem' }" class="mt-10">
        <ng-template #header>
          <tr>
            <th>Ano</th>
            <th>Modelo</th>
            <th>País</th>
            <th>Reservado</th>
            <th>Tipo</th>
            <th>Série</th>
            <th>Hexa</th>
          </tr>
        </ng-template>
        <ng-template #body let-serie>
          <tr [pSelectableRow]="serie">
            <td>{{ serie.ano }}</td>
            <td>{{ serie.modelo }}</td>
            <td>{{ serie.pais }}</td>
            <td>{{ serie.reservado }}</td>
            <td>{{ serie.tipo }}</td>
            <td>{{ serie.serie }}</td>
            <td>{{ serie.hexa }}</td>
          </tr>
        </ng-template>
      </p-table>

      <div class="flex justify-center mt-4">
        <p-paginator
          (onPageChange)="onPageChange($event)"
          [first]="first"
          [rows]="rows"
          [totalRecords]="series.length"
          [rowsPerPageOptions]="[10, 20, 30]"
        />
      </div>
    }
  `
})
export class TabAdicionarComponent {
  private transacaoService = inject(TransacaoService);
  private cd = inject(ChangeDetectorRef);

  series: Serie[] = [];
  itensPaginados: Serie[] = [];
  uploadFeito = false;
  first = 0;
  rows = 10;

  onUpload(event: FileUploadHandlerEvent): void {
    if (!event.files?.length) return;
    this.transacaoService.adicionar(event.files[0]).subscribe({
      next: (resposta) => {
        this.series = resposta;
        this.uploadFeito = true;
        this.first = 0;
        this.paginar();
      },
      error: (erro) => console.error('Erro ao adicionar:', erro)
    });
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.paginar();
  }

  private paginar(): void {
    this.itensPaginados = this.series.slice(this.first, this.first + this.rows);
    this.cd.markForCheck();
  }
}
