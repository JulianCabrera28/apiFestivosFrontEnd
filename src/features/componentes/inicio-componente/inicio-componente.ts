import { Component } from '@angular/core';
import {ReferenciasMaterialModule} from '../../../shared/modulos/referencias-material.module';

@Component({
  selector: 'app-inicio-componente',
  imports: [
    ReferenciasMaterialModule
  ],
  templateUrl: './inicio-componente.html',
  styleUrl: './inicio-componente.css',
})
export class InicioComponente {

}
