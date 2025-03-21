import { Component, ElementRef, HostListener, OnInit, ViewChild, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { ItemServiceService } from '../serviciosItem/item-service.service';
import { ModalSaldosComponent } from './modal-saldos/modal-saldos.component';
import { StockActualF9Component } from './stock-actual-f9/stock-actual-f9.component';
import { SaldoItemMatrizService } from './services-saldo-matriz/saldo-item-matriz.service';
import { ItemSeleccionCantidadComponent } from './item-seleccion-cantidad/item-seleccion-cantidad.component';
import { ServicioF9Service } from './stock-actual-f9/servicio-f9.service';
import { DatePipe } from '@angular/common';
import { ModalPrecioVentaComponent } from '../modal-precio-venta/modal-precio-venta.component';
import { ServicioprecioventaService } from '../servicioprecioventa/servicioprecioventa.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';

import Handsontable from 'handsontable';
@Component({
  selector: 'app-matriz-items',
  templateUrl: './matriz-items.component.html',
  styleUrls: ['./matriz-items.component.scss']
})
export class MatrizItemsComponent implements OnInit, AfterViewInit, OnDestroy {

  // @HostListener("document:keydown.F9", []) unloadHandler(event: Event) {
  //   // Verificar si la tecla F9 ya ha sido presionada
  //   this.modalStockActualF9();
  // };

  @HostListener("document:keydown.enter", []) unloadHandler1(event: Event) {
    const focusedElement = document.activeElement as HTMLElement;
    let nombre_input = focusedElement.id;
    
    switch (nombre_input) {
      case '':
        this.onCellClick1(this.valorCelda);
        if (this.permiso_para_vista) {
          if (this.valorCelda) {
            if (!this.item_valido) {
              
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: '¡ EL ITEM NO ESTA EN VENTA !' });
              this.loseFocus();
              return;
            } else {
              
              this.onCellClick1(this.valorCelda);
              this.getEmpaqueItem();
            }
          }
        } else {
          this.cant_empaque === 0;
          const focusElement = this.focusPedido1.nativeElement;
          focusElement.click();

          if (this.pedido != 0) {
            this.addItemArray();
          }
        }
        break;
      case 'focusEmpaque':
        
        if (this.valorCelda) {
          this.onCellClick1(this.valorCelda);
          this.getEmpaqueItem();
        }
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
        // this.pedido = null;
        // this.cantidad = undefined;
        break;
      case 'idBuscadorHoja':
        this.getHoja();
        break;
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

  @HostListener("click", []) unloadHandler(event: KeyboardEvent) {
    if (this.valorCelda) {
      this.onCellClick1(this.valorCelda);
    }
  };

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
  saldoLocal: any;
  saldoItem_number: number;

  id_proforma_get: any;
  num_id_proforma_get: any;

  private unsubscribe$ = new Subject<void>();

  @ViewChild("focusCantidad", { static: false }) focusCantidad1: ElementRef;
  @ViewChild("focusPedido", { static: false }) focusPedido1: ElementRef;
  @ViewChild('focusEmpaque', { static: false }) focusEmpaqueElement: ElementRef;
  @ViewChild('exampleRef') exampleElement: ElementRef;

  @ViewChild('example') focusTabla: ElementRef;

  constructor(private api: ApiService, public dialog: MatDialog, public dialogRef: MatDialogRef<MatrizItemsComponent>,
    public itemservice: ItemServiceService, private spinner: NgxSpinnerService, private datePipe: DatePipe,
    private messageService: MessageService, public saldoItemServices: SaldoItemMatrizService,
    public serviciof9: ServicioF9Service, private servicioPrecioVenta: ServicioprecioventaService,

    @Inject(MAT_DIALOG_DATA) public descuento: any, @Inject(MAT_DIALOG_DATA) public codcliente_real: any,
    @Inject(MAT_DIALOG_DATA) public codcliente: any, @Inject(MAT_DIALOG_DATA) public codalmacen: any,
    @Inject(MAT_DIALOG_DATA) public desc_linea_seg_solicitud: any, @Inject(MAT_DIALOG_DATA) public fecha: any,
    @Inject(MAT_DIALOG_DATA) public codmoneda: any, @Inject(MAT_DIALOG_DATA) public items: any,
    @Inject(MAT_DIALOG_DATA) public precio_de_venta: any, @Inject(MAT_DIALOG_DATA) public tamanio_carrito_compras: any,
    @Inject(MAT_DIALOG_DATA) public descuento_nivel: any, @Inject(MAT_DIALOG_DATA) public id_proforma: any,
    @Inject(MAT_DIALOG_DATA) public num_id_proforma: any) {

    this.array_items_proforma_matriz = items?.items;
    this.pedidoInicial = 0;
    this.cantidad = this.pedido;

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.agencia = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;

    if (this.usuario_logueado === 'OPERGPS') {
      this.permiso_para_vista = false;
    } else {
      this.permiso_para_vista = true;
    }

    if (precio_de_venta?.precio_de_venta) {
      this.cod_precio_venta_modal_codigo1 = precio_de_venta?.precio_de_venta;
    } else {
      this.getTarifa();
    }

    this.descuento_get = descuento?.descuento;
    this.codcliente_get = codcliente?.codcliente;
    this.codalmacen_get = codalmacen?.codalmacen;
    this.desc_linea_seg_solicitud_get = desc_linea_seg_solicitud?.desc_linea_seg_solicitud;
    this.fecha_get = fecha?.fecha;
    this.codmoneda_get = codmoneda?.codmoneda;
    this.descuento_nivel_get = descuento_nivel?.descuento_nivel;
    this.codcliente_real_get = codcliente_real?.codcliente_real;
    this.tamanio_carro = tamanio_carrito_compras?.tamanio_carrito_compras;
    this.id_proforma_get = id_proforma?.id_proforma;
    this.num_id_proforma_get = num_id_proforma?.num_id_proforma;
    this.num_id_proforma_get = num_id_proforma?.num_id_proforma;
    // 
    // 
    
    

    this.num_id_proforma_get = num_id_proforma?.num_id_proforma;
    // 
    // 
    
    

    this.num_hoja = this.num_hoja;

    if (this.num_hoja === undefined || this.num_hoja === 0) {
      this.getHojaPorDefecto();
    }

    this.listaHojas();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    history.pushState(null, '', location.href); // Si se detecta navegación hacia atrás, vuelve al mismo lugar
  }

  ngOnInit() {
    history.pushState(null, '', location.href); // Coloca un estado en la historia

    //this.getPermisosBtnPorRol();
    // 

    this.dataItemsSeleccionadosMultiple = [];
    // 
    // this.setFocus();

    this.saldoItemServices.disparadorDeSaldoAlm1.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // 
      this.saldo_modal_total_1 = data.saldo1;
    });

    this.saldoItemServices.disparadorDeSaldoAlm2.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // 
      this.saldo_modal_total_2 = data.saldo2;
    });

    this.saldoItemServices.disparadorDeSaldoAlm3.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // 
      this.saldo_modal_total_3 = data.saldo3;
    });

    this.saldoItemServices.disparadorDeSaldoAlm4.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // 
      this.saldo_modal_total_4 = data.saldo4;
    });

    this.saldoItemServices.disparadorDeSaldoAlm5.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // 
      this.saldo_modal_total_5 = data.saldo5;
    });

    //Items seleccionados
    this.itemservice.disparadorDeItemsSeleccionadosAMatriz.pipe(takeUntil(this.unsubscribe$)).subscribe(datav => {
      // 
      this.item_seleccionados_catalogo_matriz = datav;
      this.tamanio_carrito = this.item_seleccionados_catalogo_matriz.length;

      // 
      this.addItemArraySeleccion();
    });
    //

    this.servicioPrecioVenta.disparadorDePrecioVenta.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // 
      this.cod_precio_venta_modal_codigo1 = data.precio_venta.codigo;
    });
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    // Mostramos los mensajes de validación concatenados
    if (this.validacion) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡' + this.messages.join(', ') + '!' });
    }
    
    const focusedElement = document.activeElement as HTMLElement;
    let nombre_input = focusedElement.id;
    
    //this.myInputField.nativeElement.focus();
    // this.focusMyInput();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
        // this.getEmpaqueItem();
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
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.tarifa_get_unico = datav;
          this.cod_precio_venta_modal_codigo1 = this.tarifa_get_unico[0].codigo;
          // 
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  onCellClick1(item: any): void {
    const cleanText = (item || "").replace(/\s+/g, "").trim();
    const regex = /[!@#$%^&*(),.?":{}|<>\/\\\[\]-]/;

    this.codigo_item_celda = cleanText;
    this.item = cleanText.toUpperCase();
    let a = regex.test(this.item);

    if (this.item && a === false) { 
      this.getlineaProductoID(cleanText);
      this.validarItemParaVenta(cleanText);
      this.getAlmacenesSaldos();
      this.getEmpaquePesoAlmacenLocal(cleanText);
      this.getSaldoItem(cleanText);
      this.getEmpaqueItemInfoCantidades(cleanText);
      this.getPrecioItemSeleccionado(cleanText);
    } 
  }

  getEmpaquePesoAlmacenLocal(item) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/inmatriz/pesoEmpaqueSaldo/' + this.userConn + "/" + this.cod_precio_venta_modal_codigo1 + "/" + this.descuento_get + "/" + item + "/" + this.agencia + "/" + this.BD_storage)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.data_almacen_local = datav;
        },

        error: (err: any) => {
          this.data_almacen_local.saldo = 0;
        },
        complete: () => { }
      })
  }

  getSaldoItem(item) {
    let agencia_concat = "AG" + this.agencia;

    let array_send = {
      agencia: agencia_concat,
      codalmacen: this.agencia,
      coditem: item,
      codempresa: this.BD_storage,
      usuario: this.usuario_logueado,

      idProforma: this.id_proforma_get?.toString() === undefined ? " " : this.id_proforma_get?.toString(),
      nroIdProforma: this.num_id_proforma_get
    };

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.create
      ('/venta/transac/veproforma/getsaldoDetalleSP/' + this.userConn, array_send)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.id_tipo = datav; 
          this.saldoItem = datav.totalSaldo;
          this.saldoItem_number = parseInt(datav.totalSaldo);
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getHoja() {
    
    if (this.num_hoja != 0 || this.num_hoja != undefined) {
      let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/inventario/mant/inmatriz/";
      return this.api.getAll('/inventario/mant/inmatriz/' + this.userConn + "/" + this.num_hoja)
        .pipe(takeUntil(this.unsubscribe$)).subscribe({
          next: (datav) => {
            this.hojas = datav;
            this.initHandsontable(this.hojas, this.permiso_para_vista);
          },

          error: (err: any) => {  },
          complete: () => { }
        })
    } else {
      
    }
  }

  getHojaPorDefecto() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/inmatriz/' + this.userConn + "/01")
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.hojas = datav;
          this.initHandsontable(this.hojas, this.permiso_para_vista);
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

  private hot: Handsontable | null = null; // Mantener una referencia a la instancia de Handsontable
  initHandsontable(hojas, permiso): void {
    var self = this;

    const container = document.getElementById('example');
    // Si ya existe una instancia de Handsontable, simplemente actualiza los datos
    if (this.hot) {
      this.hot.loadData(hojas); // Actualiza los datos
      return; // Salir de la función
    }
    // Si no existe, inicializa Handsontable
    this.hot = new Handsontable(container, {
      data: hojas,
      manualRowResize: false,
      manualColumnResize: false,
      dropdownMenu: true,
      contextMenu: false,
      filters: false,
      licenseKey: 'non-commercial-and-evaluation',
      rowHeaders: false,
      colHeaders: true,
      selectionMode: 'multiple',
      navigableHeaders: true, // New accessibility feature
      tabNavigation: true, // New accessibility feature
      viewportRowRenderingOffset: 55, // Ajusta según sea necesario
      viewportColumnRenderingOffset: 13, // Ajusta según sea necesario
      columns: [
        { data: 'a', type: 'text', readOnly: true },
        { data: 'b', type: 'text', readOnly: true },
        { data: 'c', type: 'text', readOnly: true },
        { data: 'd', type: 'text', readOnly: true },
        { data: 'e', type: 'text', readOnly: true },
        { data: 'f', type: 'text', readOnly: true },
        { data: 'g', type: 'text', readOnly: true },
        { data: 'h', type: 'text', readOnly: true },
        { data: 'i', type: 'text', readOnly: true },
        { data: 'j', type: 'text', readOnly: true },
        { data: 'k', type: 'text', readOnly: true },
        { data: 'l', type: 'text', readOnly: true },
        { data: 'm', type: 'text', readOnly: true },
      ],
      className: 'my-custom-row-class',

      beforeKeyDown: function (e) {
        //si el rol es true funciona con empaques
        // si el rol es false funciona directo a pedido
        
        switch (e.key) {
          case 'Enter':
            if (permiso) {
              
              // this.focusPedido();
              // this.focusPedido.nativeElement.focus();
              // this.render.selectRootElement('#focusPedido').focus();
              // this.input1.nativeElement.focus();
              // this.setFocus();

              // const focusedElement = document.activeElement as HTMLElement;
              // let nombre_input = focusedElement.id;
              // 

              self.focusEmpaque();
              const focusElement = this.focusEmpaqueElement.nativeElement;
              focusElement.focus();
              break;
            } else {
              

              // this.cant_empaque = 0;
              // const focusedElement = document.activeElement as HTMLElement;
              // focusedElement.id = nombre_input;

              const focusElement = this.focusPedido1.nativeElement === undefined ? "" : this.focusPedido1.nativeElement;
              this.renderer.selectRootElement(focusElement).focus();
              // this.focusPedido();
              focusElement.click();
              break;
            }
        }
      }
    });

    // Interceptar el evento Enter y mantener la selección
    // hot.addHook('beforeKeyDown', (event: KeyboardEvent) => {
    //   const selectedCoords = hot.getSelected();
    //   const focusedElement = document.activeElement as HTMLElement;
    //   let nombre_input = focusedElement.id;

    //   if (event.key === 'Enter' && selectedCoords) {
    //     event.preventDefault(); // Evitar el movimiento por defecto
    //     const [startRow, startCol] = selectedCoords[0];
    //     hot.selectCell(startRow, startCol); // Esto fuerza la selección en la misma celda
    //     switch (nombre_input) {
    //       case "":
    //         
    //           this.focusEmpaque();
    //           const focusElement = this.focusEmpaqueElement.nativeElement.focus();
    //           focusElement.focus();

    //         break;
    //       case "focusEmpaque":
    //         this.getEmpaqueItem();

    //         break;
    //       case "focusPedido":
    //         this.addItemArray();
    //         this.cantidad = this.pedido;
    //         

    //         break;
    //       default:
    //         break;
    //     }

    //     // Vuelve a seleccionar la celda actual para evitar que se mueva
    //     setTimeout(() => {
    //       hot.selectCell(startRow, startCol); // Esto fuerza la selección en la misma celda
    //     });

    //     const cellData = hot.getDataAtCell(startRow, startCol);
    //     this.onCellClick1(cellData); // Ejecuta la función
    //   }
    // });

    this.hot.addHook('afterSelectionEnd', () => {
      const selectedCoords = this.hot.getSelected();
      if (selectedCoords) {
        const [startRow, startCol] = selectedCoords[0];
        // 
        // Obtener la data de la celda seleccionada
        const cellData = this.hot.getDataAtCell(startRow, startCol);
        this.valorCelda = cellData;
        // 

        //this.onCellClick1(cellData);
      }
    });

    this.hot.addHook('afterSelectionEndByProp', () => {
      const selectedRanges = this.hot.getSelectedRange();
      // Verificar si se ha seleccionado algún rango
      if (selectedRanges && selectedRanges.length > 0) {
        const data = [];

        // Iterar sobre cada rango seleccionado
        selectedRanges.forEach((selectedRange) => {
          const startRow = Math.min(selectedRange.from.row, selectedRange.to.row);
          const endRow = Math.max(selectedRange.from.row, selectedRange.to.row);
          const startCol = Math.min(selectedRange.from.col, selectedRange.to.col);
          const endCol = Math.max(selectedRange.from.col, selectedRange.to.col);

          // Iterar sobre las celdas dentro del rango y agregar sus valores al array
          for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
              const cellValue = this.hot.getDataAtCell(row, col);
              data.push(cellValue.replace(/\s+/g, " ").trim());
            }
          }
        });

        this.dataItemsSeleccionadosMultiple = data;
        // 
      } else {
        
      }
    });
  }

  focusPedido() {
    // this.pedido = 0;
  }

  focusEmpaque() {
    const focusElement = this.focusEmpaqueElement.nativeElement;
    focusElement.focus();
  }

  focusCantidad() {
    const focusElement = this.focusPedido1.nativeElement;
    focusElement.focus();
    // this.addItemArray();
  }

  focusMyInput() {
    this.focusEmpaqueElement.nativeElement.focus();
  }

  addItemArray() {
    // this.array_items_proforma_matriz.length = this.array_items_completo.length;
    let i = this.array_items_completo.length + 1;
    let j = this.array_items_completo.length + this.array_items_proforma_matriz.length;
    // let i = this.array_items_completo.length + 1;
    this.tamanio_carrito = this.array_items_proforma_matriz.length + 1;
    // 
    //aca es cuando el focus esta en pedido y se le da enter para que agregue al carrito
    const cleanText = this.valorCelda.replace(/\s+/g, " ").trim();

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
    // 

    if (existe) {
      // 
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: '¡ EL ITEM YA ESTA EN CARRITO !' });
      // Luego, para quitar el foco
      this.focusEmpaqueElement.nativeElement.blur();

      this.cant_empaque = null;
      this.pedido = null;
      this.cantidad = null;
      return;
    }

    // 
    if (!this.item_valido) {
      
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: '¡ EL ITEM NO ESTA EN VENTA !' });
      return;
    }

    if (cleanText != this.item) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: '¡ NO ES EL ITEM SELECCIONADO, USTED ELIGIO EL ITEM !  ' + this.item });
      return;
    }
    // if (this.pedido === 0 || this.pedido === undefined) {
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
    } else {
      if (this.permiso_para_vista) {
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'EL PEDIDO CANTIDAD NO PUEDE SER 0' });
      }
    }

    //ACA SE AGREGA CUANDO ELIJES SOLO 1 ITEM al carrito concatenando cuando elijes solo 1 xD
    this.array_items_completo = this.array_items_seleccionado.push(...this.array_items_completo_multiple);

    //LONGITUD DEL CARRITO DE COMPRAS
    this.tamanio_lista_item_pedido = this.array_items_completo.length;

    let nombre_input: string = ""
    const focusedElement = document.activeElement as HTMLElement;
    focusedElement.id = nombre_input;

    // 
    //ACA SE AGREGA CUANDO ELIJES SOLO 1 ITEM al carrito concatenando cuando elijes solo 1 xD
    this.array_items_completo = this.array_items_seleccionado.concat(this.item_seleccionados_catalogo_matriz);
    
    //   "ITEM SELECCIONADO UNITARIO:", this.array_items_seleccionado,
    //   "ITEM'S SELECCION MULTIPLE:", this.array_items_proforma_matriz,
    //   "TAMANIO CARRITO: ", this.array_items_completo.length, this.array_items_completo.length,
    //   this.array_items_seleccionado.length, this.array_items_proforma_matriz.length);
    this.tamanio_lista_item_pedido = this.array_items_completo.length;


    this.cant_empaque = null;
    this.pedido = null;
    this.cantidad = null;
  }

  addItemArraySeleccion() {
    // ACA SE AGREGA CUANDO ELIJES SOLO 1 ITEM al carrito concatenando cuando elijes solo 1 xD
    this.array_items_completo = this.item_seleccionados_catalogo_matriz;

    // si el carrito ya tiene items concatenarlo a la nueva carga de items
    // aca se pone el numerito que indica el total de los items que hay en el carrito
    this.tamanio_lista_item_pedido = this.array_items_completo.length;
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
        cantidad_pedida: elemento.cantidad_pedida === null ? 0 : elemento.cantidad_pedida,
        cantidad: elemento.cantidad === null ? 0 : elemento.cantidad,
        codcliente: this.codcliente_get,
        opcion_nivel: this.descuento_nivel_get?.toString(),
        codalmacen: this.codalmacen_get,
        desc_linea_seg_solicitud: this.desc_linea_seg_solicitud_get,
        codmoneda: this.codmoneda_get,
        fecha: this.fecha_get,
        // empaque: this.cant_empaque,
        empaque: elemento.cant_empaque === undefined || this.cant_empaque === 0 ?
          parseInt(elemento.cantidad_empaque || 0) : parseInt(this.cant_empaque || 0),
        orden_pedido: elemento.nroitem,
        nroitem: elemento.nroitem,
      }
    });
    // 

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-/venta/transac/veproforma/getItemMatriz_AnadirbyGroup/";
    return this.api.create("/venta/transac/veproforma/getItemMatriz_AnadirbyGroup/" + this.userConn + "/" + this.BD_storage + "/" + this.usuario_logueado, a)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
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
    // 
    // 
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

    this.pedido = null;
    this.cantidad = null;
    this.num_hoja = null;
    this.tamanio_lista_item_pedido = 0;
  }

  validarItemParaVenta(value) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getItemParaVta/' + this.userConn + "/" + value)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.item_valido = datav;
          // 
          if (this.item_valido == true) {
            this.getlineaProductoID(value);
          } else {
            this.no_venta = "ITEM NO VENTA";
            this.si_venta = "";
          }
        },

        error: (err: any) => {
          
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
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.item_obtenido = datav;
          // 

          this.codigo_item = this.item_obtenido.codigo;
          this.descripcion_item = this.item_obtenido.descripcion;
          this.medida_item = this.item_obtenido.medida;
          this.porcen_item = this.item_obtenido.porcen_maximo;
        },

        error: (err: any) => {
          // 
          this.item_valido = false;
          // 
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
    // 
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getempaques/";
    return this.api.getAll('/venta/transac/veproforma/getempaques/' + this.userConn + "/" + item)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.empaquesItem = datav;
          // 
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
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.precioItem = datav;
          // 
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

  getEmpaqueItem() {
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
      focusElement.click();
    } else {

      if (!this.item_valido) {
        
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'ITEM NO ESTA A LA VENTA' });
        this.valorCelda = 0;
        this.item_set = "";
        this.descripcion_item = "";
        this.medida_item = "";
        this.porcen_item = "";

        this.item_valido = undefined;
        // this.pedido = null;
        // this.cantidad = null;
        // this.num_hoja = null;

        this.loseFocus();
        return;
      }

      

      if (this.cant_empaque === undefined || this.cant_empaque === 0 || this.cant_empaque === null) {
        // this.cant_empaque = 0;

        const focusElement = this.focusEmpaqueElement.nativeElement.focus();
        focusElement.focus();
      }

      if (this.cant_empaque !== '') {
        return this.api.getAll('/venta/transac/veproforma/getCantItemsbyEmp/' + this.userConn + "/" + d_tipo_precio_desct + "/" + this.cod_precio_venta_modal_codigo1 + "/" + cleanText + "/" + this.cant_empaque)
          .subscribe({
            next: (datav) => {
              this.pedido = datav.total;
              this.cant_empaque = this.cant_empaque;
              
              
            },

            error: (err: any) => {
              this.pedido = null;
              this.cantidad = this.pedido;
              
            },
            complete: () => {
              // console.clear();
              const focusedElement = document.activeElement as HTMLElement;
              focusedElement.id = nombre_input;

              const focusElement = this.focusPedido1.nativeElement;

              focusElement.click();
            }
          })
      }
    };
  }

  getAlmacenesSaldos() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getCodAlmSlds/";
    return this.api.getAll('/venta/transac/veproforma/getCodAlmSlds/' + this.userConn + "/" + this.usuario_logueado)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.almacenes_saldos = datav;
          // 
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
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
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
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.hojas = datav;
          // 
          this.initHandsontable(this.hojas, this.permiso_para_vista);
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
      height: '50vh',
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

    // 
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