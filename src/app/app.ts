import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TabAdicionarComponent } from './tab-adicionar/tab-adicionar.component';
import { TabVerificarComponent } from './tab-verificar/tab-verificar.component';
import { TabRelatorioComponent } from './tab-relatorio/tab-relatorio.component';

@Component({
  selector: 'app-root',
  imports: [TabsModule, TabAdicionarComponent, TabVerificarComponent, TabRelatorioComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
