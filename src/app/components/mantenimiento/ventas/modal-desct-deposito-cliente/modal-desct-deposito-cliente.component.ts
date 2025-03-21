import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalDetalleObserValidacionComponent } from '../modal-detalle-obser-validacion/modal-detalle-obser-validacion.component';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-modal-desct-deposito-cliente',
  templateUrl: './modal-desct-deposito-cliente.component.html',
  styleUrls: ['./modal-desct-deposito-cliente.component.scss']
})
export class ModalDesctDepositoClienteComponent implements OnInit {

  pendientes: any = [];
  tabla_asignaciones_pendientes: any = [];
  tabla_asignaciones_NO_FACTURADAS: any = [];

  total_depositos: any;
  total_distribuido: any;
  total_desc_por_aplicar: any;
  total_aplicado_NO_FACTURADO: any;

  cliente_real_get: string;
  nit_get: string;
  nombre_cliente_get: string;
  cod_cliente_get: string;
  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  dataSource_anticipos = new MatTableDataSource();
  dataSourceWithPageSize_anticipos = new MatTableDataSource();

  displayedColumns = ['doc_cbza', 'doc_deposito', 'fecha_deposito_real', 'monto_cbza', 'moneda_cbza',
    'monto_dist', 'doc_remision', 'fecha_venta', 'numero_cuota', 'vence_cliente', 'desct', 'monto_desct',
    'obs'];

  displayedColumns_anticipos = ['nula', 'idprof', 'nroidprof', 'fechaprof', 'cod_cliente', 'cod_cliente_real', 'total',
    'aprobada', 'transferida', 'id_cbza', 'id_deposito', 'nro_id_deposito', 'id_anticipo', 'id_cbza_contado',
    'nro_id_cbza_contado', 'monto_desc', 'accion', 'numero_id_deposito'];

  constructor(public dialogRef: MatDialogRef<ModalDesctDepositoClienteComponent>, private api: ApiService,
    private messageService: MessageService, public log_module: LogService, private spinner: NgxSpinnerService,
    public _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public cod_cliente: any,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public nombre_cliente: any,
    @Inject(MAT_DIALOG_DATA) public nit: any,
    @Inject(MAT_DIALOG_DATA) public cliente_real: any) {

    this.cod_cliente_get = cod_cliente.cod_cliente;
    this.nombre_cliente_get = nombre_cliente.nombre_cliente;
    this.nit_get = nit.nit;
    this.cliente_real_get = cliente_real.cliente_real;

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
  }

  ngOnInit() {
    this.getData1Tab();
  }

  getData1Tab() {
    this.spinner.show();
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgdesctodeposito_pendiente/depPendientesRefresh/";
    return this.api.getAll('/venta/transac/prgdesctodeposito_pendiente/depPendientesRefresh/' + this.userConn + "/" + this.cod_cliente_get + "/" + this.cliente_real_get + "/" + this.nit_get + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          this.pendientes = datav;
          
          this.total_depositos = datav.desc_por_depos_pend_por_apli.ttl_cbza;
          this.total_distribuido = datav.desc_por_depos_pend_por_apli.ttl_descuentos_deposito;
          this.total_desc_por_aplicar = datav.desc_por_depos_pend_por_apli.ttl_dist;
          this.total_aplicado_NO_FACTURADO = datav.desc_asig_no_fact.ttl_aplicado_no_facturado;

          this.tabla_asignaciones_pendientes = datav.desc_por_depos_pend_por_apli.dt_depositos_pendientes;
          this.tabla_asignaciones_NO_FACTURADAS = datav.desc_asig_no_fact.dt_desctos_aplicados_no_facturados;

          this.dataSource = new MatTableDataSource(this.tabla_asignaciones_pendientes);
          this.dataSource_anticipos = new MatTableDataSource(this.tabla_asignaciones_NO_FACTURADAS);

          if (this.total_aplicado_NO_FACTURADO > 0) {
            this.modalDetalleObservaciones("ADVERTENCIA", "Se han encontrado proformas las cuales tienen descuentos por deposito asignados, verifidque esta situacion!!!");
          }

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        }
      })
  }

  modalDetalleObservaciones(obs, obsDetalle) {
    this.dialog.open(ModalDetalleObserValidacionComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        obs_titulo: obs,
        obs_contenido: obsDetalle,
      },
    });
  }

  eliminarDeposito(deposito) {
    
    this.spinner.show();

    let a = [deposito].map(element => {
      return { ...element, borrar: true };
    });

    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET-/venta/transac/prgdesctodeposito_pendiente/deleteDescProf/";
    return this.api.create('/venta/transac/prgdesctodeposito_pendiente/deleteDescProf/' + this.userConn + "/prgdesctodeposito_pendiente/" + this.usuarioLogueado, a)
      .subscribe({
        next: (datav) => {
          // this.pendientes = datav;
          
          this.getData1Tab();
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp })
          this.log_module.guardarLog("prgdesctodeposito_pendiente", "eliminarDescuentoDepositoProforma", "modalVerificarDepositoProforma", "", "");

          setTimeout(() => {
            this.spinner.hide();
          }, 0);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 0);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 0);
        }
      })
  }

  close() {
    this.dialogRef.close();
  }
}
