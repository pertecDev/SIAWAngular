import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cuenta-efectivo-cuentas-contables',
  templateUrl: './cuenta-efectivo-cuentas-contables.component.html',
  styleUrls: ['./cuenta-efectivo-cuentas-contables.component.scss']
})
export class CuentaEfectivoCuentasContablesComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  numTransf: any = [];
  unidad: any = [];
  almacen_get: any = [];
  cuentas_efectivo: any = [];
  cncuenta_get: any = [];
  cuentas_efectivas_edit: any = [];
  costos_get: any = [];
  cuentas_efectivas_edit_id: any;

  userConn: any;
  agencia_logueado: any;
  userLogueado: any;
  select_area: any;
  select_almacen: any;
  data_cuenta: boolean = false;

  constructor(private _formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    private api: ApiService, public dialogRef: MatDialogRef<CuentaEfectivoCuentasContablesComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public datacuentasefectivoEdit: any) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.userLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;

    this.FormularioData = this.createForm();

    this.cuentas_efectivas_edit = datacuentasefectivoEdit.datacuentasefectivoEdit;
    this.cuentas_efectivas_edit_id = datacuentasefectivoEdit.datacuentasefectivoEdit?.id;
  }

  ngOnInit() {
    this.getAllUnidadesNegocio();
    this.getAllAlmacenCatalogo();
    this.verCostoCatalogo();
    this.verCuentasContableCatalogo();
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      idcuenta: [this.cuentas_efectivas_edit_id],
      codunidad: [this.dataform.codunidad, Validators.compose([Validators.required])],
      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
    });
  }

  getAllUnidadesNegocio() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET /seg_adm/mant/adunidad/catalogo/";
    return this.api.getAll('/seg_adm/mant/adunidad/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.unidad = datav;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getAllAlmacenCatalogo() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/mant/inalmacen/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.almacen_get = datav;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  verificarCuentasContables() {
    let data = this.FormularioData.value;
    

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/fondos/mant/fncuenta_conta/";
    return this.api.create('/fondos/mant/fncuenta_conta/consulta/' + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.cuentas_efectivo = datav;
          

          if (datav) {
            
            this.toastr.success('! HAY CUENTAS CONTABLES PARA ESTE CODIGO!');
            this.data_cuenta = true;
          } else {
            this.data_cuenta = true;
            this.toastr.error('! NO HAY CUENTAS CONTABLES PARA ESE CODIGO!');
          }
        },
        error: (err: any) => {
          
          this.data_cuenta = true;
          this.toastr.error('! NO HAY CUENTAS CONTABLES PARA ESE CODIGO!');
        },
        complete: () => { }
      })
  }

  verCuentasContableCatalogo() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/contab/mant/cncuenta/catalogo/"
    return this.api.getAll('/contab/mant/cncuenta/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.cncuenta_get = datav;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  verCostoCatalogo() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/contab/mant/cncuenta/catalogo/"
    return this.api.getAll('/contab/mant/cncentrocosto/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.costos_get = datav;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }
}
