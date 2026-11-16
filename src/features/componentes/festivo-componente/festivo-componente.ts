import {Component, OnInit, signal} from '@angular/core';
import {ReferenciasMaterialModule} from '../../../shared/modulos/referencias-material.module';
import {FormsModule} from '@angular/forms';
import {NgFor} from '@angular/common';
import {ColumnMode, NgxDatatableModule, SelectionType} from '@swimlane/ngx-datatable';
import {Festivo} from '../../../shared/entidades/Festivo';
import {FestivoService} from '../../../core/servicios/festivo.service';
import {MatDialog} from '@angular/material/dialog';
import {FestivoEditarComponente} from '../festivo-editar-componente/festivo-editar-componente';

@Component({
  selector: 'app-festivo-componente',
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
    NgxDatatableModule,
    NgFor
  ],
  templateUrl: './festivo-componente.html',
  styleUrl: './festivo-componente.css',
})
export class FestivoComponente implements OnInit {

  public festivos = signal<Festivo[]>([]);
  public festivoEscogido: Festivo | undefined;
  private indiceFestivoEscogido: number = -1;

  public textoBusqueda: string = "";
  public indiceBusqueda: number = 0;
  public opcionesBusqueda: string[] = ["--Elija Dato de Búsqueda--", "Nombre"];

  public columnas = [
    {name: "Id", prop: "id"},
    {name: "Nombre", prop: "nombre"},
    {name: "Día", prop: "dia"},
    {name: "Mes", prop: "mes"},
    {name: "Días Pascua", prop: "diasPascua"},
    {name: "Tipo", prop: "tipo.descripcion"},
    {name: "País", prop: "pais.nombre"}
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  constructor(private festivoServicio: FestivoService,
              private dialogoServicio: MatDialog) {

  }

  ngOnInit() {
    this.listar();
  }

  public listar() {
    this.festivoServicio.listar().subscribe({
        next: respuesta => {
          this.festivos.set(respuesta);
        },
        error: error => {
          window.alert(this.mensajeError(error));
        }
      }
    );
  }

  public escoger(event: any) {
    if (event.type == "click") {
      this.festivoEscogido = event.row;
      this.indiceFestivoEscogido = this.festivos().findIndex(festivo => festivo == this.festivoEscogido);
    }
  }

  public buscar() {
    if (this.indiceBusqueda == 0 || this.textoBusqueda.length == 0) {
      this.listar();
    } else {
      this.festivoServicio.buscar(this.indiceBusqueda, this.textoBusqueda).subscribe({
          next: respuesta => {
            this.festivos.set(respuesta);
          },
          error: error => {
            window.alert(this.mensajeError(error));
          }
        }
      );
    }
  }

  public agregar() {
    const dialogoAgregar = this.dialogoServicio.open(FestivoEditarComponente, {
        width: '500px',
        height: '560px',
        data: {
          encabezado: "Agregando nuevo festivo",
          festivo: {
            id: 0, nombre: "", dia: 1, mes: 1, diasPascua: 0, idTipo: 1, idPais: 1
          }
        },
        disableClose: true
      }
    );
    dialogoAgregar.afterClosed().subscribe({
      next: datos => {
        if (datos) {
          this.festivoServicio.agregar(datos.festivo).subscribe({
            next: () => {
              this.listar();
            },
            error: error => {
              window.alert(this.mensajeError(error));
            }
          });
        }
      }
    })
  }

  public modificar() {
    if (this.festivoEscogido) {
      const dialogoModificar = this.dialogoServicio.open(FestivoEditarComponente, {
          width: '500px',
          height: '560px',
          data: {
            encabezado: `Editando el festivo [${this.festivoEscogido.nombre}]`,
            festivo: this.festivoEscogido
          },
          disableClose: true
        }
      );
      dialogoModificar.afterClosed().subscribe({
        next: datos => {
          if (datos) {
            this.festivoServicio.modificar(datos.festivo.id, datos.festivo).subscribe({
              next: () => {
                this.listar();
              },
              error: error => {
                window.alert(this.mensajeError(error));
              }
            });
          }
        }
      })
    } else {
      window.alert("Debe escoger un Festivo");
    }
  }

  public eliminar() {
    if (this.festivoEscogido) {
      if (window.confirm(`¿Está seguro de eliminar el festivo [${this.festivoEscogido.nombre}]?`)) {
        this.festivoServicio.eliminar(this.festivoEscogido.id).subscribe({
          next: respuesta => {
            if (respuesta) {
              this.listar();
              this.festivoEscogido = undefined;
            } else {
              window.alert("No se encontró el Festivo a eliminar");
            }
          },
          error: error => {
            window.alert(this.mensajeError(error));
          }
        });
      }
    } else {
      window.alert("Debe escoger un Festivo");
    }
  }

  private mensajeError(error: any): string {
    return error?.error?.mensaje ?? "No fue posible completar la operación";
  }
}
