import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-modalSubTotalMostradorTiendas',
  templateUrl: './modalSubTotalMostradorTiendas.component.html',
  styleUrls: ['./modalSubTotalMostradorTiendas.component.scss']
})
export class ModalSubTotalMostradorTiendasComponent implements OnInit {

  sub_totabilizar_post: any = [];
  BD_storage: any = [];
  desglose: any = [];
  userConn: any;
  usuario_logueado: any;

  items_carrito: any[] = [];
  cliente: any;
  almacen: any;
  moneda: any;
  desclinea: any;
  fecha_proforma: any;
  descuento_nivel_get: any;
  fecha_actual = new Date();

  private numberFormatter_2decimales: Intl.NumberFormat;

  constructor(public dialogRef: MatDialogRef<ModalSubTotalMostradorTiendasComponent>, private toastr: ToastrService,
    private api: ApiService, private spinner: NgxSpinnerService, private datePipe: DatePipe,
    public itemservice: ItemServiceService,
    @Inject(MAT_DIALOG_DATA) public items: any,
    @Inject(MAT_DIALOG_DATA) public descuento_nivel: any,
    @Inject(MAT_DIALOG_DATA) public cod_cliente: any,
    @Inject(MAT_DIALOG_DATA) public cod_almacen: any,
    @Inject(MAT_DIALOG_DATA) public cod_moneda: any,
    @Inject(MAT_DIALOG_DATA) public desc_linea: any,
    @Inject(MAT_DIALOG_DATA) public fecha: any) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.items_carrito = items.items;
    this.cliente = cod_cliente.cod_cliente;
    this.almacen = cod_almacen.cod_almacen;
    this.moneda = cod_moneda.cod_moneda;
    this.desclinea = desc_linea.desc_linea;
    this.descuento_nivel_get = descuento_nivel.descuento_nivel;
    this.fecha_proforma = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    // 
    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_2decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  ngOnInit() {
    this.sacarSubTotal();
  }

  sacarSubTotal() {
    this.spinner.show();
    const arrayTransformado = this.items_carrito?.map(item => ({
      ...item,
      coditem: item.coditem,
      cantidad: item.cantidad,
    }));

    
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/docvefacturamos_cufd/sumas_Subtotal/";
    return this.api.create("/venta/transac/docvefacturamos_cufd/sumas_Subtotal/" + this.userConn + "/" + this.BD_storage + "/" + this.usuario_logueado, arrayTransformado)
      .subscribe({
        next: (datav) => {
          this.sub_totabilizar_post = datav;
          this.desglose = datav.desgloce;
          

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err) => {
          
          this.toastr.error('! NO SE TOTALIZO !');
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          this.mandarArrayItemSubTotal(this.sub_totabilizar_post.resul);
        }
      })
  }

  mandarArrayItemSubTotal(items) {
    this.itemservice.enviarItemsProcesadosSubTotal(items);
  }

  formatNumberTotalSub(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_2decimales.format(formattedNumber);
  }

  close() {
    this.dialogRef.close();
  }
}
