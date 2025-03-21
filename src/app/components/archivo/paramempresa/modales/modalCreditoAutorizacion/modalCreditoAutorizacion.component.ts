import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-modalCreditoAutorizacion',
  templateUrl: './modalCreditoAutorizacion.component.html',
  styleUrls: ['./modalCreditoAutorizacion.component.scss']
})
export class ModalCreditoAutorizacionComponent implements OnInit {

  FormularioData: FormGroup;
  public nota_credito: any = [];
  public dataEmpresa: any;
  public dataform: any = [];
  public credito_autorizacion = [];
  userConn: any;
  BD_storage: any;

  displayedColumns = ['dias', 'porcen_pagado', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  public ventana = "notas-cred-aut-create"
  public detalle = "notas-cred-aut-detalle";
  public tipo = "notas-cred-aut-POST";

  constructor(public dialogRef: MatDialogRef<ModalCreditoAutorizacionComponent>, private api: ApiService, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public dataEmpresaParametros: any, public _snackBar: MatSnackBar, public dialog: MatDialog,
    private _formBuilder: FormBuilder, public log_module: LogService) {
    this.FormularioData = this.createForm();
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;


  }

  ngOnInit() {
    this.dataEmpresa = this.dataEmpresaParametros.dataEmpresaParametros;

    this.getbyCodigoParametros(this.userConn, this.BD_storage);
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      codempresa: [this.dataEmpresaParametros.dataEmpresaParametros],
      dias: [this.dataform.dias, Validators.compose([Validators.required])],
      porcen_pagado: [this.dataform.porcen_pagado, Validators.compose([Validators.required])],
    });
  }

  getbyCodigoParametros(userConn, bd) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/adparametros_diasextranc";
    return this.api.getAll('/seg_adm/mant/adparametros_diasextranc/' + userConn + "" + "/" + bd?.bd)
      .subscribe({
        next: (datav) => {
          this.nota_credito = datav;
          this.dataSource = new MatTableDataSource(this.nota_credito);
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /serol";


    return this.api.create("/seg_adm/mant/adparametros_diasextranc/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.credito_autorizacion = datav;
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          
          this.spinner.show();

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);

          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
          });
        },

        error: (err) => {
          
        },
        complete: () => { }
      })
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  seg_adm/mant/adparametrosDiasextranc Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      // 
      if (result) {
        return this.api.delete('/seg_adm/mant/adparametros_diasextranc/' + this.userConn + "/" + element.codigo)
          .subscribe({
            next: () => {
              this.spinner.show();

              setTimeout(() => {
                this.spinner.hide();
              }, 1000);
              this.getbyCodigoParametros(this.userConn, this.BD_storage);

            },
            error: (err: any) => {
              
            },
            complete: () => { }
          })
      } else {
        alert("¡No se elimino!");
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
