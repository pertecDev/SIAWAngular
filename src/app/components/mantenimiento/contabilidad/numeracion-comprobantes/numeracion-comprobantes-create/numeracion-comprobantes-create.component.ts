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
  selector: 'app-numeracion-comprobantes-create',
  templateUrl: './numeracion-comprobantes-create.component.html',
  styleUrls: ['./numeracion-comprobantes-create.component.scss']
})
export class NumeracionComprobantesCreateComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  numcomprob: any = [];
  userConn: any;
  userLogueado: any = [];
  inputValue: number | null = null;

  public ventana = "numComprobates-create"
  public detalle = "numComprobates-detalle";
  public tipo = "transaccion-numComprobates-POST";


  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api: ApiService, public dialogRef: MatDialogRef<NumeracionComprobantesCreateComponent>, public _snackBar: MatSnackBar,
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
      id: [this.dataform.id, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      nroactual: [this.dataform.nroactual, Validators.pattern(/^-?\d+$/)],
      ajuste: [false],
      desde: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      hasta: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      usuarioreg: [this.userLogueado],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /contab/mant/cnnumeracion/";

    return this.api.create("/contab/mant/cnnumeracion/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.numcomprob = datav;

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
