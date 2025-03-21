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
  selector: 'app-moneda-create',
  templateUrl: './moneda-create.component.html',
  styleUrls: ['./moneda-create.component.scss']
})
export class MonedaCreateComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  moneda: any = [];

  userConn: any;
  usuario_logueado: any;

  public ventana = "moneda-create"
  public detalle = "moneda-detalle";
  public tipo = "transaccion-moneda-POST";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api: ApiService, public dialogRef: MatDialogRef<MonedaCreateComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService,) {

    this.usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      decimales: [this.dataform.decimales],
      codmoneda_sin: [null],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuario_logueado],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  seg_adm/mant/admoneda";
    return this.api.create("/seg_adm/mant/admoneda/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.moneda = datav;
          

          this.toastr.success('!GUARDADO EXITOSAMENTE!');

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
          });

          location.reload();
        },

        error: (err) => {
          
          this.toastr.error('! NO SE GUARDADO !');

        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
