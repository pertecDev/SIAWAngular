import { Component, ElementRef, HostListener, OnInit, ViewChild, Renderer2, Inject, AfterViewInit, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { ItemServiceService } from '../serviciosItem/item-service.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ModalPrecioVentaComponent } from '../modal-precio-venta/modal-precio-venta.component';
import { ServicioprecioventaService } from '../servicioprecioventa/servicioprecioventa.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { SaldoItemMatrizService } from '../matriz-items/services-saldo-matriz/saldo-item-matriz.service';
import { ServicioF9Service } from '../matriz-items/stock-actual-f9/servicio-f9.service';
import { ModalSaldosComponent } from '../matriz-items/modal-saldos/modal-saldos.component';
import { StockActualF9Component } from '../matriz-items/stock-actual-f9/stock-actual-f9.component';
import { ItemSeleccionCantidadComponent } from '../matriz-items/item-seleccion-cantidad/item-seleccion-cantidad.component';
import { Item } from '../../../../services/modelos/objetos';
import { Subject, takeUntil } from 'rxjs';

interface City {
  name: string,
  code: string
}

@Component({
  selector: 'app-matriz-items-lista',
  templateUrl: './matriz-items-lista.component.html',
  styleUrls: ['./matriz-items-lista.component.scss']
})
export class MatrizItemsListaComponent implements OnInit, AfterViewInit {

  @HostListener("document:keydown.enter", []) unloadHandler1(event: Event) {
    const focusedElement = document.activeElement as HTMLElement;
    let nombre_input = focusedElement.id;
    
    if (this.permiso_para_vista === true) {
      switch (nombre_input) {
        case '':
          this.addItemArray();
          break;
        case 'focusEmpaque':
          this.getEmpaqueItem(this.valorCelda);
          break;


        case 'focusPedido':
          this.addItemArray();
          //this.cant_empaque = undefined;
          this.cantidad = this.pedido;
          break;
        case 'focusCantidad':
          // ACA SE COLOCA AL ARRAY DE ITEMS SELECCIONADOS PARA LA VENTA
          // UNA VEZ YA EN EN ARRAY, VUELVE A LA ULTIMA POSICION DE LA MATRIZ
          this.addItemArray();
          // this.cant_empaque = undefined;
          // this.pedido = undefined;
          // this.cantidad = undefined;
          break;
        case 'idBuscadorHoja':
          this.getHoja();
          break;
      }
    }
  }

  @HostListener("document:keydown.tab", []) unloadHandler2(event: Event) {
    const focusedElement = document.activeElement as HTMLElement;
    let nombre_input = focusedElement.id;
    

    switch (nombre_input) {
      case 'focusPedido':
        this.focusCantidad();
        break;
    }
  }

  FormularioBusqueda: FormGroup
  dataform: any = '';
  num_hoja: any;
  cantidad: number;
  pedido: number;
  pedidoInicial: number;
  cant_empaque: any;
  saldoItem: number;
  empaque_view = false;
  item_valido: boolean;
  validacion: boolean = false;
  empaque_item_codigo: string;
  empaque_item_descripcion: string;
  empaque_descripcion_concat: string;
  messages: any = [];
  BD_storage: any;
  agencia: any;
  userConn: any;
  precio_input: any;
  usuario_logueado: string = "";
  valorCelda: any;
  tamanio_lista_item_pedido: any = 0;

  item: any = 0;
  item_set: any;
  codigo_item: any;
  descripcion_item: string = "";
  medida_item: string = "";
  porcen_item: string = "";
  no_venta: string = "";
  si_venta: string = "";

  saldo_modal_total_1: any;
  saldo_modal_total_2: any;
  saldo_modal_total_3: any;
  saldo_modal_total_4: any;
  saldo_modal_total_5: any;

  items_catalogo!: Item[];
  selected_Item!: Item;

  id_tipo: any = [];
  hojas: any = [];
  item_obtenido: any = [];
  almacenes_saldos: any = [];
  empaquesItem: any = [];
  data_almacen_local: any = [];
  array_items_seleccionado: any = [];
  array_items_proforma_matriz: any = [];
  array_items_completo: any = [];
  dataItemsSeleccionadosMultiple: any = [];
  items_post: any = [];
  lista_hojas: any = [];
  elementoActual = this.lista_hojas[0];
  item_seleccionados_catalogo_matriz: any = [];
  array_items_completo_multiple: any = [];
  precioItem: any = [];

  descuento_get: any;
  codcliente_get: any;
  codalmacen_get: any;
  desc_linea_seg_solicitud_get: any;
  fecha_get: any;
  codmoneda_get: any;
  descuento_nivel_get: any;
  codcliente_real_get: any;

  contador: number = 0;
  codigo_item_celda: any;

  tarifa_get_unico: any = [];
  tarifa_get_unico_copied: any = [];
  cod_precio_venta_modal_codigo1: any;
  output: string;
  tamanio_carrito: any;

  izquierda: string = "izquierda";
  derecha: string = "derecha";

  precio: any = true;
  desct: any = false;
  tamanio_carro: any;
  permiso_para_vista: boolean;
  
  hideMultipleSelectionIndicator = signal(false);
  private unsubscribe$ = new Subject<void>();

  @ViewChild("focusCantidad", { static: false }) focusCantidad1: ElementRef;
  @ViewChild("focusPedido", { static: false }) focusPedido1: ElementRef;
  @ViewChild('focusEmpaque', { static: false }) focusEmpaqueElement: ElementRef;
  @ViewChild('exampleRef') exampleElement: ElementRef;
  @ViewChild('listboxElement') listboxElement: any; // Referencia al listbox


  @ViewChild('example') focusTabla: ElementRef;

  cities!: City[];
  selectedCity!: City;

  constructor(private api: ApiService, public dialog: MatDialog, public dialogRef: MatDialogRef<MatrizItemsListaComponent>,
    public itemservice: ItemServiceService, public renderer: Renderer2, private spinner: NgxSpinnerService,
    private toastr: ToastrService, public saldoItemServices: SaldoItemMatrizService,
    public serviciof9: ServicioF9Service, private datePipe: DatePipe, private servicioPrecioVenta: ServicioprecioventaService,

    @Inject(MAT_DIALOG_DATA) public descuento: any, @Inject(MAT_DIALOG_DATA) public codcliente_real: any,
    @Inject(MAT_DIALOG_DATA) public codcliente: any, @Inject(MAT_DIALOG_DATA) public codalmacen: any,
    @Inject(MAT_DIALOG_DATA) public desc_linea_seg_solicitud: any,
    @Inject(MAT_DIALOG_DATA) public codmoneda: any, @Inject(MAT_DIALOG_DATA) public items: any,
    @Inject(MAT_DIALOG_DATA) public descuento_nivel: any, @Inject(MAT_DIALOG_DATA) public tamanio_carrito_compras: any) {

    this.array_items_proforma_matriz = items?.items;
    //array_items_completo
    // si ya existen items en el detalle de la proforma todo se concatena a este array this.array_items_proforma_matriz

    this.pedidoInicial = 0;
    this.cantidad = this.pedido;

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.agencia = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;

    this.descuento_get = descuento?.descuento;
    this.codcliente_get = codcliente?.codcliente;
    this.codalmacen_get = codalmacen?.codalmacen;
    this.desc_linea_seg_solicitud_get = desc_linea_seg_solicitud?.desc_linea_seg_solicitud;
    this.codmoneda_get = codmoneda?.codmoneda;
    this.descuento_nivel_get = descuento_nivel?.descuento_nivel;
    this.codcliente_real_get = codcliente_real?.codcliente_real;
    this.tamanio_carro = tamanio_carrito_compras?.tamanio_carrito_compras;

    
    

    
    this.num_hoja = this.num_hoja;

    if (this.num_hoja === undefined || this.num_hoja === 0) {
      this.getHojaPorDefecto();
    }

    this.listaHojas();
    this.getTarifa();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    history.pushState(null, '', location.href); // Si se detecta navegación hacia atrás, vuelve al mismo lugar
  }

  ngOnInit() {
    history.pushState(null, '', location.href); // Coloca un estado en la historia

    this.getPermisosBtnPorRol();
    this.getCatalogoItems();
    this.getHoraFechaServidorBckEnd();

    

    this.dataItemsSeleccionadosMultiple = [];
    
    // this.setFocus();

    this.saldoItemServices.disparadorDeSaldoAlm1.subscribe(data => {
      
      this.saldo_modal_total_1 = data.saldo1;
    });

    this.saldoItemServices.disparadorDeSaldoAlm2.subscribe(data => {
      
      this.saldo_modal_total_2 = data.saldo2;
    });

    this.saldoItemServices.disparadorDeSaldoAlm3.subscribe(data => {
      
      this.saldo_modal_total_3 = data.saldo3;
    });

    this.saldoItemServices.disparadorDeSaldoAlm4.subscribe(data => {
      
      this.saldo_modal_total_4 = data.saldo4;
    });

    this.saldoItemServices.disparadorDeSaldoAlm5.subscribe(data => {
      
      this.saldo_modal_total_5 = data.saldo5;
    });

    //Items seleccionados
    this.itemservice.disparadorDeItemsSeleccionadosAMatriz.subscribe(datav => {
      
      this.item_seleccionados_catalogo_matriz = datav;
      this.tamanio_carrito = this.item_seleccionados_catalogo_matriz.length;

      
      //this.addItemArraySeleccion();
    });
    //

    this.servicioPrecioVenta.disparadorDePrecioVenta.subscribe(data => {
      
      this.cod_precio_venta_modal_codigo1 = data.precio_venta.codigo;
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // Mostramos los mensajes de validación concatenados
    if (this.validacion) {
      this.toastr.error('¡' + this.messages.join(', ') + '!');
    }

    

    const focusedElement = document.activeElement as HTMLElement;
    let nombre_input = focusedElement.id;
    
    //this.myInputField.nativeElement.focus();
    this.focusMyInput();

    // Asegúrate de que el elemento esté inicializado y luego aplica el foco
    if (this.listboxElement && this.listboxElement.nativeElement) {
      this.listboxElement.nativeElement.focus(); // Accede al elemento DOM nativo y enfoca
    }
  }

  setFocusOnListbox() {
    if (this.listboxElement) {
      this.listboxElement.nativeElement.focus(); // Accede al elemento DOM nativo y enfoca
    }
  }

  getCatalogoItems() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/inventario/mant/initem/catalogo2/";
    return this.api.getAll('/inventario/mant/initem/catalogo2/' + this.userConn)
      .subscribe({
        next: (datav) => {
          
          this.items_catalogo = datav.slice(0, 1000);
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getHoraFechaServidorBckEnd() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.fecha_get = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getSelectedItem() {
    if (this.selected_Item) {
      
      // Aquí puedes acceder a las propiedades como codigo, descripcion y medida
      
      this.valorCelda = this.selected_Item.codigo;
      this.allDataItem(this.selected_Item.codigo);

      if (this.item_valido === true) {
        this.focusInput();
      } else {
        this.toastr.error("NO ES VENTA")
      }
    } else {
      
    }
  }

  getSelectedItemInfo() {
    if (this.selected_Item) {
      
      // Aquí puedes acceder a las propiedades como codigo, descripcion y medida
      
      this.allDataItem(this.selected_Item.codigo);
      this.valorCelda = this.selected_Item.codigo;
    } else {
      
    }
  }



  focusInput() {
    this.focusEmpaqueElement.nativeElement.id = 'focusEmpaque';
    this.focusEmpaqueElement.nativeElement.focus();
  }

  togglePrecio() {
    if (this.precio) {
      this.precio = false;
    } else {
      this.precio = true;
      this.desct = false; // Asegura que desct sea false cuando precio es true
    }
  }

  toggleDescuento() {
    if (this.desct) {
      this.desct = false;
    } else {
      this.desct = true;
      this.precio = false; // Asegura que precio sea false cuando desct es true
    }
  }

  simulateEnterKey(): void {
    this.focusEmpaque();

    const focusedElement = document.activeElement as HTMLElement;
    let nombre_input = focusedElement.id;
    

    switch (nombre_input) {
      case 'focusEmpaque':
        this.getEmpaqueItem(this.valorCelda);
        break;
        case 'focusEmpaque':
          this.getEmpaqueItem(this.valorCelda);
          break;
        case 'focusPedido':
          this.addItemArray();
          //this.cant_empaque = undefined;
          this.cantidad = this.pedido;
          break;
        case 'focusCantidad':
          // ACA SE COLOCA AL ARRAY DE ITEMS SELECCIONADOS PARA LA VENTA
          // UNA VEZ YA EN EN ARRAY, VUELVE A LA ULTIMA POSICION DE LA MATRIZ
          this.addItemArray();
          // this.cant_empaque = undefined;
          // this.pedido = undefined;
          // this.cantidad = undefined;
          break;
        case 'idBuscadorHoja':
          this.getHoja();
          break;
    }
  }

  agregarCarritoMobile() {
    this.addItemArray();
  }

  onLeavePrecioVenta(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.tarifa_get_unico.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = 0;
      
    } else {
      event.target.value = entero;
    }
  }

  getTarifa() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/intarifa/catalogo/";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuario_logueado)
      .subscribe({
        next: (datav) => {
          this.tarifa_get_unico = datav;
          this.cod_precio_venta_modal_codigo1 = this.tarifa_get_unico[0].codigo;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  allDataItem(item: any): void {
    
    // aca llega el item y se guarda en la varialbe this.item
    // se le quita el espacio del final
    // this.getSaldoItem(this.item);

    const cleanText = item.replace(/\s+/g, "").trim();
    this.codigo_item_celda = cleanText;
    

    this.item = cleanText.toUpperCase();
    this.getlineaProductoID(cleanText);
    this.validarItemParaVenta(cleanText);
    this.getAlmacenesSaldos();
    this.getEmpaquePesoAlmacenLocal(cleanText);
    this.getSaldoItem(cleanText);
    this.getEmpaqueItemInfoCantidades(cleanText);
    this.getPrecioItemSeleccionado(cleanText);

    this.pedido = undefined;
    this.cantidad = undefined;
  }

  simulateEnter(){
    // const inputElement = document.querySelector('input'); // Cambia el selector según tu necesidad
    // if (inputElement) {
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true // Asegura que el evento se propague
      });
    
  }

  handleKeyDown(event: KeyboardEvent) {
    // para borrar los inputs
    if (event.key === 'Backspace') {

      const focusedElement = document.activeElement as HTMLElement;
      let nombre_input = focusedElement.id;
      

      

      if (nombre_input === 'focusEmpaque') {
        this.cant_empaque = undefined;
      }

      if (nombre_input === '') {
        this.cant_empaque = undefined;
      }

      if (nombre_input === 'focusPedido') {
        this.pedido = undefined;
      }

      if (nombre_input === 'focusCantidad') {
        this.cantidad = undefined;
      }
    }
  }


  getEmpaquePesoAlmacenLocal(item) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/inmatriz/pesoEmpaqueSaldo/' + this.userConn + "/" + this.cod_precio_venta_modal_codigo1 + "/" + this.descuento_get + "/" + item + "/" + this.agencia + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          this.data_almacen_local = datav;
          
        },

        error: (err: any) => {
          
          this.data_almacen_local.saldo = 0;
          //this.toastr.error('¡CELDA NO VALIDA!');
        },
        complete: () => {
        }
      })
  }

  getSaldoItem(item) {
    let agencia_concat = "AG" + this.agencia;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll
      ('/venta/transac/veproforma/getsaldosCompleto/' + this.userConn + "/" + agencia_concat + "/" + this.agencia + "/" + item + "/" + this.BD_storage + "/" + this.usuario_logueado)
      .subscribe({
        next: (datav) => {
          this.id_tipo = datav;
          
          // this.letraSaldos = this.id_tipo[0].resp;
          // this.saldo_variable = this.id_tipo[2];

          // LETRA
          this.id_tipo[1].forEach(element => {
            if (element.descripcion === 'Total Saldo') {
              if (element.valor < 0) {
                this.saldoItem = 0;
              } else {
                this.saldoItem = element.valor;
              }

              
            }
          });
        },

        error: (err: any) => {
          
        },
        complete: () => {
        }
      })
  }

  getHoja() {
    
    if (this.num_hoja != 0 || this.num_hoja != undefined) {
      let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/inventario/mant/inmatriz/";
      return this.api.getAll('/inventario/mant/inmatriz/' + this.userConn + "/" + this.num_hoja)
        .subscribe({
          next: (datav) => {
            this.hojas = datav;
            
            // this.initHandsontable(this.hojas);

          },

          error: (err: any) => {
            
          },
          complete: () => { }
        })
    } else {
      
    }
  }

  getHojaPorDefecto() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/inmatriz/' + this.userConn + "/01")
      .subscribe({
        next: (datav) => {
          this.hojas = datav;
          
          // this.initHandsontable(this.hojas);
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  listaHojas() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/inventario/mant/inmatriz/hojas/";
    return this.api.getAll('/inventario/mant/inmatriz/hojas/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.lista_hojas = datav;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }


  focusPedido() {
    this.renderer.selectRootElement('#focusPedido').focus();
    // this.pedido = 0;
  }

  focusEmpaque() {
    // this.renderer.selectRootElement('#focusEmpaque').focus();
    const focusElement = this.focusEmpaqueElement.nativeElement;
    focusElement.focus();
  }

  focusCantidad() {
    const focusElement = this.focusPedido1.nativeElement;
    focusElement.focus();
    // this.renderer.selectRootElement('#focusCantidad').focus();
    // this.addItemArray();
  }

  focusMyInput() {
    // this.focusEmpaqueElement.nativeElement.focus();
  }

  addItemArray() {
    // this.array_items_proforma_matriz.length = this.array_items_completo.length;
    let i = this.array_items_completo.length + 1;
    let j = this.array_items_completo.length + this.array_items_proforma_matriz.length;
    // let i = this.array_items_completo.length + 1;
    this.tamanio_carrito = this.array_items_proforma_matriz.length + 1;
    
    //aca es cuando el focus esta en pedido y se le da enter para que agregue al carrito
    const cleanText = this.valorCelda.replace(/\s+/g, " ").trim();
    //LONGITUD DEL CARRITO DE COMPRAS
    

    let array = {
      coditem: cleanText,
      tarifa: this.cod_precio_venta_modal_codigo1,
      descuento: this.descuento_get,
      cantidad_pedida: this.pedido,
      cantidad: this.cantidad === undefined ? this.pedido : this.cantidad,
      opcion_nivel: this.desc_linea_seg_solicitud_get,
      codalmacen: this.codalmacen_get,
      codcliente: this.codcliente_get,
      desc_linea_seg_solicitud: this.desc_linea_seg_solicitud_get,
      codmoneda: this.codmoneda_get,
      fecha: this.fecha_get,
      descripcion: this.descripcion_item,
      medida: this.medida_item,
      cantidad_empaque: this.cant_empaque,

      //aca funciona pero cuando se cierra la matriz toma valor 1 y empieza su orden de nuevo
      // orden_pedido: this.array_items_completo.length + 1,
      // nroitem: this.array_items_completo.length + 1,

      // aca
      orden_pedido: j + 1,
      nroitem: j + 1,
    };

    //ARRAY DE 1 ITEM SELECCIONADO
    
    let existe = this.array_items_completo.some(item => item.coditem === array.coditem);
    

    if (existe) {
      
      this.toastr.warning('¡EL ITEM YA ESTA EN CARRITO!');

      // Luego, para quitar el foco
      this.focusEmpaqueElement.nativeElement.blur();

      this.cant_empaque = undefined;
      this.pedido = undefined;
      this.cantidad = undefined;
      return;
    }

    if (!this.item_valido) {
      
      //this.toastr.error('¡EL ITEM NO ESTA EN VENTA!');
      return;
    }

    // if (this.pedido === 0 || this.pedido === undefined) {
    // this.toastr.warning('¡La cantidad y el pedido no pueden ser 0!');
    //return;
    //}

    // //CUANDO NO HAY NADA EN EL CARRITO Y ES EL PRIMER ITEM SE AGREGA ACA,
    // //Y SI YA TIENE ITEMS SE TIENEN QUE IR AGREGANDO AL ARRAY SIN BORRARSE
    // if (this.array_items_seleccionados_length === undefined) {
    // UNA VEZ QUE EL ITEM PASA LAS VALIDACIONES SE AGREGA AL ARRAY array_items_seleccionado
    // }
    // else {
    //   this.array_items_proforma_matriz.push(array);
    // }

    if (this.pedido != 0 && this.pedido != undefined) {
      this.array_items_seleccionado.push(array);
      this.loseFocus();
    } else {
      this.toastr.warning("El Pedido Cantidad No Puede ser 0");
    }

    //ACA SE AGREGA CUANDO ELIJES SOLO 1 ITEM al carrito concatenando cuando elijes solo 1 xD
    this.array_items_completo = this.array_items_seleccionado.concat(this.array_items_completo_multiple);

    //LONGITUD DEL CARRITO DE COMPRAS
    this.tamanio_lista_item_pedido = this.array_items_completo.length;

    let nombre_input: string = ""
    const focusedElement = document.activeElement as HTMLElement;
    focusedElement.id = nombre_input;

    

    //ACA SE AGREGA CUANDO ELIJES SOLO 1 ITEM al carrito concatenando cuando elijes solo 1 xD
    this.array_items_completo = this.array_items_seleccionado.concat(this.item_seleccionados_catalogo_matriz);

    

    this.cant_empaque = undefined;
    this.pedido = undefined;
    this.cantidad = undefined;
    this.tamanio_lista_item_pedido = this.array_items_completo.length;

    this.loseFocus();
  }

  mandarItemaProforma() {
    this.spinner.show();

    //ESTE FUNCION ES DEL BOTON CONFIRMAR DEL CARRITO
    //aca se tiene q mapear los items que me llegan en la funcion
    
    let a = this.array_items_completo.map((elemento) => {
      return {
        coditem: elemento.coditem,
        // tarifa: this.tarifa_get,
        tarifa: elemento.tarifa === undefined ? this.cod_precio_venta_modal_codigo1 : elemento.tarifa,
        descuento: elemento.descuento === undefined ? this.descuento_get : elemento.descuento,
        cantidad_pedida: elemento.cantidad_pedida,
        cantidad: elemento.cantidad,
        codcliente: this.codcliente_get,
        opcion_nivel: this.descuento_nivel_get?.toString(),
        codalmacen: this.codalmacen_get,
        desc_linea_seg_solicitud: this.desc_linea_seg_solicitud_get,
        codmoneda: this.codmoneda_get,
        fecha: this.fecha_get,
        empaque: this.cant_empaque === undefined || this.cant_empaque === 0 ?
          parseInt(elemento.cantidad_empaque || 0) :
          parseInt(this.cant_empaque || 0),
        orden_pedido: elemento.nroitem,
        nroitem: elemento.nroitem,
      }
    });

    

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-/venta/transac/veproforma/getItemMatriz_AnadirbyGroup/";
    return this.api.create("/venta/transac/veproforma/getItemMatriz_AnadirbyGroup/" + this.userConn + "/" + this.BD_storage + "/" + this.usuario_logueado, a)
      .subscribe({
        next: (datav) => {
          this.items_post = datav;
          

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err) => {
          

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          // ACA SE ENVIA A LA PROFORMA EN EL SERVICIO enviarItemsAlServicio();
          if (this.array_items_proforma_matriz.length > 0) {
            // 
            this.enviarItemsAlServicio(this.items_post, this.array_items_completo);
          } else {
            // 
            this.enviarItemsAlServicio(this.items_post, this.array_items_completo);
          }

          this.dialogRef.close();
          this.num_hoja = 0;
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      })
  }

  enviarItemsAlServicio(items: any[], items_sin_proceso: any[]) {
    
    

    this.itemservice.enviarItemCompletoAProforma(items);
    this.itemservice.enviarItemsSinProcesar(items_sin_proceso);
  }

  eliminarItemArrayPedido(item) {
    
    this.array_items_completo = this.array_items_completo.filter(i => i.coditem !== item);
    this.tamanio_lista_item_pedido = this.array_items_completo.length;

    this.array_items_proforma_matriz = this.array_items_proforma_matriz.filter(i => i.coditem !== item);
    this.array_items_seleccionado = this.array_items_seleccionado.filter(i => i.coditem !== item);

    
  }

  limpiarMatriz() {
    this.data_almacen_local = [];
    this.item_obtenido = [];
    this.empaquesItem = [];
    this.almacenes_saldos = [];
    this.array_items_seleccionado = [];
    this.array_items_completo = [];

    this.item_set = "";
    this.descripcion_item = "";
    this.medida_item = "";
    this.porcen_item = "";

    this.pedido = undefined;
    this.cantidad = undefined;
    this.num_hoja = undefined;
    this.tamanio_lista_item_pedido = 0;
  }

  validarItemParaVenta(value) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getItemParaVta/' + this.userConn + "/" + value)
      .subscribe({
        next: (datav) => {
          this.item_valido = datav;
          
          if (this.item_valido == true) {
            this.getlineaProductoID(value);
          } else {
            // this.toastr.warning('!ITEM NO VALIDO PARA LA VENTA!');
            this.no_venta = "ITEM NO VENTA";
            this.si_venta = "";
          }
        },

        error: (err: any) => {
          
          // this.toastr.warning('SELECCIONE UN ITEM');
          this.si_venta = "ITEM VENTA";
          this.no_venta = "";
          this.descripcion_item = '';
          this.medida_item = '';
          this.porcen_item = '';

          this.empaquesItem = [];
        },
        complete: () => { }
      })
  }

  getlineaProductoID(value) {
    this.saldo_modal_total_1 = "";
    this.saldo_modal_total_2 = "";
    this.saldo_modal_total_3 = "";
    this.saldo_modal_total_4 = "";
    this.saldo_modal_total_5 = "";

    const cleanText = value.replace(/\s+/g, "").trim();
    let item1 = cleanText.toUpperCase();

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/mant/inmatriz/infoItemRes/";
    return this.api.getAll('/inventario/mant/inmatriz/infoItemRes/' + this.userConn + "/" + this.agencia + "/" + item1 + "/" +
      this.cod_precio_venta_modal_codigo1 + "/" + this.descuento_get + "/" + this.codcliente_real_get)
      .subscribe({
        next: (datav) => {
          this.item_obtenido = datav;
          

          this.codigo_item = this.item_obtenido.codigo;
          this.descripcion_item = this.item_obtenido.descripcion;
          this.medida_item = this.item_obtenido.medida;
          this.porcen_item = this.item_obtenido.porcen_maximo;
        },

        error: (err: any) => {
          
          this.item_valido = false;
          
        },
        complete: () => {
        }
      })
  }

  loseFocus() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  getEmpaqueItemInfoCantidades(item) {
    
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getempaques/";
    return this.api.getAll('/venta/transac/veproforma/getempaques/' + this.userConn + "/" + item)
      .subscribe({
        next: (datav) => {
          this.empaquesItem = datav;
          
          this.empaque_view = true;

          this.empaque_item_codigo = this.empaquesItem.codigo;
          this.empaque_item_descripcion = this.empaquesItem.descripcion;
          this.cantidad = this.empaquesItem.cantidad;

          this.empaque_descripcion_concat = "(" + this.empaque_item_codigo + ")" + this.empaque_item_descripcion + "-" + this.cantidad + " | ";
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getPrecioItemSeleccionado(item) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veproforma/getPreciosItem/";
    return this.api.getAll('/venta/transac/veproforma/getPreciosItem/' + this.userConn + "/" + item + "/" + this.codalmacen_get + "/" + this.codmoneda_get)
      .subscribe({
        next: (datav) => {
          this.precioItem = datav;
          
          // this.empaque_view = true;

          // this.empaque_item_codigo = this.empaquesItem.codigo;
          // this.empaque_item_descripcion = this.empaquesItem.descripcion;
          // this.cantidad = this.empaquesItem.cantidad;

          // this.empaque_descripcion_concat = "(" + this.empaque_item_codigo + ")" + this.empaque_item_descripcion + "-" + this.cantidad + " | ";
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getEmpaqueItem(cleanText1) {
    

    const cleanText = this.valorCelda.replace(/\s+/g, " ").trim();
    var d_tipo_precio_desct: string;
    let nombre_input: string = "focusPedido"
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getempaques/";

    if (this.precio === true) {
      d_tipo_precio_desct = "Precio";
    } else {
      d_tipo_precio_desct = "Descuento"
    };

    if (this.cant_empaque === 0) {
      const focusedElement = document.activeElement as HTMLElement;
      focusedElement.id = nombre_input;

      const focusElement = this.focusPedido1.nativeElement;
      this.renderer.selectRootElement(focusElement).focus();
      focusElement.click();
    } else {
      if (this.cant_empaque === undefined) {
        this.cant_empaque = '';
      }

      return this.api.getAll('/venta/transac/veproforma/getCantItemsbyEmp/' + this.userConn + "/" + d_tipo_precio_desct + "/" + this.cod_precio_venta_modal_codigo1 + "/" + cleanText1 + "/" + this.cant_empaque)
        .subscribe({
          next: (datav) => {
            this.pedido = datav.total;
            
          },

          error: (err: any) => {
            this.pedido = undefined;
            this.cantidad = this.pedido;
            
          },
          complete: () => {
            const focusedElement = document.activeElement as HTMLElement;
            focusedElement.id = nombre_input;

            const focusElement = this.focusPedido1.nativeElement;
            focusElement.click();
          }
        })
    };
  }

  getAlmacenesSaldos() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getCodAlmSlds/";
    return this.api.getAll('/venta/transac/veproforma/getCodAlmSlds/' + this.userConn + "/" + this.usuario_logueado)
      .subscribe({
        next: (datav) => {
          this.almacenes_saldos = datav;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  pasarHoja(lado: string, numero_hoja) {
    

    switch (lado) {
      case "derecha":
        const indiceActual1 = this.lista_hojas.indexOf(numero_hoja);
        const siguienteIndice1 = (indiceActual1 + 1) % this.lista_hojas.length;
        this.elementoActual = this.lista_hojas[siguienteIndice1];
        this.num_hoja = this.elementoActual;

        
        this.getAllHojaControls(this.elementoActual);
        break;
      case "izquierda":
        const indiceActual = this.lista_hojas.indexOf(numero_hoja);
        const siguienteIndice = (indiceActual - 1) % this.lista_hojas.length;
        this.elementoActual = this.lista_hojas[siguienteIndice];
        this.num_hoja = this.elementoActual;

        
        this.getAllHojaControls(this.elementoActual);
    }
  }

  getPermisosBtnPorRol() {
    // esta funcion devuelve un booleano para verificar que tiene permiso para ver el input y la funcional de empaques
    // esta funcion mas que todo es para Don Percy ya que la matriz se personaliza para su uso exclusivo de el.
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veproforma/verColEmpbyUser/";
    return this.api.getAll('/venta/transac/veproforma/verColEmpbyUser/' + this.userConn + "/" + this.usuario_logueado)
      .subscribe({
        next: (datav) => {
          this.permiso_para_vista = datav.veEmpaques;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getAllHojaControls(hoja) {
    
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/inventario/mant/inmatriz/";
    return this.api.getAll('/inventario/mant/inmatriz/' + this.userConn + "/" + hoja)
      .subscribe({
        next: (datav) => {
          this.hojas = datav;
          
          // this.initHandsontable(this.hojas);
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  modalSaldos(cod_almacen, posicion_fija): void {
    this.dialog.open(ModalSaldosComponent, {
      width: 'auto',
      height: 'auto',
      data: { cod_almacen: cod_almacen, cod_item: this.item, posicion_fija: posicion_fija },
    });
  }

  modalStockActualF9() {
    this.dialog.open(StockActualF9Component, {
      width: 'auto',
      height: '55vh',
      data: { cod_item_celda: this.codigo_item }
    });
  }

  seleccionMultipleItemHotTable() {
    

    this.dialog.open(ItemSeleccionCantidadComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        dataItemSeleccionados: this.dataItemsSeleccionadosMultiple,
        tarifa: this.cod_precio_venta_modal_codigo1,
        descuento: this.descuento_get,
        codcliente: this.codcliente_get,
        codalmacen: this.codalmacen_get,
        desc_linea_seg_solicitud: this.desc_linea_seg_solicitud_get,
        codmoneda: this.codmoneda_get,
        desct_nivel: this.descuento_nivel_get,
        items: this.array_items_completo,
        fecha: this.datePipe.transform(this.fecha_get, "yyyy-MM-dd"),
        precio_venta: this.cod_precio_venta_modal_codigo1,
        // tamanio_carrito_compras: this.array_items_completo.length,
        tamanio_carrito_compras: this.array_items_proforma_matriz.length,
      },
    });

    
  }

  modalPrecioVenta(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { detalle: false }
    });
  }

  close() {
    let tamanio = this.array_items_completo.length;
    

    if (tamanio > 0) {
      const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
        width: 'auto',
        height: 'auto',
        data: { mensaje_dialog: "HAY ITEMS EN EL CARRITO !, ¿ SEGURO QUE DESEA SALIR ?" },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result: Boolean) => {
        if (result) {
          
          this.dialogRef.close();
        } else {
          
        }
      });
    } else {
      this.dialogRef.close();
    }
  }
}
