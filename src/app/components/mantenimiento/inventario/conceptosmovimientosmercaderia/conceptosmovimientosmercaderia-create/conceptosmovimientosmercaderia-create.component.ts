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
  selector: 'app-conceptosmovimientosmercaderia-create',
  templateUrl: './conceptosmovimientosmercaderia-create.component.html',
  styleUrls: ['./conceptosmovimientosmercaderia-create.component.scss']
})
export class ConceptosmovimientosmercaderiaCreateComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  userConn: any;
  userLogueado: any = [];
  conceptos: any = [];
  tarifas: any = [];
  numTransf: any = [];
  tuVariable: any;

  inputValue: number | null = null;

  public ventana = "numConceptoNotasMovimiento-create"
  public detalle = "numConceptoNotasMovimiento-detalle";
  public tipo = "transaccion-numConceptoNotasMovimiento-POST";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api: ApiService, public dialogRef: MatDialogRef<ConceptosmovimientosmercaderiaCreateComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.userLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
    this.catalogoConcepto();
    this.catalogoListaPrecio();
  }

  createForm(): FormGroup {
    let usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      factor: 1,
      traspaso: [this.dataform.traspaso],
      porcosto: [this.dataform.porcosto],
      codtarifa: [this.dataform.codtarifa],
      codcontra_concepto: [this.dataform.codcontra_concepto],
      nroactual: [this.dataform.nroactual, Validators.pattern(/^-?\d+$/)],
      usuario_final: [true],
      cliente: [true],

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
    });
  }

  convertirBooleanoANumero(valor: boolean) {
    // Si el valor es true, devuelve 1; si es false, devuelve 0
    this.tuVariable = valor ? 1 : 0;
  }

  submitData() {
    let data = this.FormularioData.value;
    
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /inventario/mant/inconcepto/";

    return this.api.create("/inventario/mant/inconcepto/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.numTransf = datav;

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

  catalogoConcepto() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/inventario/mant/inconcepto/catalogo/";
    return this.api.getAll('/inventario/mant/inconcepto/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.conceptos = datav;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  catalogoListaPrecio() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/inventario/mant/intarifa/catalogo/";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.userLogueado)
      .subscribe({
        next: (datav) => {
          this.tarifas = datav;
          
        },

        error: (err: any) => {
          
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
