import {Component, OnInit, signal} from '@angular/core';
import {ReferenciasMaterialModule} from '../../../shared/modulos/referencias-material.module';
import {FormsModule} from '@angular/forms';
import {NgFor} from '@angular/common';
import {ColumnMode, NgxDatatableModule, SelectionType} from '@swimlane/ngx-datatable';
import {Pais} from '../../../shared/entidades/Pais';
import {FestivoDto} from '../../../shared/entidades/FestivoDto';
import {PaisService} from '../../../core/servicios/pais.service';
import {CalendarioService} from '../../../core/servicios/calendario.service';

@Component({
  selector: 'app-consulta-componente',
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
    NgxDatatableModule,
    NgFor
  ],
  templateUrl: './consulta-componente.html',
  styleUrl: './consulta-componente.css',
})
export class ConsultaComponente implements OnInit {

  public paises = signal<Pais[]>([]);

  public idPaisVerificacion: number = 1;
  public fechaEscogida: Date = new Date();
  public resultadoVerificacion = signal("");

  public idPaisListado: number = 1;
  public anioListado: number = new Date().getFullYear();
  public festivos = signal<FestivoDto[]>([]);

  public columnas = [
    {name: "Festivo", prop: "festivo"},
    {name: "Fecha", prop: "fecha"}
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  constructor(private paisServicio: PaisService,
              private calendarioServicio: CalendarioService) {

  }

  ngOnInit() {
    this.paisServicio.listar().subscribe({
      next: respuesta => {
        this.paises.set(respuesta);
      }
    });
  }

  public verificar() {
    this.resultadoVerificacion.set("");
    this.calendarioServicio.verificar(
      this.idPaisVerificacion,
      this.fechaEscogida.getFullYear(),
      this.fechaEscogida.getMonth() + 1,
      this.fechaEscogida.getDate()
    ).subscribe({
      next: respuesta => {
        this.resultadoVerificacion.set(respuesta);
      },
      error: error => {
        this.resultadoVerificacion.set(error?.error?.mensaje ?? "No fue posible verificar la fecha");
      }
    });
  }

  public listarFestivos() {
    this.festivos.set([]);
    this.calendarioServicio.listarFestivos(this.idPaisListado, this.anioListado).subscribe({
      next: respuesta => {
        this.festivos.set(respuesta);
      },
      error: error => {
        window.alert(error?.error?.mensaje ?? "No fue posible listar los festivos");
      }
    });
  }
}
