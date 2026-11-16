import {Component, Inject} from '@angular/core';
import {Tipo} from '../../../shared/entidades/Tipo';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {ReferenciasMaterialModule} from '../../../shared/modulos/referencias-material.module';

export interface DatosEdicionTipo {
  encabezado: string;
  tipo: Tipo;
}

@Component({
  selector: 'app-tipo-editar-componente',
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
  ],
  templateUrl: './tipo-editar-componente.html',
  styleUrl: './tipo-editar-componente.css',
})
export class TipoEditarComponente {
  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosEdicionTipo,
              public dialogRef: MatDialogRef<TipoEditarComponente>,
  ) {

  }
}
