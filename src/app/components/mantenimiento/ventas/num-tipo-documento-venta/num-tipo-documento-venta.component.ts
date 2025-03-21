import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CatalogoDocumentoVentaComponent } from './catalogo-documento-venta/catalogo-documento-venta.component';
import { DocumentoVentaService } from './documento-venta-service/documento-venta.service';

@Component({
  selector: 'app-num-tipo-documento-venta',
  templateUrl: './num-tipo-documento-venta.component.html',
  styleUrls: ['./num-tipo-documento-venta.component.scss']
})
export class NumTipoDocumentoVentaComponent implements OnInit, AfterViewInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  codigo: any;
  dataform: any = '';
  usuarioLogueado: any;
  agencia_logueado: any;
  cod_vendedor_cliente_modal: any;
  userConn: any;
  documento_get_catalogo_id: any;

  unidad_negocio: any = [];
  documento_get_catalogo: any = [];
  doc_data_id: any = [];
  doc_save: any = [];
  inputValue: number | null = null;

  nombre_ventana: string = "abmvenumeracion.vb";
  public ventana = "Numeracion"
  public detalle = "numeracion-create";
  public tipo = "numeracion-CREATE";

  constructor(public dialog: MatDialog, private api: ApiService, private spinner: NgxSpinnerService,
    public _snackBar: MatSnackBar, public log_module: LogService, private _formBuilder: FormBuilder,
    public nombre_ventana_service: NombreVentanaService, private toastr: ToastrService,
    public documento_services: DocumentoVentaService, private datePipe: DatePipe,) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
    this.documento_services.disparadorDeDocDeVenta.subscribe(data => {
      
      this.documento_get_catalogo = data.documento;
      this.documento_get_catalogo_id = data.documento.id
      this.getDocumentoID(this.documento_get_catalogo_id);
    });
  }

  ngAfterViewInit(): void {
    this.getUnidadNegocio();
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      id: [this.dataform.id, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      nroactual: [this.dataform.nroactual, Validators.compose([Validators.required])],
      tipodoc: [this.dataform.tipodoc],
      habilitado: [this.dataform.habilitado ? this.dataform.habilitado : false],
      descarga: [this.dataform.descarga ? this.dataform.descarga : false],
      codunidad: [this.dataform.codunidad],
      reversion: [this.dataform.reversion],
      tipo: [this.dataform.tipo],
      codalmacen: [this.agencia_logueado],

      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
    });
  }

  submitData() {
    const data = this.FormularioData.value;
    

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /venta/mant/velugar/";
    return this.api.create("/venta/mant/venumeracion/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.doc_save = datav;
          

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.toastr.success('! SE GUARDO EXITOSAMENTE !');
          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          });
          location.reload();
        },

        error: (err) => {
          
        },
        complete: () => { }
      })
  }

  limpiar() {
    this.documento_get_catalogo_id = "";
    this.doc_data_id.id = "";
    this.doc_data_id.descripcion = "";
    this.doc_data_id.nroactual = "";
    this.doc_data_id.tipodoc = "";
    this.doc_data_id.habilitado = "";
    this.doc_data_id.descarga = "";
    this.doc_data_id.codunidad = "";
    this.doc_data_id.reversion = "";
    this.doc_data_id.tipo = "";
  }

  submitDataEdit() {
    const data = this.FormularioData.value;
    

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /venta/mant/venumeracion/";
    return this.api.update("/venta/mant/venumeracion/" + this.userConn + "/" + this.documento_get_catalogo_id, data)
      .subscribe({
        next: (datav) => {
          this.doc_save = datav;
          

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.toastr.success('! SE GUARDO EXITOSAMENTE !');
          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          });
          location.reload();
        },

        error: (err) => {
          
        },
        complete: () => { }
      })
  }

  getDocumentoID(id) {
    let errorMessage: string;
    errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/mant/venumeracion/";
    return this.api.getAll('/venta/mant/venumeracion/' + this.userConn + "/" + id)
      .subscribe({
        next: (datav) => {
          this.doc_data_id = datav;
          

        },
        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  eliminar() {
    let ventana = "Numeracion"
    let detalle = "numeracion-doc-DELETE";
    let tipo = "numeracion-doc-DELETE";

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:--  seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: this.documento_get_catalogo_id },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/venta/mant/venumeracion/' + this.userConn + "/" + this.documento_get_catalogo_id)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(ventana, detalle, tipo, "", "");

              this.toastr.success('!ELIMINADO EXITOSAMENTE!');
              this.limpiar();
            },
            error: (err: any) => {
              
              this.toastr.error('! NO ELIMINADO !');
            },
            complete: () => { }
          })
      } else {
        this.toastr.error('! CANCELADO !');
      }
    });
  }

  getUnidadNegocio() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/adunidad/catalogo"
    return this.api.getAll('/seg_adm/mant/adunidad/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.unidad_negocio = datav;
          // 
        },
        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  catalogoDocumentoVenta() {
    this.dialog.open(CatalogoDocumentoVentaComponent, {
      width: 'auto',
      height: 'auto',
    });
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

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
