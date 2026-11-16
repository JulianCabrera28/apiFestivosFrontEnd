import {Component, Inject, OnInit, signal} from '@angular/core';
import {Festivo} from '../../../shared/entidades/Festivo';
import {Tipo} from '../../../shared/entidades/Tipo';
import {Pais} from '../../../shared/entidades/Pais';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {NgFor} from '@angular/common';
import {ReferenciasMaterialModule} from '../../../shared/modulos/referencias-material.module';
import {TipoService} from '../../../core/servicios/tipo.service';
import {PaisService} from '../../../core/servicios/pais.service';

export interface DatosEdicionFestivo {
  encabezado: string;
  festivo: Festivo;
}

@Component({
  selector: 'app-festivo-editar-componente',
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
    NgFor
  ],
  templateUrl: './festivo-editar-componente.html',
  styleUrl: './festivo-editar-componente.css',
})
export class FestivoEditarComponente implements OnInit {
  public tipos = signal<Tipo[]>([]);
  public paises = signal<Pais[]>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosEdicionFestivo,
              public dialogRef: MatDialogRef<FestivoEditarComponente>,
              private tipoServicio: TipoService,
              private paisServicio: PaisService,
  ) {

  }

  ngOnInit() {
    this.tipoServicio.listar().subscribe({
      next: respuesta => {
        this.tipos.set(respuesta);
      }
    });
    this.paisServicio.listar().subscribe({
      next: respuesta => {
        this.paises.set(respuesta);
      }
    });
  }
}
