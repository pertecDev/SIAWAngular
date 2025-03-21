import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-periodos-sistema',
  templateUrl: './periodos-sistema.component.html',
  styleUrls: ['./periodos-sistema.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PeriodosSistemaComponent implements OnInit {

  fecha_actual = new Date();
  hora_actual = new Date();

  userConn: string;
  usuarioLogueado: string;
  fecha_apertura: any = [];
  modulo_apertura: any = [];
  sin_detalle: any = [];
  detalle_comparacion: any = [];
  detalle_comparacion_copia_post: any = [];
  data_save: any = [];
  array_manipulacion: any = [];
  periodo_save: any = [];
  item_seleccionado: string;
  mes: any;
  anio: any;
  data_check: boolean;
  check: boolean;
  dataform: any = '';

  check_apertura_post: number[] = [];;
  codigo: number[] = [];
  descripcion: string[] = [];
  sistema: number[] = [];

  formularios: FormGroup[] = [];
  arrayModificado: any[] = [];
  save_periods: any = [];
  modulos: any = [] = [
    {
      "codigo": 1,
      "descripcion": "ADMINISTRACION",
    },
    {
      "codigo": 2,
      "descripcion": "INVENTARIOS",
    },
    {
      "codigo": 3,
      "descripcion": "VENTAS",
    },
    {
      "codigo": 4,
      "descripcion": "CTAS POR COBRAR",
    },
    {
      "codigo": 5,
      "descripcion": "CONTABILIDAD",
    },
    {
      "codigo": 6,
      "descripcion": "ACTIVOS FIJOS",
    },
    {
      "codigo": 7,
      "descripcion": "COSTOS Y COSTEO",
    },
    {
      "codigo": 8,
      "descripcion": "IMPORTACIONES",
    },
    {
      "codigo": 9,
      "descripcion": "PERSONAL Y PLANILLAS",
    },
    {
      "codigo": 10,
      "descripcion": "SEGURIDAD",
    },
    {
      "codigo": 11,
      "descripcion": "COMPRAS",
    },
    {
      "codigo": 12,
      "descripcion": "FONDOS",
    }];

  administracion: any;
  ultimoElementoMes: number;
  ultimoElementoCodigo: number;
  ultimoElementoAnio: number;

  nombre_ventana: string = "abmadapertura.vb";
  public ventana = "Periodos de Apertura/Cierre";
  public detalle = "ActualizarStock-create";
  public tipo = "ActualizarStock-CREATE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    private toastr: ToastrService, private _formBuilder: FormBuilder, public _snackBar: MatSnackBar, private datePipe: DatePipe,
    public log_module: LogService, public nombre_ventana_service: NombreVentanaService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.getFechaApertura();
  }

  onCheckboxChange(detalle_comparacion: any) {
    detalle_comparacion.check = !detalle_comparacion.check; // Cambia el valor del checkbox

    
  }

  guardarCambios() {
    this.detalle_comparacion_copia_post = this.detalle_comparacion.slice();
    

    this.detalle_comparacion_copia_post = this.detalle_comparacion_copia_post.filter(item => item.check == true);
    let primerElemento = this.detalle_comparacion_copia_post[0];

    // Crear un formulario para cada elemento en el array
    this.formularios = this.detalle_comparacion_copia_post.map(item => this._formBuilder.group({
      codigo: [item.codigo],
      sistema: [item.sistema]
    }));

    const valoresFormularios = this.formularios.map(formulario => formulario.value);
    

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /seg_adm/mant/adarea/";

    return this.api.create("/seg_adm/mant/abmadapertura/" + this.userConn + '/' + primerElemento.codigo, valoresFormularios)
      .subscribe({
        next: (datav) => {
          this.save_periods = datav;
          

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.spinner.show();

          setTimeout(() => {
            this.spinner.hide();
          }, 1500);

          this.toastr.success('Guardado con Exito! 🎉');
        },

        error: (err) => {
          
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  seleccionarFila(item): void {
    this.item_seleccionado = item;
    this.mes = item.mes;
    this.anio = item.ano;
    item.seleccionado = !item.seleccionado;

    this.arrayModificado.splice(0, this.arrayModificado.length);

    this.getCheckSelects(item);
  }

  getCheckSelects(element) {
    let codigo = element.codigo;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET- /seg_adm/mant/abmadapertura/getdetalle/";
    return this.api.getAll('/seg_adm/mant/abmadapertura/getdetalle/' + this.userConn + "/" + codigo)
      .subscribe({
        next: (datav) => {
          //ACA MODULO DE MES EXISTENTE
          // detalle del mes va con su descripcion, comparar con la descripcion de modulos
          this.detalle_comparacion = datav;
          

          this.getAperturaModulo();
          this.data_check = true;

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },

        error: (err: any) => {
          
          //ACA MODULO DE MES INEXISTENTE
          if (err) {
            this.data_check = false;
            this.check = false;

            this.getAperturaModulo();
          }
          
        },
        complete: () => { }
      })
  }

  getFechaApertura() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET- /seg_adm/mant/abmadapertura/getadapertura/";
    return this.api.getAll('/seg_adm/mant/abmadapertura/getadapertura/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.fecha_apertura = datav;
          

          this.ultimoElementoMes = this.fecha_apertura[0].mes;
          this.ultimoElementoCodigo = this.fecha_apertura[0].codigo;
          this.ultimoElementoAnio = this.fecha_apertura[0].ano;

          

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getAperturaModulo() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET- /seg_adm/mant/abmadapertura/getsemodulo/";
    return this.api.getAll('/seg_adm/mant/abmadapertura/getsemodulo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          // modulos apertura descripcion
          this.modulo_apertura = datav;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  nuevoPeriodo() {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    if (this.ultimoElementoMes == 12) {
      const dataAnioNuevo = {
        codigo: 0,
        ano: this.ultimoElementoAnio + 1,
        mes: 1,
        horareg: hora_actual_complete,
        fechareg: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        usuarioreg: this.usuarioLogueado,
      }
      

      let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /seg_adm/mant/abmadapertura/";
      return this.api.create("/seg_adm/mant/abmadapertura/addPeriodo/" + this.userConn, dataAnioNuevo)
        .subscribe({
          next: (datav) => {
            this.periodo_save = datav;

            
            this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
            this.spinner.show();
            setTimeout(() => {
              this.spinner.hide();
            }, 2000);
            this.toastr.success('! SE GUARDO EXITOSAMENTE !');

            this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
              duration: 3000,
              panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
            });

            this.getFechaApertura();
          },

          error: (err) => {
            
          },
          complete: () => { }
        })
    } else {
      const data = {
        codigo: 0,
        ano: this.ultimoElementoAnio,
        mes: this.ultimoElementoMes + 1,
        horareg: hora_actual_complete,
        fechareg: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        usuarioreg: this.usuarioLogueado,
      }

      

      let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /seg_adm/mant/abmadapertura/";
      return this.api.create("/seg_adm/mant/abmadapertura/addPeriodo/" + this.userConn, data)
        .subscribe({
          next: (datav) => {
            this.periodo_save = datav;
            

            this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
            this.spinner.show();

            setTimeout(() => {
              this.spinner.hide();
            }, 2000);

            this.toastr.success('! SE GUARDO EXITOSAMENTE !');

            this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
              duration: 3000,
              panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
            });

            this.getFechaApertura();
          },

          error: (err) => {
            
          },
          complete: () => { }
        })
    }
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
