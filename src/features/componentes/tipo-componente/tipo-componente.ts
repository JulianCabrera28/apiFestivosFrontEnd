import {Component, OnInit, signal} from '@angular/core';
import {ReferenciasMaterialModule} from '../../../shared/modulos/referencias-material.module';
import {FormsModule} from '@angular/forms';
import {NgFor} from '@angular/common';
import {ColumnMode, NgxDatatableModule, SelectionType} from '@swimlane/ngx-datatable';
import {Tipo} from '../../../shared/entidades/Tipo';
import {TipoService} from '../../../core/servicios/tipo.service';
import {MatDialog} from '@angular/material/dialog';
import {TipoEditarComponente} from '../tipo-editar-componente/tipo-editar-componente';

@Component({
  selector: 'app-tipo-componente',
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
    NgxDatatableModule,
    NgFor
  ],
  templateUrl: './tipo-componente.html',
  styleUrl: './tipo-componente.css',
})
export class TipoComponente implements OnInit {

  public tipos = signal<Tipo[]>([]);
  public tipoEscogido: Tipo | undefined;
  private indiceTipoEscogido: number = -1;

  public textoBusqueda: string = "";
  public indiceBusqueda: number = 0;
  public opcionesBusqueda: string[] = ["--Elija Dato de Búsqueda--", "Descripción"];

  public columnas = [
    {name: "Id", prop: "id"},
    {name: "Descripción", prop: "descripcion"}
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  constructor(private tipoServicio: TipoService,
              private dialogoServicio: MatDialog) {

  }

  ngOnInit() {
    this.listar();
  }

  public listar() {
    this.tipoServicio.listar().subscribe({
        next: respuesta => {
          this.tipos.set(respuesta);
        },
        error: error => {
          window.alert(this.mensajeError(error));
        }
      }
    );
  }

  public escoger(event: any) {
    if (event.type == "click") {
      this.tipoEscogido = event.row;
      this.indiceTipoEscogido = this.tipos().findIndex(tipo => tipo == this.tipoEscogido);
    }
  }

  public buscar() {
    if (this.indiceBusqueda == 0 || this.textoBusqueda.length == 0) {
      this.listar();
    } else {
      this.tipoServicio.buscar(this.indiceBusqueda, this.textoBusqueda).subscribe({
          next: respuesta => {
            this.tipos.set(respuesta);
          },
          error: error => {
            window.alert(this.mensajeError(error));
          }
        }
      );
    }
  }

  public agregar() {
    const dialogoAgregar = this.dialogoServicio.open(TipoEditarComponente, {
        width: '500px',
        height: '300px',
        data: {
          encabezado: "Agregando nuevo tipo de festivo",
          tipo: {
            id: 0, descripcion: ""
          }
        },
        disableClose: true
      }
    );
    dialogoAgregar.afterClosed().subscribe({
      next: datos => {
        if (datos) {
          this.tipoServicio.agregar(datos.tipo).subscribe({
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
    if (this.tipoEscogido) {
      const dialogoModificar = this.dialogoServicio.open(TipoEditarComponente, {
          width: '500px',
          height: '300px',
          data: {
            encabezado: `Editando el tipo [${this.tipoEscogido.descripcion}]`,
            tipo: this.tipoEscogido
          },
          disableClose: true
        }
      );
      dialogoModificar.afterClosed().subscribe({
        next: datos => {
          if (datos) {
            this.tipoServicio.modificar(datos.tipo.id, datos.tipo).subscribe({
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
      window.alert("Debe escoger un Tipo de Festivo");
    }
  }

  public eliminar() {
    if (this.tipoEscogido) {
      if (window.confirm(`¿Está seguro de eliminar el tipo [${this.tipoEscogido.descripcion}]?`)) {
        this.tipoServicio.eliminar(this.tipoEscogido.id).subscribe({
          next: respuesta => {
            if (respuesta) {
              this.listar();
              this.tipoEscogido = undefined;
            } else {
              window.alert("No se encontró el Tipo a eliminar");
            }
          },
          error: error => {
            window.alert(this.mensajeError(error));
          }
        });
      }
    } else {
      window.alert("Debe escoger un Tipo de Festivo");
    }
  }

  private mensajeError(error: any): string {
    return error?.error?.mensaje ?? "No fue posible completar la operación";
  }
}
