import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-modal-cliente-info',
  templateUrl: './modal-cliente-info.component.html',
  styleUrls: ['./modal-cliente-info.component.scss']
})
export class ModalClienteInfoComponent implements OnInit {

  cod_cliente: any;
  info_cliente_completo: any = [];
  casa_matriz: any = [];
  anticipos: any = [];
  tiendas: any = [];
  titulares: any = [];
  envio_cliente: any = [];
  ult_compras: any = [];
  prom_especial: any = [];
  info_cliente_final: any = [];
  info_completo: any = [];
  otra_info_cliente: any = [];
  proformas_no_aprobadas_no_anuladas: any = [];
  proformas_no_aprobadas_no_anuladas_dataINF: any = [];

  userConn: any;
  usuario_logueado: any;
  longitud_titulares: any;
  bd_logueado: any = [];

  constructor(public dialogRef: MatDialogRef<ModalClienteInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public codigo_cliente: any, private api: ApiService,
    private spinner: NgxSpinnerService,) {

    this.cod_cliente = codigo_cliente.codigo_cliente;
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.bd_logueado = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
  }

  ngOnInit() {
    this.infoClientesCompleto();
  }

  infoClientesCompleto() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/oper/prgcrearinv/catalogointipoinv/"
    return this.api.getAll('/venta/transac/prgveclienteinfo/' + this.userConn + "/" + this.cod_cliente + "/" + this.bd_logueado?.bd + "/" + this.usuario_logueado)
      .subscribe({
        next: (datav) => {

          this.info_cliente_completo = datav;
          

        },

        error: (err: any) => {
          
        },
        complete: () => {

          this.info_completo = this.info_cliente_completo.infoCliente;
          this.casa_matriz = this.info_cliente_completo.creditosCliente;
          this.anticipos = this.info_cliente_completo.antCobCliente;
          this.tiendas = this.info_cliente_completo.tiendasTitulCliente[0].tienda;
          this.titulares = this.info_cliente_completo.tiendasTitulCliente[0].titular === null ? " " : this.info_cliente_completo.tiendasTitulCliente[0];

          if (this.titulares && this.titulares.length > 0) {
            this.longitud_titulares = this.titulares[0].length;
          } else {
            this.longitud_titulares = 0; // o cualquier otro valor predeterminado
          }

          this.envio_cliente = this.info_cliente_completo.ulttEnvioCliente;
          this.ult_compras = this.info_cliente_completo.ultiCompCliente;
          this.prom_especial = this.info_cliente_completo.promEspCliente;
          this.info_cliente_final = this.info_cliente_completo.infClienteFinal;
          this.otra_info_cliente = this.info_cliente_completo.otrsCondCliente;
          this.proformas_no_aprobadas_no_anuladas = this.info_cliente_completo.profnoApronoAnuCliente;
          this.proformas_no_aprobadas_no_anuladas_dataINF = this.info_cliente_completo.profnoApronoAnuCliente.dataInf[0];



          //proformas
          
          
          
          
          
          
          
          
          
          
          
          
        }
      })
  }

  close() {
    this.dialogRef.close();
  }
}
