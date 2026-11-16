import {Component, OnInit, signal} from '@angular/core';
import {ReferenciasMaterialModule} from '../../../shared/modulos/referencias-material.module';
import {FormsModule} from '@angular/forms';
import {NgFor} from '@angular/common';
import {ColumnMode, NgxDatatableModule, SelectionType} from '@swimlane/ngx-datatable';
import {Pais} from '../../../shared/entidades/Pais';
import {PaisService} from '../../../core/servicios/pais.service';
import {MatDialog} from '@angular/material/dialog';
import {PaisEditarComponente} from '../pais-editar-componente/pais-editar-componente';

@Component({
  selector: 'app-pais-componente',
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
    NgxDatatableModule,
    NgFor
  ],
  templateUrl: './pais-componente.html',
  styleUrl: './pais-componente.css',
})
export class PaisComponente implements OnInit {

  public paises = signal<Pais[]>([]);
  public paisEscogido: Pais | undefined;
  private indicePaisEscogido: number = -1;

  public textoBusqueda: string = "";
  public indiceBusqueda: number = 0;
  public opcionesBusqueda: string[] = ["--Elija Dato de Búsqueda--", "Nombre"];

  public columnas = [
    {name: "Id", prop: "id"},
    {name: "Nombre", prop: "nombre"}
  ];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  constructor(private paisServicio: PaisService,
              private dialogoServicio: MatDialog) {

  }

  ngOnInit() {
    this.listar();
  }

  public listar() {
    this.paisServicio.listar().subscribe({
        next: respuesta => {
          this.paises.set(respuesta);
        },
        error: error => {
          window.alert(this.mensajeError(error));
        }
      }
    );
  }

  public escoger(event: any) {
    if (event.type == "click") {
      this.paisEscogido = event.row;
      this.indicePaisEscogido = this.paises().findIndex(pais => pais == this.paisEscogido);
    }
  }

  public buscar() {
    if (this.indiceBusqueda == 0 || this.textoBusqueda.length == 0) {
      this.listar();
    } else {
      this.paisServicio.buscar(this.indiceBusqueda, this.textoBusqueda).subscribe({
          next: respuesta => {
            this.paises.set(respuesta);
          },
          error: error => {
            window.alert(this.mensajeError(error));
          }
        }
      );
    }
  }

  public agregar() {
    const dialogoAgregar = this.dialogoServicio.open(PaisEditarComponente, {
        width: '500px',
        height: '300px',
        data: {
          encabezado: "Agregando nuevo país",
          pais: {
            id: 0, nombre: ""
          }
        },
        disableClose: true
      }
    );
    dialogoAgregar.afterClosed().subscribe({
      next: datos => {
        if (datos) {
          this.paisServicio.agregar(datos.pais).subscribe({
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
    if (this.paisEscogido) {
      const dialogoModificar = this.dialogoServicio.open(PaisEditarComponente, {
          width: '500px',
          height: '300px',
          data: {
            encabezado: `Editando el país [${this.paisEscogido.nombre}]`,
            pais: this.paisEscogido
          },
          disableClose: true
        }
      );
      dialogoModificar.afterClosed().subscribe({
        next: datos => {
          if (datos) {
            this.paisServicio.modificar(datos.pais.id, datos.pais).subscribe({
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
      window.alert("Debe escoger un País");
    }
  }

  public eliminar() {
    if (this.paisEscogido) {
      if (window.confirm(`¿Está seguro de eliminar el país [${this.paisEscogido.nombre}]?`)) {
        this.paisServicio.eliminar(this.paisEscogido.id).subscribe({
          next: respuesta => {
            if (respuesta) {
              this.listar();
              this.paisEscogido = undefined;
            } else {
              window.alert("No se encontró el País a eliminar");
            }
          },
          error: error => {
            window.alert(this.mensajeError(error));
          }
        });
      }
    } else {
      window.alert("Debe escoger un País");
    }
  }

  private mensajeError(error: any): string {
    return error?.error?.mensaje ?? "No fue posible completar la operación";
  }
}
