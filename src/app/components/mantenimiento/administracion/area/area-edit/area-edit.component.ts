import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-area-edit',
  templateUrl: './area-edit.component.html',
  styleUrls: ['./area-edit.component.scss']
})

export class AreaEditComponent implements OnInit {

  FormularioDataEdit: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  area_edit: any = [];
  dataform: any = '';
  empresa: [];
  area: any = [];
  usuario_logueado: any;
  user_conn: any;
  errorMessage;

  public ventana = "area"
  public detalle = "area-edit";
  public tipo = "area-edit-PUT";

  constructor(private _formBuilder: FormBuilder, public log_module: LogService, public dialogRef: MatDialogRef<AreaEditComponent>,
    @Inject(MAT_DIALOG_DATA) public dataAreaEdit: any, private api: ApiService, private datePipe: DatePipe, private toastr: ToastrService,
    public _snackBar: MatSnackBar) {
      
    this.usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.area_edit = this.dataAreaEdit.dataAreaEdit;
    
    this.FormularioDataEdit = this.createForm();
  }

  ngOnInit() {

    this.getAllEmpresa();
  }

  getAllEmpresa() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adempresa/' + this.user_conn)
      .subscribe({
        next: (datav) => {
          this.empresa = datav;
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataAreaEdit.dataAreaEdit?.codigo],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      ciudad: [this.dataform.ciudad, Validators.compose([Validators.required])],
      empresa: [this.dataform.empresa],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuario_logueado],
    });
  }

  submitData() {
    let data = this.FormularioDataEdit.value;

    this.errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-/seg_adm/mant/adarea/";
    return this.api.update('/seg_adm/mant/adarea/' + this.user_conn + "/" + this.area_edit.codigo, data)
      .subscribe({
        next: (datav) => {
          this.area = datav;
          this.onNoClick();
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.toastr.success('! SE EDITO EXITOSAMENTE !');
          location.reload();
        },

        error: (err: any) => {
          this.toastr.error('! NO SE EDITO !');
          
        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
