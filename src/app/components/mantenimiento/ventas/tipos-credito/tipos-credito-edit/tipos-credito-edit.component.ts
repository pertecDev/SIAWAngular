import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tipos-credito-edit',
  templateUrl: './tipos-credito-edit.component.html',
  styleUrls: ['./tipos-credito-edit.component.scss']
})
export class TiposCreditoEditComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  rubro: any = [];
  moneda: any = [];
  empresa: any = [];
  credito_edit: any = [];
  userConn: any;
  credito_edit_codigo: any = [];
  credito_edit_duracion: any = []
  credito_edit_descripcion: any;
  credito_edit_es_fijo: any;
  userLogueado: any = [];
  array_copy: any = [];
  inputValue: number | null = null;

  public ventana = "tipos-credito-edit"
  public detalle = "tipos-credito-detalle";
  public tipo = "transaccion-tipos-credito-UPDATE";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api: ApiService, public dialogRef: MatDialogRef<TiposCreditoEditComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public dataCreditoEdit: any) {

    this.FormularioData = this.createForm();

    this.credito_edit = this.dataCreditoEdit?.dataCreditoEdit;
    this.credito_edit_codigo = this.dataCreditoEdit?.dataCreditoEdit?.codigo;
    this.credito_edit_duracion = this.dataCreditoEdit?.dataCreditoEdit?.duracion;
    this.credito_edit_descripcion = this.dataCreditoEdit?.dataCreditoEdit?.descripcion;
    this.credito_edit_es_fijo = this.dataCreditoEdit?.dataCreditoEdit?.es_fijo;
    
  }

  ngOnInit(): void {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.userLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
  }

  createForm(): FormGroup {
    this.credito_edit_codigo = this.dataCreditoEdit?.dataCreditoEdit?.codigo;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: this.credito_edit_codigo,
      descripcion: [this.dataform?.descripcion, Validators.compose([Validators.required])],
      es_fijo: [this.dataform.es_fijo],
      duracion: [this.dataform.duracion, Validators.compose([Validators.required])],

      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.userLogueado],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/mant/verubro/";

    return this.api.update("/venta/mant/vetipocredito/" + this.userConn + "/" + this.credito_edit?.codigo, data)
      .subscribe({
        next: (datav) => {
          this.rubro = datav;
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");

          this.onNoClick();
          this.spinner.show();
          this.toastr.success('Guardado con Exito! 🎉');

          location.reload();
        },

        error: (err) => {
          
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  onInputChange(value: string) {
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue = parsedValue;
    } else {
      this.credito_edit.duracion = null;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
