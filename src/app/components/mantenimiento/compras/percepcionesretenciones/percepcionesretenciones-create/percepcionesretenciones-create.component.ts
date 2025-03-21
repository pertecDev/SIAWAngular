import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-percepcionesretenciones-create',
  templateUrl: './percepcionesretenciones-create.component.html',
  styleUrls: ['./percepcionesretenciones-create.component.scss']
})
export class PercepcionesretencionesCreateComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  percpRet: any = [];
  userConn: any;
  userLogueado: any = [];
  inputValue: number | null = null;

  public ventana = "percepcionesRetenciones-create"
  public detalle = "percepcionesRetenciones-detalle";
  public tipo = "transaccion-percepcionesRetenciones-POST";


  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api: ApiService, public dialogRef: MatDialogRef<PercepcionesretencionesCreateComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.userLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit() {

  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.pattern(/^-?\d+$/)],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      porcentaje: [this.dataform.porcentaje, Validators.compose([Validators.required])],

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      usuarioreg: [this.userLogueado],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /compras/mant/cppercepcion/";

    return this.api.create("/compras/mant/cppercepcion/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.percpRet = datav;

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

  onNoClick(): void {
    this.dialogRef.close();
  }

  onInputChange(value: string) {
    // Validar y formatear el valor ingresado
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue = parsedValue;
    } else {
      this.inputValue = null;
    }
  }

}
