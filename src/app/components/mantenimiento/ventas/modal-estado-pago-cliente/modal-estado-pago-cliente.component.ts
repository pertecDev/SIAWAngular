import { DatePipe } from '@angular/common';
import { AfterContentInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-modal-estado-pago-cliente',
  templateUrl: './modal-estado-pago-cliente.component.html',
  styleUrls: ['./modal-estado-pago-cliente.component.scss']
})
export class ModalEstadoPagoClienteComponent implements OnInit, AfterContentInit {

  dataSource_pagos = new MatTableDataSource();
  dataSourceWithPageSize_pagos = new MatTableDataSource();

  dataSource_cheques = new MatTableDataSource();
  dataSourceWithPageSize_cheques = new MatTableDataSource();

  dataSource_anticipos = new MatTableDataSource();
  dataSourceWithPageSize_anticipos = new MatTableDataSource();

  fecha_actual = new Date();
  fecha_actual1;

  cod_cliente_get: string;
  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  estado_pagos_all: any = [];
  pagos_cliente: any = [];
  anticipos_cliente: any = [];
  cheques_cliente: any = [];

  calculo_sesion: any = [];

  numero_ventas_sem: any;
  total_seleccionado: any;
  total_seleccionado_id: any;
  total_seleccionado_numero_id: any;
  total_adeudado: any;
  credito: any;

  private numberFormatter_2decimales: Intl.NumberFormat;

  displayedColumns = ['calculo', 'id', 'numero', 'fecha', 'para_venta_contado', 'monto',
    'monto_pagado', 'C', 'vencimiento', 'saldo_deudor', 'acumulado', 'moneda', 'monto', 'dias'];

  displayedColumnsCheques = ['id', 'numero', 'recibo', 'banco', 'fecha', 'fecha_pago',
    'monto', 'restante', 'observacion'];

  displayedColumnsAnticipos = ['id', 'numero', 'recibo', 'fecha', 'monto', 'restante'];

  constructor(public dialogRef: MatDialogRef<ModalEstadoPagoClienteComponent>, private messageService: MessageService,
    private api: ApiService, public _snackBar: MatSnackBar, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public cod_cliente: any) {

    this.cod_cliente_get = cod_cliente.cod_cliente;

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_2decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  ngOnInit() {
    this.fecha_actual1 = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.getEstadoPagosCliente();
  }

  getEstadoPagosCliente() {
    this.spinner.show();

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/prgestadocliente/getEstadoPagosCliente/";
    return this.api.getAll(`/venta/transac/prgestadocliente/getEstadoPagosCliente/${this.userConn}/${this.cod_cliente_get}/${this.fecha_actual1}/${this.agencia_logueado}/${this.BD_storage}`)
      .subscribe({
        next: (datav) => {
          this.estado_pagos_all = datav;
          

          this.numero_ventas_sem = this.estado_pagos_all.nroVentasUrgSem;
          this.total_seleccionado = 0.00;
          this.total_adeudado = this.estado_pagos_all.montototal;
          this.credito = this.formatNumber(this.estado_pagos_all.totCredito);

          this.pagos_cliente = this.estado_pagos_all.tablaEstadoCliente;
          this.dataSource_pagos = new MatTableDataSource(this.pagos_cliente);

          this.anticipos_cliente = this.estado_pagos_all.tablaAnticipos;
          this.dataSource_anticipos = new MatTableDataSource(this.anticipos_cliente);

          this.cheques_cliente = this.estado_pagos_all.tablaCheques;
          this.dataSource_cheques = new MatTableDataSource(this.cheques_cliente);

          if (this.cheques_cliente.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO HAY CHEQUES' });
          }

          if (this.pagos_cliente.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO HAY PAGOS' });
          }

          if (this.anticipos_cliente.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO HAY ANTICIPOS' });
          }

          setTimeout(() => {
            this.spinner.hide();
          }, 150);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 150);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 150);
        }
      })
  }

  formatNumber(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_2decimales.format(formattedNumber);
  }


  calcularSeleccion(element) {
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta: -/venta/transac/prgestadocliente/calcularSeleccion/";
    return this.api.create(`/venta/transac/prgestadocliente/calcularSeleccion/${this.userConn}/${this.usuarioLogueado}/${this.BD_storage}`, element)
      .subscribe({
        next: (datav) => {
          this.calculo_sesion = datav;
          
          this.total_seleccionado = this.calculo_sesion.montoSeleccionado;
          this.total_seleccionado_id = element.id;
          this.total_seleccionado_numero_id = element.numeroid;

          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'CALCULADO' + " " + element.id + " " + element.numeroid })
        },

        error: (err) => {
          
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO SE CALCULADO !' });
        },
        complete: () => { }
      })
  }

  close() {
    this.dialogRef.close();
  }
}
