import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ItemDetalle, veCliente } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { MonedaCatalogoComponent } from '@components/mantenimiento/administracion/moneda/moneda-catalogo/moneda-catalogo/moneda-catalogo.component';
import { MonedaServicioService } from '@components/mantenimiento/administracion/moneda/servicio-moneda/moneda-servicio.service';
import { MatTabGroup } from '@angular/material/tabs';
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { ServicioclienteService } from '@components/mantenimiento/ventas/serviciocliente/serviciocliente.service';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { VendedorService } from '@components/mantenimiento/ventas/serviciovendedor/vendedor.service';
import { ServicioprecioventaService } from '@components/mantenimiento/ventas/servicioprecioventa/servicioprecioventa.service';
import { SubTotalService } from '@components/mantenimiento/ventas/modal-sub-total/sub-total-service/sub-total.service';
import { DescuentoService } from '@components/mantenimiento/ventas/serviciodescuento/descuento.service';
import { TipoidService } from '@components/mantenimiento/ventas/serviciotipoid/tipoid.service';
import { SaldoItemMatrizService } from '@components/mantenimiento/ventas/matriz-items/services-saldo-matriz/saldo-item-matriz.service';
import { RecargoToProformaService } from '@components/mantenimiento/ventas/modal-recargos/recargo-to-proforma-services/recargo-to-proforma.service';
import { EtiquetaService } from '@components/mantenimiento/ventas/modal-etiqueta/servicio-etiqueta/etiqueta.service';
import { AnticipoProformaService } from '@components/mantenimiento/ventas/anticipos-proforma/servicio-anticipo-proforma/anticipo-proforma.service';
import { ComunicacionproformaService } from '@components/mantenimiento/ventas/serviciocomunicacionproforma/comunicacionproforma.service';
import { ModalIdtipoComponent } from '@components/mantenimiento/ventas/modal-idtipo/modal-idtipo.component';
import { ModalVendedorComponent } from '@components/mantenimiento/ventas/modal-vendedor/modal-vendedor.component';
import { ModalPrecioVentaComponent } from '@components/mantenimiento/ventas/modal-precio-venta/modal-precio-venta.component';
import { ModalDescuentosComponent } from '@components/mantenimiento/ventas/descuentos-especiales/modal-descuentos/modal-descuentos.component';
import { VentanaValidacionesComponent } from '@components/mantenimiento/ventas/ventana-validaciones/ventana-validaciones.component';
import { MatrizItemsComponent } from '@components/mantenimiento/ventas/matriz-items/matriz-items.component';
import { ModalItemsComponent } from '@components/mantenimiento/ventas/modal-items/modal-items.component';
import { ModalClienteComponent } from '@components/mantenimiento/ventas/modal-cliente/modal-cliente.component';
import { ModalClienteInfoComponent } from '@components/mantenimiento/ventas/modal-cliente-info/modal-cliente-info.component';
import { ModalClienteDireccionComponent } from '@components/mantenimiento/ventas/modal-cliente-direccion/modal-cliente-direccion.component';
import { ModalSaldosComponent } from '@components/mantenimiento/ventas/matriz-items/modal-saldos/modal-saldos.component';
import { VerificarCreditoDisponibleComponent } from '@components/mantenimiento/ventas/verificar-credito-disponible/verificar-credito-disponible.component';
import { AnticiposProformaComponent } from '@components/mantenimiento/ventas/anticipos-proforma/anticipos-proforma.component';
import { ModalEstadoPagoClienteComponent } from '@components/mantenimiento/ventas/modal-estado-pago-cliente/modal-estado-pago-cliente.component';
import { ModalSubTotalComponent } from '@components/mantenimiento/ventas/modal-sub-total/modal-sub-total.component';
import { ModalRecargosComponent } from '@components/mantenimiento/ventas/modal-recargos/modal-recargos.component';
import { ModalDesctExtrasComponent } from '@components/mantenimiento/ventas/modal-desct-extras/modal-desct-extras.component';
import { ModalIvaComponent } from '@components/mantenimiento/ventas/modal-iva/modal-iva.component';
import { ModalEtiquetaComponent } from '@components/mantenimiento/ventas/modal-etiqueta/modal-etiqueta.component';
import { ModalDesctDepositoClienteComponent } from '@components/mantenimiento/ventas/modal-desct-deposito-cliente/modal-desct-deposito-cliente.component';
import { ModalBotonesImpresionComponent } from '../../proforma/modal-botones-impresion/modal-botones-impresion.component';
import { ModalSolicitarUrgenteComponent } from '@components/mantenimiento/ventas/modal-solicitar-urgente/modal-solicitar-urgente.component';
import { ModalDetalleObserValidacionComponent } from '@components/mantenimiento/ventas/modal-detalle-obser-validacion/modal-detalle-obser-validacion.component';
import { BuscadorAvanzadoComponent } from '@components/uso-general/buscador-avanzado/buscador-avanzado.component';
import { BuscadorAvanzadoService } from '@components/uso-general/servicio-buscador-general/buscador-avanzado.service';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { ServicioTransfeAProformaService } from '../../proforma/modal-transfe-proforma/servicio-transfe-a-proforma/servicio-transfe-a-proforma.service';
import { ModalTransfeProformaComponent } from '../../proforma/modal-transfe-proforma/modal-transfe-proforma.component';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { DialogConfirmacionComponent } from '@modules/dialog-confirmacion/dialog-confirmacion.component';
import { MatSelectChange } from '@angular/material/select';
import { MatrizItemsClasicaComponent } from '@components/mantenimiento/ventas/matriz-items-clasica/matriz-items-clasica.component';
import { MatrizItemsListaComponent } from '@components/mantenimiento/ventas/matriz-items-lista/matriz-items-lista.component';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-modificar-proforma',
  templateUrl: './modificar-proforma.component.html',
  styleUrls: ['./modificar-proforma.component.scss']
})
export class ModificarProformaComponent implements OnInit, AfterViewInit {

  public nombre_ventana: string = "docmodifveproforma.vb";
  public ventana: string = "Modificar Proforma";
  public detalle = "Doc.Proforma";
  public tipo = "transaccion-docveproforma-POST";

  @HostListener("document:keydown.F4", []) unloadHandler(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      switch (elementTagName) {
        case "inputCatalogoIdTipo":
          this.modalTipoID();
          break;
        case "inputCatalogoAlmacen":
          this.modalAlmacen();
          break;
        case "inputCatalogoVendedor":
          this.modalVendedor();
          break;
        case "inputCatalogoPrecioVenta":
          this.modalPrecioVenta();
          break;
        case "inputCatalogoDesctEspecial":
          this.modalDescuentoEspecial();
          break;
        case "inputCatalogoCliente":
          this.modalClientes();
          //this.enterCliente();
          break;
        case "inputCatalogoPrecioVentaDetalle":
          this.modalPrecioVentaDetalle();
          break;
        case "inputMoneda":
          this.modalCatalogoMoneda();
          break;
        case "inputCatalogoDescuentoEspecialDetalle":
          this.modalDescuentoEspecialDetalle();
          break;
        case "inputCatalogoDireccion":
          this.modalClientesDireccion(this.codigo_cliente_catalogo);
          break;
        // case "":
        //   this.modalCatalogoProductos();
        //   break;
      }
    }
  };

  @HostListener("document:keydown.F5", []) unloadHandler2(event: Event) {
    event.preventDefault();
    this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'TECLA DESHABILITADA ⚠️ ' });
  }

  @HostListener("document:keydown.F6", []) unloadHandler3(event: Event) {
    this.modalMatrizProductos();
  }

  @HostListener("document:keydown.enter", []) unloadHandler4(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      
      switch (elementTagName) {
        case "inputCatalogoCliente":
          // this.getClientByID(this.codigo_cliente);
          this.mandarCodCliente(this.codigo_cliente);
          break;
        case "input_search":
          this.transferirProforma();
          break;
      }
    }
  };

  @HostListener("document:keydown.F9", []) unloadHandler5(event: Event) {
    event.preventDefault();
    this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'TECLA DESHABILITADA ⚠️' });
  }

  @HostListener("document:keydown.Delete", []) unloadHandler6(event: Event) {
    this.onRowSelectForDelete();
  }

  @HostListener("document:keydown.backspace", []) unloadHandler7(event: Event) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;

      switch (elementTagName) {
        case "inputCatalogoCliente":
          this.eventoBackspaceLimpiarCliente();
          break;
      }
    }
  }

  @ViewChild("cod_cliente") myInputField: ElementRef;
  @ViewChild('inputCantidad') inputCantidad: ElementRef;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChild('tabGroupfooter') tabGroup1: MatTabGroup;

  products!: ItemDetalle[];
  selectedProducts: ItemDetalle[] = [];

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';

  id_tipo_view_get_array: any = [];
  id_tipo_view_get_array_copied: any = [];
  id_tipo_view_get_first: any = [];
  id_tipo_view_get_first_codigo: any;
  id_tipo_view_get_codigo: string;
  id_proforma_numero_id: any;
  moneda_base: any;
  hay_negativos_bool: boolean;

  agencia_logueado: any;
  almacen_get: any = [];
  precio_venta_get_unico: any = [];
  precio_venta_unico_copied: any = [];
  cod_precio_venta_modal: any = [];
  cod_precio_venta_modal_first: any = [];
  cod_precio_venta_modal_codigo: number;
  tarifaPrincipal: any = []

  cod_descuento_modal: any = [];
  cod_descuento_modal_codigo: number = 0;

  cod_descuento_total: any = [];

  descuentos_get: any = [];
  descuentos_get_copied: any = [];
  descuentos_get_unico: any;

  tarifa_get_unico: any = [];
  tarifa_get_unico_copied: any = [];
  cliente: any = [];
  moneda_get: any = [];
  vendedor_get: any = [];
  tarifa_get: any = [];
  descuento_get: any = [];
  precio_venta_get: any = [];
  documento_identidad: any = [];
  empaquesItem: any = [];
  email_save: any = [];
  almacenes_saldos: any = [];
  item_tabla: any = [];
  almacn_parame_usuario: any = [];
  arr: any[] = [];
  itemTabla: any = [];
  cliente_create: any = [];

  item_seleccionados_catalogo_matriz: any = [];
  item_seleccionados_catalogo_matriz_codigo: any;
  item_seleccionados_catalogo_matriz_copied = [];
  item_seleccionados_catalogo_matriz_false: any = [];
  item_seleccionados_catalogo_matriz_sin_procesar: any = [];
  item_seleccionados_catalogo_matriz_sin_procesar_catalogo: any = [];
  array_items_carrito_y_f4_catalogo: any = [];

  id_tipo: any = [];
  usuarioLogueado: any = [];
  usuario_creado_save: any = [];
  data_almacen_local: any = [];
  desct_linea_id_tipo: any = [];
  totabilizar_post: any = [];
  tablaIva: any = [];
  ids_complementar_proforma: any = [];
  array_venta_item_23_dias: any = [];

  saldo_modal_total_1: any;
  saldo_modal_total_2: any;
  saldo_modal_total_3: any;
  saldo_modal_total_4: any;
  saldo_modal_total_5: any;

  ubicacion_central: any;
  userConn: any;
  BD_storage: any;
  orden_creciente: number = 1;
  fecha_actual_empaque: string;
  num_id: any;

  public cod_cliente_enter;
  public codigo_cliente: string;
  public nombre_cliente: string;
  public nombre_comercial_cliente: string;
  public razon_social: any;
  public nombre_comercial_razon_social: string;
  public nombre_factura: string;
  public tipo_doc_cliente: any;
  public nit_cliente: string;
  public email_cliente: string;
  public email: string;
  public whatsapp_cliente: string;
  public moneda: string;
  public moneda_get_fuction: any = [];
  public tipo_cliente: string = "";
  public parsed: string;
  public longitud_cliente: string;
  public es_contra_entrega: string;
  public latitud_cliente: string;
  public complemento_ci: string
  public cod_vendedor_cliente: string;
  public codigo_cliente_catalogo_real: string;
  public cod_id_tipo_modal: any = [];
  public venta_cliente_oficina: boolean = false;
  public cliente_habilitado_get: any;


  public transporte: any;
  public medio_transporte: any;
  public fletepor: any;
  public tipoentrega: any;
  public saldoItem: number;
  public desct_nivel_actual: any;


  public codigo_vendedor_catalogo: string;
  public direccion_cen: string;
  public direccion_central_input: string;
  public direccion: string;
  public central_ubicacion: any = [];
  public obs: string;
  public empaque_item_codigo: string;
  public empaque_item_descripcion: string;
  public cantidad: string;
  public empaque_descripcion_concat: string;
  public selected: string = "Credito";
  public tipopago: any;
  public preparacion: any;
  public complementopf: any;
  public disable_input_create: boolean;
  public isDisabled: boolean = true;
  public total_desct_precio: boolean = false;
  public anticipo_button: boolean;
  public cliente_casual: boolean;
  public total_X_PU: boolean = false;
  public disableSelect: any = new FormControl(false);
  public habilitar_desct_sgn_solicitud: boolean = false;
  public empaque_view = false;
  public submitted = false;
  public contra_entrega = false;
  public codTarifa_get: any;

  public idpf_complemento_view: any;
  public nroidpf_complemento_view: any;

  public moneda_get_catalogo: any;
  public moneda_get_array: any = [];
  public tipo_cambio_moneda_catalogo: any;

  public subtotal: number = 0.00;
  public recargos: number = 0;
  public des_extra: number = 0;
  public iva: number = 0;
  public total: number = 0.00;
  public peso: number = 0.00;

  selectTPago: string = "Credito";
  selectedCountryControl = new FormControl(this.selectTPago);

  veCliente: veCliente[] = [];
  array_ultimas_proformas: any = [];

  public codigo_cliente_catalogo: string;
  public cliente_catalogo_real: any = [];
  public nombre_cliente_catalogo_real: string;
  public vendedor_cliente_catalogo_real: string;
  public id_solicitud_desct: string;
  public numero_id_solicitud_desct: string;
  public etiqueta_get_modal_etiqueta: any[] = [];

  public codigo_item_catalogo: any = [];
  public cantidad_item_matriz: number;
  public recargos_ya_en_array_tamanio: number;
  public URL_maps: string;
  public estado_contra_entrega_input: any;

  public calcularEmpaquePorPrecio: boolean = true;
  public calcularEmpaquePorDescuento: boolean = false;

  public item_obtenido: any = [];

  public disableSelectComplemetarProforma: boolean = false;
  public item_obj_seleccionado: any;

  porcen_item: string;
  valor_nit: any;
  almacn_parame_usuario_almacen: any;

  private unsubscribe$ = new Subject<void>();
  private numberFormatter_5decimales: Intl.NumberFormat;
  private numberFormatter_2decimales: Intl.NumberFormat;

  // arraySacarTotal
  veproforma: any = [];
  veproforma1: any = [];
  veproforma_valida: any = [];
  veproforma_anticipo: any = [];
  vedesextraprof: any = [];
  verecargoprof: any = [];
  veproforma_iva: any = [];

  proforma_transferida: any = [];
  cotizacion_transferida: any = [];
  recargo_de_recargos: any = [];
  messages: any = [];
  array_de_descuentos_ya_agregados: any = [];

  valorPredeterminadoPreparacion = "NORMAL";
  valorPredeterminadoTipoPago = "CONTADO";
  selectedRowIndex: number = -1; // Inicialmente ninguna celda está seleccionada

  elementoSeleccionadoPrecioVenta: any;
  elementoSeleccionadoDescuento: any;

  monto_anticipo: any;
  id_anticipo: any;
  usuarioaut: any;
  num_idd: any;
  fecha_inicial: any;
  obs2: any
  tipo_venta: any;
  numeroidanticipo: any;

  latitud_entrega: any;
  longitud_entrega: any;

  //fechas
  pago_contado_anticipado_view: any;
  odc: any;
  fecha_confirmada: any;
  fechaaut: any;
  fecha_reg: any;

  horareg: any;
  hora: any;
  usuarioreg: any;
  horaaut: any;
  hora_confirmada: any;
  hora_inicial: any;
  //horas

  fecha_actual_server: any;
  hora_fecha_server: any;

  //VALIDACIONES
  validacion_solo_validos: any = [];
  validacion_no_validos: any = [];
  toggleValidacionesAll: boolean = false;
  toggleValidos: boolean = false;
  toggleNoValidos: boolean = false;

  // VALIDACIONES TODOS, NEGATIVOS, MAXIMO VENTA
  public validacion_post: any = [];
  public valor_formulario: any = [];
  public validacion_post_negativos: any = [];
  public validacion_post_max_ventas: any = [];

  public valor_formulario_copied_map_all: any = {};
  public valor_formulario_copied_map_all_complementar: any = {};
  public valor_formulario_negativos: any = {};
  public valor_formulario_max_venta: any = {};

  public negativos_validacion: any = [];
  public maximo_validacion: any = [];
  public tabla_anticipos: any = [];

  public tipo_complementopf_input: any;
  public complemento_proforma: any = [];

  public codigo_proforma: any;
  public descrip_confirmada: string;

  public estado_proforma: any;
  public pago_contado_anticipado: boolean = false;
  public linea2: any;

  array_original_de_validaciones_NO_VALIDAS: any = [];
  array_original_de_validaciones_NO_VALIDAS_RESUELTAS: any = [];

  array_original_de_validaciones_copied: any = [];
  array_original_de_validaciones_validadas_OK: any = [];
  array_original_de_validaciones_validadas_OK_mostrar: any = [];
  // FIN VALIDACIONES TODOS, NEGATIVOS, MAXIMO VENTA 

  fecha: any
  etiquetaProf_get: any = [];
  profEtiqueta_get: any = [];
  idanticipo: any;
  aprobada: any; //status de aprobada o no la proforma eso quiere decir si a sido grabada y aprobada
  private debounceTimer: any;

  // TABS DEL DETALLE PROFORMA
  displayedColumns = ['orden', 'item', 'descripcion', 'medida', 'unidad', 'iva', 'empaque', 'pedido',
    'cantidad', 'sld', 'tp', 'de', 'pul', 'niv', 'porcentaje', 'pd', 'pu', 'total'];

  displayedColumnsNegativos = ['kit', 'nro_partes', 'coditem_cjto', 'coditem_suelto', 'codigo',
    'descitem', 'cantidad', 'cantidad_conjunto', 'cantidad_suelta', 'saldo_sin_descontar_reservas',
    'cantidad_reservada_para_cjtos', 'saldo_descontando_reservas', 'obs'];

  displayedColumnsLimiteMaximoVentas = ['codigo', 'descripcion', 'cantidad_pf_anterior', 'cantidad', 'saldo',
    'porcen_venta', 'cod_desct_esp', 'saldo', 'porcen_maximo', 'cantidad_max_venta', 'empaque_precio', 'pasa_limite', 'obs']

  displayedColumns_validacion = ['codControl', 'descripcion', 'valido', 'cod_servicio', 'desct_servicio', 'datoA',
    'datoB', 'clave_servicio', 'resolver', 'detalle_observacion', 'validar'];
  //FIN TABS DEL DETALLE PROFORMA

  //TABS DEL FOOTER PROFORMA
  displayedColumns_ultimas_proformas = ['id', 'numero_id', 'cod_cliente', 'cliente_real',
    'nombre_cliente', 'nit', 'fecha', 'total', 'item', 'aprobada', 'transferida']

  displayedColumns_venta_23_dias = ['item', 'codproforma', 'id', 'numero_id', 'cod_cliente', 'cod_cliente_real', 'nom_cliente',
    'nit', 'fecha', 'total', 'cantidad', 'moneda', 'aprobada', 'transferida'];

  displayedColumns_precios_desct = ['codproforma', 'id', 'numero_id', 'cod_cliente', 'cod_cliente_real', 'nom_cliente',
    'nit', 'fecha', 'total', 'item', 'cantidad', 'moneda', 'aprobada'];
  //TABS DEL FOOTER PROFORMA

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  dataSource_precios_desct = new MatTableDataSource();
  dataSourceWithPageSize_precios_desct = new MatTableDataSource();

  dataSource_negativos = new MatTableDataSource();
  dataSourceWithPageSize_negativos = new MatTableDataSource();

  dataSourceLimiteMaximoVentas = new MatTableDataSource();
  dataSourceWithPageSize_LimiteMaximoVentas = new MatTableDataSource();

  dataSource_validacion = new MatTableDataSource();
  dataSourceWithPageSize_validacion = new MatTableDataSource();

  dataSourceUltimasProformas = new MatTableDataSource();
  dataSourceWithPageSize_UltimasProformas = new MatTableDataSource();

  dataSource__venta_23_dias = new MatTableDataSource();
  dataSourceWithPageSize__venta_23_dias = new MatTableDataSource();

  precio: any = true;
  desct: any = false;

  decimalPipe: any;

  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService,
    private servicioCliente: ServicioclienteService, private almacenservice: ServicioalmacenService, private cdr: ChangeDetectorRef,
    private serviciovendedor: VendedorService, private servicioPrecioVenta: ServicioprecioventaService,
    private datePipe: DatePipe, private serviciMoneda: MonedaServicioService, private subtotal_service: SubTotalService,
    private _formBuilder: FormBuilder, private servicioDesctEspecial: DescuentoService, private serviciotipoid: TipoidService,
    private messageService: MessageService, private spinner: NgxSpinnerService, private log_module: LogService, private saldoItemServices: SaldoItemMatrizService,
    private _snackBar: MatSnackBar, private servicioTransfeProformaCotizacion: ServicioTransfeAProformaService,
    private servicio_recargo_proforma: RecargoToProformaService, private servicioEtiqueta: EtiquetaService,
    private anticipo_servicio: AnticipoProformaService, public nombre_ventana_service: NombreVentanaService,
    private communicationService: ComunicacionproformaService, public servicioBuscadorAvanzado: BuscadorAvanzadoService,
    private router: Router) {

    this.decimalPipe = new DecimalPipe('en-US');
    this.FormularioData = this.createForm();

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
    this.mandarNombre();
    this.disableSelect.value = false;

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_5decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
    });

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_2decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    history.pushState(null, '', location.href); // Si se detecta navegación hacia atrás, vuelve al mismo lugar
  }

  ngOnInit() {
    history.pushState(null, '', location.href); // Coloca un estado en la historia
    this.getDesctLineaIDTipo();
    this.tipopago = 1;

    this.transporte = "FLOTA";
    this.fletepor = "CLIENTE";

    //ID TIPO
    this.serviciotipoid.disparadorDeIDTipo.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.cod_id_tipo_modal = data.id_tipo;
      this.id_tipo_view_get_codigo = this.cod_id_tipo_modal.id;

      //si se cambia el tipoID, los totales tambien se cambian
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
    });
    //

    //Almacen
    this.almacenservice.disparadorDeAlmacenes.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      //this.almacn_parame_usuario = data.almacen.codigo;

      //si se cambia de almacen, los totales tambien se cambian
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
    });
    //

    //Vendedor
    this.serviciovendedor.disparadorDeVendedores.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.cod_vendedor_cliente = data.vendedor.codigo;
      //si se cambia de vendedor, los totales tambien se cambian
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
    });
    //finvendedor

    //Clientes
    this.servicioCliente.disparadorDeClientes.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.codigo_cliente_catalogo = data.cliente.codigo;

      this.getClientByID(data.cliente.codigo);
      //si se cambia de cliente, los totales tambien se cambian
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
    });
    //

    //modalClientesParaSeleccionarClienteReal
    //aca le llega del catalogo cliente
    this.servicioCliente.disparadorDeClienteReal.pipe(takeUntil(this.unsubscribe$)).subscribe(dataCliente => {
      this.codigo_cliente_catalogo_real = dataCliente.cliente.codigo;
      this.nombre_cliente_catalogo_real = dataCliente.cliente?.nombre;
      this.cod_vendedor_cliente = dataCliente.cliente?.codvendedor;

      this.modalClientesDireccion(this.codigo_cliente_catalogo_real);
    });
    //

    //modalClientesDireccion
    this.servicioCliente.disparadorDeDireccionesClientes.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.direccion = data.direccion;
      this.latitud_cliente = data.latitud_direccion;
      this.longitud_cliente = data.longitud_direccion;

      this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'ETIQUETA LIMPIADA' })
      this.etiqueta_get_modal_etiqueta = [];
    });
    //

    // precio_venta
    this.servicioPrecioVenta.disparadorDePrecioVenta.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.cod_precio_venta_modal = data.precio_venta;
      this.cod_precio_venta_modal_codigo = data.precio_venta.codigo;

      this.total = 0.00;
      this.subtotal = 0.00;
      this.des_extra = 0.00;
    });
    // fin_precio_venta

    // descuentos
    this.servicioDesctEspecial.disparadorDeDescuentos.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.cod_descuento_modal = data.descuento;
      this.cod_descuento_modal_codigo = this.cod_descuento_modal.codigo;

      this.total = 0.00;
      this.subtotal = 0.00;
      this.des_extra = 0.00;
    });
    // findescuentos

    //Item
    this.itemservice.disparadorDeItems.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.codigo_item_catalogo = data.item;
      this.cantidad_item_matriz = data.cantidad;
    });
    //

    //Item Sin Procesar DEL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsSeleccionadosSinProcesar.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      
      this.item_seleccionados_catalogo_matriz_sin_procesar = data;
      this.totabilizar();
    });
    //

    //ACA LLEGA EL EL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsYaMapeadosAProforma.pipe(takeUntil(this.unsubscribe$)).subscribe(data_carrito => {
      if (this.array_items_carrito_y_f4_catalogo.length === 0) {
        // Si el array está vacío, simplemente agregamos los nuevos elementos
        this.array_items_carrito_y_f4_catalogo.push(...data_carrito);
      } else {
        // Si el array ya tiene elementos, concatenamos los nuevos elementos con los existentes
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.concat(data_carrito);
      }

      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 50);

      // Agregar el número de orden a los objetos de datos
      this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
        element.orden = index + 1;
        element.nroitem = index + 1;
      });
    });
    //

    //CATALOGO F4 ITEMS
    //ItemElejidoCatalogoF4Procesados
    this.itemservice.disparadorDeItemsYaMapeadosAProformaF4.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.item_seleccionados_catalogo_matriz = data;

      if (this.item_seleccionados_catalogo_matriz.length === 0) {
        this.array_items_carrito_y_f4_catalogo.push(data);
      } else {
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.concat(data);
      }

      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 50);

      // Agregar el número de orden a los objetos de datos
      this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
        element.nroitem = index + 1;
        element.orden = index + 1;
      });
    });
    //

    //ItemSinProcesarCatalogoF4
    this.itemservice.disparadorDeItemsCatalogo.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.item_seleccionados_catalogo_matriz_sin_procesar_catalogo = data;
    });
    //FIN CATALOGO F4 ITMES

    //trae el subtotal de la ventana modal subtotal
    this.subtotal_service.disparadorDeSubTotal.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.subtotal = data.subtotal;
    });
    //fin del servicio de subtotal

    //Etiqueta
    this.servicioEtiqueta.disparadorDeEtiqueta.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.etiqueta_get_modal_etiqueta = [data.etiqueta];
      this.direccion = data.etiqueta.representante;
      this.longitud_cliente = data.etiqueta.longitud_entrega;
      this.latitud_cliente = data.etiqueta.latitud_entrega;
    });
    //fin Etiqueta

    //ItemProcesarSubTotal
    this.itemservice.disparadorDeItemsSeleccionadosProcesadosdelSubTotal.subscribe(data => {

    });
    //

    // Detalle de item q se importaron de un Excel
    // En modificar Proforma no se importa desde excel xd xd xd
    // this.itemservice.disparadorDeDetalleImportarExcel.subscribe(data => {

    //   this.array_items_carrito_y_f4_catalogo = data.detalle;
    //   // Actualizar la fuente de datos del MatTableDataSource después de modificar el array
    //   this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
    //     ...element,
    //     empaque: element.empaque === null ? 0 : element.empaque,
    //   }));

    //   this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

    //   this.total = 0.00;
    //   this.subtotal = 0.00;
    //   this.recargos = 0.00;
    //   this.des_extra = 0.00;
    //   this.iva = 0.00;
    //   this.tipoentrega = "";
    // });
    //

    //modalClientesParaSeleccionarClienteReal
    //aca le llega del catalogo cliente
    this.servicioCliente.disparadorDeClienteReal.subscribe(data => {
      // this.codigo_cliente_catalogo_real = data.cliente.codigo;
      // this.nombre_cliente_catalogo_real = data.cliente.nombre;
      // this.cod_vendedor_cliente = data.cliente.codvendedor;

      // this.modalClientesDireccion(this.codigo_cliente_catalogo_real);
    });
    //

    //modalClientesParaSeleccionarClienteReal
    this.servicioCliente.disparadorDeClienteReaLInfo.subscribe(data => {
      // // this.cliente_catalogo_real = data.cliente;
      // this.direccion = data.cliente_real_info.direccion;

      // this.latitud_cliente = data.cliente_real_info.latitud;
      // this.longitud_cliente = data.cliente_real_info.longitud;
    });
    //

    //Monedas
    this.serviciMoneda.disparadorDeMonedas.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.moneda_get_catalogo = data.moneda.codigo;
      this.tipo_cambio_moneda_catalogo = data.tipo_cambio;

      //si se cambia la moneda, los totales tambien se cambian
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
      this.tipoentrega = "";
    });
    //

    //Proforma Transferida
    this.servicioTransfeProformaCotizacion.disparadorDeProformaTransferir.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.proforma_transferida = data.proforma_transferir;

      this.imprimir_proforma_tranferida(this.proforma_transferida);
    });
    //

    //Cotizacion Transferida
    this.servicioTransfeProformaCotizacion.disparadorDeCotizacionTransferir.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.cotizacion_transferida = data.cotizacion_transferir;
      this.imprimir_cotizacion_transferida(this.cotizacion_transferida);
    });
    //

    //SALDOS ITEM PIE DE PAGINA
    this.saldoItemServices.disparadorDeSaldoAlm1.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {

      this.saldo_modal_total_1 = data.saldo1;
    });

    this.saldoItemServices.disparadorDeSaldoAlm2.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.saldo_modal_total_2 = data.saldo2;
    });

    this.saldoItemServices.disparadorDeSaldoAlm3.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.saldo_modal_total_3 = data.saldo3;
    });

    this.saldoItemServices.disparadorDeSaldoAlm4.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.saldo_modal_total_4 = data.saldo4;
    });

    this.saldoItemServices.disparadorDeSaldoAlm5.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.saldo_modal_total_5 = data.saldo5;
    });
    //FIN SALDOS ITEM PIE DE PAGINA

    //disparador que trae los descuentos del ModalDesctExtrasComponent de los totales
    this.servicioDesctEspecial.disparadorDeDescuentosDelModalTotalDescuentos.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // 
      this.cod_descuento_total = data.desct_proforma;
      this.total = data.resultado_validacion.total;
      this.subtotal = data.resultado_validacion.subtotal;
      this.peso = data.resultado_validacion.peso;
      this.des_extra = data.resultado_validacion.descuento;
      // this.array_de_descuentos_ya_agregados = data.desct_proforma;

      // ESTO DEJARLO COMENTADOR POR SI ACASO
      // this.array_de_descuentos_ya_agregados = data.tabla_descuento;
      this.getNombreDeDescuentos(data.tabla_descuento);
      this.array_de_descuentos_ya_agregados = data?.tabla_descuento;
      this.totabilizar();

      //this.array_de_descuentos_ya_agregados = data.resultado_validacion.tablaDescuentos;
      // 
    });
    //finDisparador

    //RECARGOS
    this.servicio_recargo_proforma.disparadorDeRecargo_a_Proforma.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // 

      // 
      //this.recargo_de_recargos = data.recargo_array;
      this.recargos_ya_en_array_tamanio = data.recargo_array.length;
      this.total = data.resultado_validacion.total,
        this.peso = data.resultado_validacion.peso,
        this.subtotal = data.resultado_validacion.subtotal,
        this.recargos = data.resultado_validacion.recargo,
        this.recargo_de_recargos = data.resultado_validacion_tabla_recargos
    });
    //FIN DE RECARGOS

    //ventana anticipos de proforma // mat-tab Anticipo Venta
    this.anticipo_servicio.disparadorDeTablaDeAnticipos.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // 
      this.tabla_anticipos = data.anticipos;
      this.monto_anticipo = data.totalAnticipo;
      
    });
    //fin ventana anticipos de proforma // mat-tab Anticipo Venta

    //ventana modal BuscadorGeneral
    this.servicioBuscadorAvanzado.disparadorDeID_NumeroIDModificarProforma.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // 
      this.transferirProformaUltima(data.buscador_id, data.buscador_num_id)
    });
    //fin ventana modal BuscadorGeneral

    this.communicationService.triggerFunction$.subscribe(() => {
      this.aplicarDesctPorDepositoHTML();
    });
  }

  ngAfterViewInit() {
    this.getHoraFechaServidorBckEnd();
    //this.getIdTipo();
    this.getAlmacen();
    this.getAlmacenParamUsuario();
    this.getVendedorCatalogo();
    this.getTipoDescNivel();

    this.getTarifa();
    this.getDescuentos();
    this.getAllmoneda();

    this.getTipoDocumentoIdentidadProforma();
    this.getDescuento();
    this.tablaInicializada();
    this.getIDScomplementarProforma();

    this.getUltimaProformaGuardada();
  }

  getHoraFechaServidorBckEnd() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          // 

          this.fecha_actual_server = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");;
          this.hora_fecha_server = datav.horaServidor;

          // 
        },

        error: (err: any) => {
          
        },
        complete: () => {
        }
      })
  }

  onCheckboxChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement.checked;
    

    if (isChecked === true) {
      this.estado_contra_entrega_input = "POR CANCELAR";
      this.contra_entrega = true;
    } else {
      this.estado_contra_entrega_input = '';
      this.contra_entrega = false;
    }
  }

  onInputChangeTIPOPAGO(event: MatSelectChange) {
    if (event.value === 1) {
      this.contra_entrega = false;
      this.estado_contra_entrega_input = "";
    } else {
      this.contra_entrega = true;
      this.estado_contra_entrega_input = "POR CANCELAR";
    }
  }

  onNoClick(event: Event): void {
    event.preventDefault();
  }

  tablaInicializada() {
    this.orden_creciente = 0;
    this.item_seleccionados_catalogo_matriz_false = Array(35).fill({}).map(() => ({
      coditem: " ",
      descripcion: " ",
      medida: " ",
      udm: " ",
      porceniva: undefined,
      cantidad_pedida: undefined,
      cantidad: undefined,
      porcen_mercaderia: undefined,
      codtarifa: undefined,
      coddescuento: undefined,
      preciolista: undefined,
      niveldesc: " ",
      porcendesc: undefined,
      preciodesc: undefined,
      precioneto: undefined,
      total: undefined,
      cumple: false,
      nroitem: undefined,
      porcentaje: undefined,
      monto_descto: undefined,
      subtotal_descto_extra: undefined
    }));

    this.dataSource = new MatTableDataSource(this.item_seleccionados_catalogo_matriz_false);
    // let validacion = [{
    //   codControl: '',
    //   descripcion: '',
    //   valido: '',
    //   cod_servicio: '',
    //   desct_servicio: '',
    //   datoA: '',
    //   datoB: '',
    //   clave_servicio: '',
    //   resolver: '',
    //   detalle_observacion: '',
    //   validar: '',
    // }]

    // this.dataSource_validacion = new MatTableDataSource(validacion);
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.dataform.id, Validators.compose([Validators.required])],
      numeroid: [this.dataform.numeroid, Validators.compose([Validators.required])],
      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
      codcliente: [this.dataform.codcliente, Validators.compose([Validators.required])],
      nomcliente: [this.razon_social, Validators.compose([Validators.required])],
      nit: [this.dataform.nit, Validators.compose([Validators.required])],
      codvendedor: [this.dataform.codvendedor, Validators.compose([Validators.required])],
      codmoneda: [this.dataform.codmoneda, Validators.compose([Validators.required])],
      //precio venta columna segunda primera fila verificar conq nombre se guarda
      preciovta: [this.dataform.preciovta, Validators.compose([Validators.required])],
      descuentos: [this.des_extra],
      tipopago: [this.dataform.tipopago === 0 ? 0 : 1, Validators.required],
      transporte: [this.dataform.transporte === "FLOTA", Validators.required],
      nombre_transporte: [this.dataform.nombre_transporte, Validators.compose([Validators.required])],
      tipo_docid: [this.dataform.tipo_docid],
      preparacion: [this.dataform.preparacion, Validators.compose([Validators.required])],
      tipoentrega: [this.dataform.tipoentrega === undefined ? "ENTREGAR" : this.dataform.tipoentrega, Validators.compose([Validators.required])],
      fletepor: [this.dataform.fletepor === "CLIENTE", Validators.compose([Validators.required])],

      tdc: [this.dataform.tdc],
      anulada: [false],
      aprobada: [false],
      paraaprobar: [false],
      transferida: [false],

      usuarioaut: [this.usuarioaut],
      confirmada: [false],
      impresa: [false],
      etiqueta_impresa: [false],
      es_sol_urgente: [false],
      tipo_doc_cliente: this.dataform.tipo_docid,

      obs: this.dataform.obs === null ? " " : this.dataform.obs,
      obs2: [this.obs2],
      direccion: [this.dataform.direccion],
      peso: Number(this.peso),
      codcliente_real: this.codigo_cliente,
      latitud_entrega: [this.dataform.latitud_entrega === undefined ? this.dataform.latitud : this.dataform.latitud],
      longitud_entrega: [this.dataform.longitud_entrega === undefined ? this.dataform.longitud : this.dataform.longitud],
      ubicacion: [this.dataform.ubicacion === null ? 'LOCAL' : this.dataform.ubicacion],
      email: [this.dataform.email],
      tipo_cliente: [this.dataform.tipo_cliente],
      celular: this.dataform.celular,

      venta_cliente_oficina: this.dataform.venta_cliente_oficina === undefined ? false : true,
      tipo_venta: [this.tipo_venta],

      contra_entrega: this.contra_entrega,
      estado_contra_entrega: [this.dataform.estado_contra_entrega === undefined ? "" : this.dataform.estado_contra_entrega],

      odc: this.odc === undefined ? "" : this.odc,
      desclinea_segun_solicitud: [this.dataform.desclinea_segun_solicitud === undefined ? 0 : this.dataform.desclinea_segun_solicitud], //Descuentos de Linea de Solicitud

      idanticipo: [this.id_anticipo], // anticipo VentasL
      numeroidanticipo: [this.numeroidanticipo], // anticipo Ventas
      pago_contado_anticipado: [this.dataform.pago_contado_anticipado === null ? false : this.dataform.pago_contado_anticipado], //anticipo Ventas checkbox
      complemento_ci: [this.dataform.complemento_ci === undefined ? "" : this.dataform.complemento_ci],
      codcomplementaria: [this.dataform.codcomplementaria === null ? 0 : 0], //aca es para complemento de proforma //ACA REVIS

      idsoldesctos: this.idpf_complemento_view, // Descuentos de Linea de Solicitud, esto ya no se utiliza enviar valor 0
      nroidsoldesctos: [0], // Descuentos de Linea de Solicitud, ya no se usa a fecha mayo/2024

      //complementar input
      idpf_complemento: this.dataform.idpf_complemento === undefined ? " " : this.dataform.idpf_complemento, //aca es para complemento de proforma
      nroidpf_complemento: this.dataform.nroidpf_complemento === undefined ? 0 : this.dataform.nroidpf_complemento,
      tipo_complementopf: [this.dataform.tipo_complementopf], //aca es para complemento de proforma
      monto_anticipo: [0], //anticipo Ventas
      niveles_descuento: [this.dataform.niveles_descuento === undefined ? 'ACTUAL' : this.dataform.niveles_descuento], //niveles de descuento

      // no hay mas en esta seccion xD
      subtotal: [this.dataform.subtotal], //TOTALES
      recargos: [this.dataform.recargos], //TOTALES
      //des_extra: [this.dataform.des_extra], //TOTALES
      iva: [this.dataform.iva], //TOTALES
      total: [this.dataform.total], //TOTALES
      porceniva: [0],

      //estas fechas se quedan tal como llegan al traer la proforma
      fecha: this.dataform.fecha,
      fecha_confirmada: this.dataform.fecha_confirmada,
      fechaaut: this.dataform.fechaaut,
      fecha_inicial: this.dataform.fecha_inicial,
      horareg: this.dataform.horareg,
      hora: this.dataform.hora,
      horaaut: this.dataform.horaaut,
      hora_inicial: this.dataform.hora_inicial,
      hora_confirmada: this.dataform.hora_confirmada,

      //estas fechas se cambian por la hora del server mas el usuario actual
      usuarioreg: this.usuarioLogueado,
      fechareg: this.dataform.fecha_actual_server,
    });
  }

  itemDataAll(codigo) {
    this.getSaldoEmpaquePesoAlmacenLocal(codigo);
    this.getEmpaqueItem(codigo);
    this.getSaldoItemSeleccionadoDetalle(codigo);
    this.getAlmacenesSaldos();
    this.getSaldoItem(codigo);
    this.getPorcentajeVentaItem(codigo);

    this.saldo_modal_total_1 = "";
    this.saldo_modal_total_2 = "";
    this.saldo_modal_total_3 = "";
    this.saldo_modal_total_4 = "";
    this.saldo_modal_total_5 = "";
  }

  mandarEntregar() {
    this.valor_formulario = [this.FormularioData.value];
    // 

    this.submitted = true;
    this.valor_formulario.map((element: any) => {
      this.valor_formulario_copied_map_all = {
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString(),
        codcliente: element.codcliente?.toString() || '',
        nombcliente: element.nombcliente?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente_real?.toString() || '',
        nomcliente_real: element.nomcliente_real?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        subtotaldoc: element.subtotal,
        totaldoc: element.total,
        tipo_vta: element.tipopago?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        preparacion: this.preparacion?.toString() || '',
        contra_entrega: element.contra_entrega?.toString(),
        vta_cliente_en_oficina: element.venta_cliente_oficina,
        estado_contra_entrega: element.estado_contra_entrega,
        desclinea_segun_solicitud: element.desclinea_segun_solicitud,
        pago_con_anticipo: element.pago_contado_anticipado === null ? false : element.pago_contado_anticipado,
        niveles_descuento: element.niveles_descuento,
        transporte: element.transporte,
        nombre_transporte: element.nombre_transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: "",
        direccion: element.direccion,
        ubicacion: element.ubicacion,
        latitud: element.latitud_entrega,
        longitud: element.longitud_entrega,
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        tipo_complemento: element.tipo_complementopf?.toString() || '',
        fechadoc: element.fecha,
        idanticipo: element.idanticipo === null ? "" : element.idanticipo,
        noridanticipo: element.numeroidanticipo?.toString() || '',
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
        tipo_cliente: this.tipo_cliente,
        codtarifadefecto: this.codTarifa_get?.toString(),
        idpf_complemento: element.idpf_complemento === undefined ? "" : element.idpf_complemento,
        nroidpf_complemento: element.nroidpf_complemento?.toString(),
        fechalimite_dosificacion: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),

        // esto siempre vacio y ceo porq ya no se usa 13-12-2024
        idsol_nivel: "",
        nroidsol_nivel: "0",
        // esto siempre tiene valor del inpur de descuentos Especiales 13-12-2024
        desctoespecial: this.cod_descuento_modal?.toString(),
        totrecargos: this.recargos,


        monto_anticipo: 0,
        nrofactura: "0",
        nroticket: "",
        tipo_caja: "",
        nroautorizacion: "",
        nrocaja: "",
        version_codcontrol: "",
        estado_doc_vta: "EDITAR",
        idFC_complementaria: "",
        nroidFC_complementaria: "",
        idpf_solurgente: "0",
        noridpf_solurgente: "0",
      }
    });

    if (this.preparacion === undefined) {
      this.preparacion = "NORMAL";
    } else {
      this.preparacion;
    }

    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
      ...element,
      cumple: element.cumple === 1 ? true : false,
    }));

    let proforma_validar = {
      datosDocVta: this.valor_formulario_copied_map_all,
      detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
      preparacion: this.preparacion,
    }
    // 
    // 

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/get_entrega_pedido/"
    return this.api.create('/venta/transac/veproforma/get_entrega_pedido/' + this.userConn + "/" + this.BD_storage, proforma_validar)
      .subscribe({
        next: (datav) => {
          this.tipoentrega = datav.mensaje;
          
        },

        error: (err: any) => {
          
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Formulario T. Entrega Error' });
        },
        complete: () => { }
      });
  }

  get f() {
    return this.FormularioData.controls;
  }

  getUltimaProformaGuardada() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/modif/docmodifveproforma/getUltiProfId/";
    return this.api.getAll('/venta/modif/docmodifveproforma/getUltiProfId/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          
          this.transferirProformaUltima(datav.id, datav.numeroid);
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  transferirProformaUltima(id, numero_id) {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/modif/docmodifveproforma/obtProfxModif/";

    return this.api.getAll('/venta/modif/docmodifveproforma/obtProfxModif/' + this.userConn + "/" + id + "/" + numero_id + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          // 
          this.imprimir_proforma_tranferida(datav);
          //this.getUbicacionCliente(datav.cabecera.codcliente, datav.cabecera.direccion);
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! TRANSFERENCIA EN PROGESO ! ⚙️' })
          this.spinner.show();

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        error: (err: any) => {
          
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! TRANSFERENCIA FALLO ! ❌' });
        },
        complete: () => {
        }
      })
  }

  transferirProforma() {
    

    this.spinner.show()
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/modif/docmodifveproforma/obtProfxModif/";

    return this.api.getAll('/venta/modif/docmodifveproforma/obtProfxModif/' + this.userConn + "/" + this.num_idd + "/" + this.num_id + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {

          this.imprimir_proforma_tranferida(datav);
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! TRANSFERENCIA EXITOSA ! ' })
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        error: (err: any) => {
          
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! TRANSFERENCIA FALLO ! ❌' });
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      })
  }

  getParametrosIniciales() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/principal/getParamIniciales/";
    return this.api.getAll('/principal/getParamIniciales/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.agencia_logueado = datav.codAlmacenUsr;
          this.BD_storage = datav.codempresa;

          
        },
        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  imprimir_proforma_tranferida(proforma) {
    

    if (proforma.cabecera.nroidpf_complemento > 0) {
      this.disableSelectComplemetarProforma = true;
    }

    this.etiquetaProf_get = proforma.etiquetaProf;
    this.profEtiqueta_get = proforma.profEtiqueta;

    // 
    // 

    if (this.profEtiqueta_get?.length > 0) {
      // LA DATA DE LA ETIQUETA SE SACA DE etiquetaProf
      // 
      // this.etiqueta_get_modal_etiqueta = proforma.profEtiqueta;
      this.codigo_cliente_catalogo_real = proforma.etiquetaProf[0].codcliente_real;
      this.direccion = proforma.etiquetaProf[0].direccion;
      this.latitud_cliente = proforma.etiquetaProf[0].latitud_entrega;
      this.longitud_cliente = proforma.etiquetaProf[0].longitud_entrega;
      this.nombre_cliente_catalogo_real = proforma.etiquetaProf[0].linea1;
    }

    //this.codigo_cliente_catalogo_real = proforma.profEtiqueta[0]?.codcliente_real

    if (this.etiquetaProf_get?.length === 0 && this.profEtiqueta_get?.length === 0) {
      this.etiqueta_get_modal_etiqueta = proforma.etiquetaProf;
      this.codigo_cliente_catalogo_real = proforma.cabecera.codcliente_real;
      this.nombre_cliente_catalogo_real = proforma.cabecera.nomcliente;
      this.latitud_cliente = proforma.cabecera.latitud_entrega;
      this.longitud_cliente = proforma.cabecera.longitud_entrega;
    }

    if (this.etiquetaProf_get?.length > 0) {
      this.etiqueta_get_modal_etiqueta = proforma.etiquetaProf;
      this.codigo_cliente_catalogo_real = proforma.cabecera.codcliente_real;
      this.nombre_cliente_catalogo_real = proforma.cabecera.nomcliente;
      this.latitud_cliente = proforma.cabecera.latitud_entrega;
      this.longitud_cliente = proforma.cabecera.longitud_entrega;
    }

    if (this.profEtiqueta_get?.length === 1 && this.etiquetaProf_get?.length === 1) {
      // CUANDO ES CASUAL SE SACA DE profEtiqueta
      // 
      // this.etiqueta_get_modal_etiqueta = proforma.profEtiqueta;
      this.codigo_cliente_catalogo_real = proforma.profEtiqueta[0].codcliente_real;
      this.direccion = proforma.profEtiqueta[0].direccion;
      this.latitud_cliente = proforma.profEtiqueta[0].latitud_entrega;
      this.longitud_cliente = proforma.profEtiqueta[0].longitud_entrega;
      this.nombre_cliente_catalogo_real = proforma.etiquetaProf[0].linea1
    }

    // 

    if (proforma.anticiposTot != 0) {
      this.anticipo_button = true;
    }

    this.idanticipo = proforma.cabecera.idanticipo
    //COMPLEMENTAR PROFORMA
    // SI HAY DATA EN nroidpf_complemento ES DECIR QUE ESTA COMPLEMENTADA ENTONCES TIENE Q LLAMAR A LA FUNCION Q COMPLEMENT
    this.email_cliente = proforma.cabecera.email;
    this.pago_contado_anticipado = proforma.cabecera.pago_contado_anticipado;
    this.codigo_proforma = proforma.cabecera.codigo;
    this.aprobada = proforma.cabecera.aprobada
    this.descrip_confirmada = proforma.descConfirmada;
    this.estado_proforma = proforma.estadodoc;
    this.cliente_habilitado_get = proforma.habilitado;

    this.id_tipo_view_get_codigo = proforma.cabecera.id;
    this.id_proforma_numero_id = proforma.cabecera.numeroid.toString();

    //fechas
    this.fecha = this.datePipe.transform(proforma.cabecera.fecha, "yyyy-MM-dd");
    this.fecha_inicial = this.datePipe.transform(proforma.cabecera.fecha_inicial, "yyyy-MM-dd");
    this.fecha_confirmada = this.datePipe.transform(proforma.cabecera.fecha_confirmada, "yyyy-MM-dd");
    this.fechaaut = this.datePipe.transform(proforma.cabecera.fechaaut, "yyyy-MM-dd");
    this.fecha_reg = this.datePipe.transform(proforma.cabecera.fechareg, "yyyy-MM-dd");

    this.hora_inicial = proforma.cabecera.hora_inicial;
    this.horareg = proforma.cabecera.horareg;
    this.hora = proforma.cabecera.hora;
    // this.usuarioreg = proforma.cabecera.usuarioreg;
    this.horaaut = proforma.cabecera.horaaut;
    this.hora_confirmada = proforma.cabecera.hora_confirmada;
    //fin-fecha

    //cliente real
    //this.codigo_cliente = proforma.cabecera.codcliente_real;
    //this.cliente_casual = proforma.cabecera.casual;
    //de aca sacamos si es casual
    //fin cliente real

    this.id_anticipo = proforma.cabecera.idanticipo;
    this.usuarioaut = proforma.cabecera.usuarioaut;
    this.contra_entrega = proforma.cabecera.contra_entrega;
    this.almacn_parame_usuario = proforma.cabecera.codalmacen;
    this.venta_cliente_oficina = proforma.cabecera.venta_cliente_oficina;
    this.codigo_cliente = proforma.cabecera.codcliente;
    this.nombre_cliente = proforma.cabecera.nomcliente;
    this.nombre_comercial_cliente = proforma.cabecera.nombre_comercial;
    this.nombre_factura = proforma.cabecera.nombre_fact;
    this.razon_social = proforma.cabecera.nomcliente;
    this.complemento_ci = proforma.cabecera.complemento_ci;
    this.nombre_comercial_razon_social = proforma.cabecera.nomcliente;
    this.tipo_doc_cliente = proforma.cabecera.tipo_docid;
    this.nit_cliente = proforma.cabecera.nit;
    this.email_cliente = proforma.cabecera.email;

    this.moneda_get_catalogo = proforma.cabecera.codmoneda;
    this.tipopago = proforma.cabecera.tipopago;
    this.tipo_cliente = proforma.tipo_cliente;

    this.transporte = proforma.cabecera.transporte;
    this.medio_transporte = proforma.cabecera.nombre_transporte;
    this.fletepor = proforma.cabecera.fletepor;
    this.tipoentrega = proforma.cabecera.tipoentrega;
    this.peso = proforma.cabecera.peso;

    this.cod_vendedor_cliente = proforma.cabecera.codvendedor;
    this.venta_cliente_oficina = proforma.cabecera.venta_cliente_oficina;
    this.direccion = proforma.cabecera.direccion;
    this.whatsapp_cliente = proforma.cabecera.celular;
    this.latitud_cliente = proforma.cabecera.latitud_entrega;
    this.longitud_cliente = proforma.cabecera.longitud_entrega;
    this.central_ubicacion = proforma.cabecera.central;
    this.obs = proforma.cabecera.obs;
    this.odc = proforma.cabecera.odc === undefined ? "" : proforma.cabecera.odc;
    this.desct_nivel_actual = proforma.cabecera.niveles_descuento;
    this.whatsapp_cliente = proforma?.etiquetaProf?.length ? proforma.etiquetaProf[0].celular : null;
    this.linea2 = proforma?.etiquetaProf[0]?.linea2,

      this.ubicacion_central = proforma.cabecera.ubicacion;
    this.preparacion = proforma.cabecera.preparacion;

    this.subtotal = proforma.cabecera.subtotal;
    this.recargos = proforma.cabecera.recargos;
    this.des_extra = proforma.cabecera.descuentos;
    this.iva = proforma.cabecera.iva;
    this.total = proforma.cabecera.total;

    this.veproforma1 = proforma.detalle;
    this.array_de_descuentos_ya_agregados = proforma.descuentos;
    //this.cod_descuento_total = proforma.descuentos;
    //la cabecera asignada a this.veproforma para totalizar y grabar
    this.veproforma = proforma.cabecera;

    //el cuerpo del detalle asignado al carrito
    this.array_items_carrito_y_f4_catalogo = proforma.detalle.sort((a, b) => {
      if (a.coditem > b.coditem) {
        return 1;  // Orden ascendente
      } else if (a.coditem < b.coditem) {
        return -1; // Orden descendente
      } else {
        return 0;  // Igualdad
      }
    });

    //la etiqueta se almacena el valor de proforma.etiquetaProf siempre y cuando profEtiqueta este vacio
    //en caso de profEtiqueta tenga data esa data se guarda aca
    this.recargo_de_recargos = proforma.recargos;
    this.valor_formulario_copied_map_all = proforma.cabecera;

    //tabla de anticipos
    this.tabla_anticipos = proforma.anticipos;
    this.monto_anticipo = proforma.anticiposTot;

    //complementar proforma
    this.idpf_complemento_view = proforma.cabecera.idpf_complemento;
    this.nroidpf_complemento_view = proforma.cabecera.nroidpf_complemento;
    this.tipo_complementopf_input = proforma.cabecera.tipo_complementopf === 0 ? 3 : proforma.cabecera.tipo_complementopf;

    // if (this.disableSelectComplemetarProforma === true) {
    //   this.buscadorIDComplementarProforma(proforma.cabecera.idpf_complemento, proforma.cabecera.nroidpf_complemento);
    // }
    //fin complementar proforma

    this.estado_contra_entrega_input = proforma.cabecera.estado_contra_entrega;

    //aca se pintan las validaciones en su tabla
    // this.validacion_post = proforma.detalleValida.map((element) => ({
    //   codServicio: element.codservicio.toString(),
    //   accion: element.accion,
    //   claveServicio: element.clave_servicio,
    //   codControl: element.codcontrol,
    //   codProforma: element.codproforma,
    //   datoA: element.datoa,
    //   datoB: element.datob,
    //   descGrabar: element.desc_grabar,
    //   descripcion: element.descripcion,
    //   descServicio: element.descservicio,
    //   descuentos: element.descuentos,
    //   grabar: element.grabar,
    //   grabarAprobar: element.grabar_aprobar,
    //   nit: element.nit,
    //   nroItems: element.nroitems,
    //   obsDetalle: element.obsdetalle,
    //   observacion: element.observacion,
    //   orden: element.orden,
    //   recargos: element.recargos,
    //   subtotal: element.subtotal,
    //   total: element.total,
    //   valido: element.valido,
    //   // estos valores no me llegan y me piden para enviar asi q lo pongo en vacio y en string porq asi pide el modelo
    //   contra_Entrega:"",
    //   descGrabarAprobar:"",
    //   preparacion:"",
    //   tipoVenta:"",
    // }));

    // VACIO PARA QUE LE OBLIGUE A VALIDAR NUEVAMENTE
    this.validacion_post = [];
    this.dataSource_validacion = new MatTableDataSource(this.validacion_post);

    this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.latitud_cliente + "%2C" + this.longitud_cliente;
    this.getClientByIDCasual(proforma.cabecera?.codcliente, proforma.cabecera?.direccion);
    this.getNombreDeDescuentos(this.array_de_descuentos_ya_agregados);



    //colocar orden al detalle de la proforma
    this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
      element.orden = index + 1;
      element.nroitem = index + 1;
    });

  }

  // getIdTipo() {
  //   let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/mant/venumeracion/catalogoNumProfxUsuario/";
  //   return this.api.getAll('/venta/mant/venumeracion/catalogoNumProfxUsuario/' + this.userConn + "/" + this.usuarioLogueado)
  //     .subscribe({
  //       next: (datav) => {
  //         this.id_tipo_view_get_array = datav;
  //         // 

  //         this.id_tipo_view_get_array_copied = this.id_tipo_view_get_array.slice();
  //         this.id_tipo_view_get_first = this.id_tipo_view_get_array_copied.shift();

  //         this.id_tipo_view_get_codigo = this.id_tipo_view_get_first.id;
  //         // 

  //         this.getIdTipoNumeracion(this.id_tipo_view_get_codigo);
  //       },

  //       error: (err: any) => {
  //         
  //       },
  //       complete: () => { }
  //     })
  // }

  // getIdTipoNumeracion(id_tipo) {
  //   let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getNumActProd/";
  //   return this.api.getAll('/venta/transac/veproforma/getNumActProd/' + this.userConn + "/" + id_tipo)
  //     .subscribe({
  //       next: (datav) => {
  //         this.id_proforma_numero_id = datav;
  //         // 
  //       },
  //       error: (err: any) => {
  //         
  //       },
  //       complete: () => { }
  //     })
  // }

  // onLeaveIDTipo(event: any) {
  //   // 
  //   const inputValue = event.target.value;

  //   let cadena = inputValue.toString();
  //   // 
  //   // Verificar si el valor ingresado está presente en los objetos del array
  //   const encontrado = this.id_tipo_view_get_array.some(objeto => objeto.id === cadena.toUpperCase());

  //   if (!encontrado) {
  //     // Si el valor no está en el array, dejar el campo vacío
  //     event.target.value = '';
  //     
  //   } else {
  //     event.target.value = cadena;
  //     this.getIdTipoNumeracion(cadena);
  //   }
  // }

  abrirTabPorLabel(label: string) {
    //abre tab por el id de su etiqueta, muy buena funcion xD
    const tabs = this.tabGroup._tabs.toArray(); // Obtener todas las pestañas del mat-tab-group
    const index = tabs.findIndex(tab => tab.textLabel === label); // Encontrar el índice del mat-tab con el label dado
    if (index !== -1) {
      this.tabGroup.selectedIndex = index; // Establecer el índice seleccionado del mat-tab-group
    }
  }

  abrirTabPorLabelFooter(label: string) {
    //abre tab por el id de su etiqueta, muy buena funcion xD
    const tabs = this.tabGroup1._tabs.toArray(); // Obtener todas las pestañas del mat-tab-group
    const index = tabs.findIndex(tab => tab.textLabel === label); // Encontrar el índice del mat-tab con el label dado
    if (index !== -1) {
      this.tabGroup1.selectedIndex = index; // Establecer el índice seleccionado del mat-tab-group
    }
  }

  getAlmacen() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/mant/inalmacen/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.almacen_get = datav;
          // 
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getAlmacenParamUsuario() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/adusparametros/getInfoUserAdus/";
    return this.api.getAll('/seg_adm/mant/adusparametros/getInfoUserAdus/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.almacn_parame_usuario = datav;
          // 

          this.almacn_parame_usuario_almacen = datav.codalmacen;
          this.cod_precio_venta_modal_codigo = this.almacn_parame_usuario.codtarifa;
          this.cod_descuento_modal_codigo = this.almacn_parame_usuario.coddescuento;
        },
        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  onLeaveAlmacen(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.almacen_get.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      // 
    } else {
      event.target.value = entero;
    }
  }

  getVendedorCatalogo() {
    let a
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/vevendedor/catalogo/";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.vendedor_get = datav;
          a = this.vendedor_get.shift();
          this.cod_vendedor_cliente = a.codigo;
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  onLeaveVendedor(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.vendedor_get.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      
    } else {
      event.target.value = entero;
    }
  }

  getTarifa() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET /inventario/mant/intarifa/catalogo/";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.tarifa_get_unico = datav;
          this.tarifa_get_unico_copied = this.tarifa_get_unico.slice();
          this.cod_precio_venta_modal_first = this.tarifa_get_unico_copied.shift();
          // this.cod_precio_venta_modal_codigo = this.cod_precio_venta_modal_first.codigo

          // 
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  aplicarPrecioVenta(value) {
    this.item_seleccionados_catalogo_matriz_copied = this.array_items_carrito_y_f4_catalogo.slice();
    

    this.array_items_carrito_y_f4_catalogo = this.item_seleccionados_catalogo_matriz_copied.map(item => {
      return { ...item, codtarifa: value, total: 0 };
    });

    
    this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

    this.total_desct_precio = true;
    this.total = 0;
    this.subtotal = 0;

    const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: "¿ DESEA TOTALIZAR LOS ITEM DE LA PROFORMA?, ESTA ACCION PUEDE TOMAR UN TIEMPO" },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        // 
        this.totabilizar();
      } else {
        // 
      }
    });
  }

  aplicarDesctEspc(value) {
    this.item_seleccionados_catalogo_matriz_copied = this.array_items_carrito_y_f4_catalogo.slice();
    // ", value);

    this.array_items_carrito_y_f4_catalogo = this.item_seleccionados_catalogo_matriz_copied.map(item => {
      return { ...item, coddescuento: value, total: 0 };
    });

    

    this.total_desct_precio = true;
    this.total = 0.00;
    this.subtotal = 0.00;

    const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '150px',
      height: 'auto',
      data: { mensaje_dialog: "¿ DESEA TOTALIZAR LOS ITEM DE LA PROFORMA ?, ESTA ACCION PUEDE TOMAR UN TIEMPO" },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        // 
        this.totabilizar();
      } else {
        // 
      }
    });
  }

  setEmailDefault() {
    this.email_cliente = "facturasventas@pertec.com.bo";
  }

  getClientByID(codigo) {
    
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/mant/vecliente/";
    return this.api.getAll('/venta/mant/vecliente/' + this.userConn + "/" + codigo)
      .subscribe({
        next: (datav) => {
          this.cliente = datav;
          

          this.codigo_cliente = this.cliente.cliente.codigo;
          this.codigo_cliente_catalogo_real = this.cliente.cliente.codigo;
          this.nombre_comercial_cliente = this.cliente.cliente.nombre_comercial.trim();
          this.nombre_factura = this.cliente.cliente.nombre_fact.trim();
          this.razon_social = this.cliente.cliente.razonsocial.trim();
          this.complemento_ci = this.cliente.cliente.complemento_ci
          this.nombre_comercial_razon_social = this.nombre_comercial_cliente.trim();
          this.tipo_doc_cliente = this.cliente.cliente.tipo_docid;
          this.nit_cliente = this.cliente.cliente.nit_fact;
          this.email_cliente = this.cliente.vivienda.email;
          this.cliente_casual = this.cliente.cliente.casual;
          this.cliente_habilitado_get = this.cliente.cliente.habilitado;
          this.nombre_cliente_catalogo_real = this.cliente.cliente.razonsocial.trim();

          this.cod_vendedor_cliente = this.cliente.cliente.codvendedor;
          this.moneda = this.cliente.cliente.moneda;
          this.venta_cliente_oficina = this.cliente.cliente.venta_cliente_oficina;
          this.tipo_cliente = this.cliente.cliente.tipo;

          // this.direccion = this.cliente.vivienda.direccion;
          this.whatsapp_cliente = this.cliente.vivienda.celular;
          this.latitud_cliente = this.cliente.vivienda.latitud;
          this.longitud_cliente = this.cliente.vivienda.longitud;
          this.central_ubicacion = this.cliente.vivienda.central;

          this.etiqueta_get_modal_etiqueta = [];
        },

        error: (err: any) => {
          
        },
        complete: () => {
          this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.latitud_cliente + "%2C" + this.longitud_cliente;
          // this.getUbicacionCliente(this.codigo_cliente_catalogo, this.cliente.vivienda?.direccion);
        }
      })
  }

  getClientByIDCasual(codigo, direccion) {
    // 
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/mant/vecliente/";
    return this.api.getAll('/venta/mant/vecliente/' + this.userConn + "/" + codigo)
      .subscribe({
        next: (datav) => {
          this.cliente_casual = datav.cliente.casual;
          // 
        },

        error: (err: any) => {
          
        },
        complete: () => {
          this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.latitud_cliente + "%2C" + this.longitud_cliente;
          this.getUbicacionCliente(codigo, direccion);
        }
      })
  }

  getUbicacionCliente(cod_cliente, direccion) {
    let dirclient = {
      codcliente: cod_cliente,
      dircliente: direccion,
    }
    // 

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getUbicacionCliente/"
    return this.api.create('/venta/transac/veproforma/getUbicacionCliente/' + this.userConn, dirclient)
      .subscribe({
        next: (datav) => {
          // this.central_ubicacion = datav;
          // this.ubicacion_central = datav.ubi
          // 
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  mandarCodCliente(cod_cliente) {
    this.total = 0.00;
    this.subtotal = 0.00;
    this.servicioCliente.disparadorDeClientes.emit({
      cliente: { codigo: cod_cliente }
    });
  }

  getAllmoneda() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/admoneda/";
    return this.api.getAll('/seg_adm/mant/admoneda/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda_get_fuction = datav;
          // 
          const encontrado = this.moneda_get_fuction.some((moneda) => moneda.codigo === 'BS');

          if (encontrado) {
            // 
            this.moneda_get_catalogo = "BS";
            // 
            this.getMonedaTipoCambio(this.moneda_get_catalogo);
          }
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getDesctLineaIDTipo() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET --/vetiposoldsctos/catalogo/";
    return this.api.getAll('/vetiposoldsctos/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.desct_linea_id_tipo = datav;
          // 
        },

        error: (err: any) => {
          
        },
        complete: () => {

        }
      })
  }

  getMonedaTipoCambio(moneda) {
    let fechareg = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/mant/adtipocambio/getmonedaValor/";
    return this.api.getAll('/seg_adm/mant/adtipocambio/getmonedaValor/' + this.userConn + "/" + this.moneda_base + "/" + moneda + "/" + fechareg)
      .subscribe({
        next: (datav) => {
          this.tipo_cambio_moneda_catalogo = datav;
          // 
          this.tipo_cambio_moneda_catalogo = this.tipo_cambio_moneda_catalogo.valor;
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getTipoDocumentoIdentidadProforma() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTipoDocIdent/";
    return this.api.getAll('/venta/transac/veproforma/getTipoDocIdent/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.documento_identidad = datav;
          // 
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getPrecio() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/mant/intarifa/catalogo/";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.descuento_get = datav;
          // 
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getDescuento() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/vedescuento/catalogo/";
    return this.api.getAll('/venta/mant/vedescuento/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.descuento_get = datav;
          // 
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getDireccionCentral(cod_usuario) {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/vetienda/getCentral/";
    return this.api.getAll('/venta/mant/vetienda/getCentral/' + this.userConn + "/" + cod_usuario)
      .subscribe({
        next: (datav) => {
          // 
          this.direccion = datav.direccion;
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getAlmacenesSaldos() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getCodAlmSlds/";
    return this.api.getAll('/venta/transac/veproforma/getCodAlmSlds/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.almacenes_saldos = datav;
          // 
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getSaldoEmpaquePesoAlmacenLocal(item) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inmatriz/pesoEmpaqueSaldo/";
    return this.api.getAll('/inventario/mant/inmatriz/pesoEmpaqueSaldo/' + this.userConn + "/" + this.cod_precio_venta_modal_codigo + "/" + this.cod_descuento_modal_codigo + "/" + item + "/" + this.agencia_logueado + "/" + this.BD_storage)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.data_almacen_local = datav;
          // 
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getSaldoItem(item) {
    let agencia_concat = "AG" + this.almacn_parame_usuario_almacen;
    let array_send = {
      agencia: agencia_concat,
      codalmacen: this.almacn_parame_usuario_almacen,
      coditem: item,
      codempresa: this.BD_storage,
      usuario: this.usuarioLogueado,

      idProforma: this.id_tipo_view_get_codigo?.toString() === undefined ? " " : this.id_tipo_view_get_codigo?.toString(),
      nroIdProforma: this.id_proforma_numero_id
    };

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.create('/venta/transac/veproforma/getsaldoDetalleSP/' + this.userConn, array_send)
      .subscribe({
        next: (datav) => {
          // 
          this.saldoItem = datav.totalSaldo;
        },

        error: (err: any) => {
          

        },
        complete: () => { }
      })
  }

  getEmpaqueItem(item) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getempaques/";
    return this.api.getAll('/venta/transac/veproforma/getempaques/' + this.userConn + "/" + item)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
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

  getPorcentajeVentaItem(item) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/mant/inmatriz/infoItemRes/";
    return this.api.getAll('/inventario/mant/inmatriz/infoItemRes/' + this.userConn + "/" + this.agencia_logueado + "/" + item + "/" +
      this.cod_precio_venta_modal_codigo + "/" + this.cod_descuento_modal_codigo + "/" + this.codigo_cliente_catalogo_real)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          // 
          this.item_obtenido = datav;
          this.porcen_item = this.item_obtenido.porcen_maximo;
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getDescuentos() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET --/venta/mant/vedescuento/catalogo/";
    return this.api.getAll('/venta/mant/vedescuento/catalogo/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.descuentos_get = datav;
          //this.cod_descuento_modal_codigo = 0;
        },
        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  guardarCorreo() {
    let ventana = "proforma-edit"
    let detalle = "proforma-actualizoEmail";
    let tipo_transaccion = "transacc-proforma-PUT";

    let data = {
      codcliente: this.codigo_cliente,
      email: this.email_cliente
    };

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta: -/venta/transac/veproforma/actualizarCorreoCliente/ --Update";
    return this.api.update('/venta/transac/veproforma/actualizarCorreoCliente/' + this.userConn, data)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.log_module.guardarLog(ventana, detalle, tipo_transaccion, "", "");
          this.email_save = datav;
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '!CORREO GUARDADO! 📧' })
          this._snackBar.open('!CORREO GUARDADO!', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          });
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }


  selectRow(index: number) {
    this.selectedRowIndex = index;
  }

  onEditComplete(event: any) {
    const updatedElement = event.data; // La fila editada
    const updatedField = event.field; // El campo editado (en este caso, "empaque")

    
    

    if (updatedField === 'empaque') {
      this.empaqueChangeMatrix(this.item_obj_seleccionado, updatedElement);
    }

    if (updatedField === 'cantidad_pedida') {
      this.copiarValorCantidadPedidaACantidad(this.item_obj_seleccionado, updatedElement);
    }

    if (updatedField === 'cantidad') {
      this.cantidadChangeMatrix(this.item_obj_seleccionado, updatedElement)
    }
  }

  copiarValorCantidadPedidaACantidad(product: any, newValue: number) {
    product.cantidad = Number(product.cantidad_pedida);

    
    this.total = 0.00;
    this.subtotal = 0.00;
    this.iva = 0.00;
    this.des_extra = 0.00;
    this.recargos = 0.00;

    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";

    this.total_desct_precio = false;
    this.total_X_PU = true;

    this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
      + this.usuarioLogueado + "/" + product.coditem + "/" + product.codtarifa + "/" + product.coddescuento + "/" + product.cantidad +
      "/" + newValue + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          //this.almacenes_saldos = datav;
          
          // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
          product.coddescuento = Number(datav.coddescuento);
          product.preciolista = Number(datav.preciolista);
          product.preciodesc = Number(datav.preciodesc);
          product.precioneto = Number(datav.precioneto);
          product.porcen_mercaderia = Number(datav.porcen_mercaderia).toFixed(2);
          product.total = Number(datav.total);

          product.cantidad = Number(product.cantidad_pedida);
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      });
  }

  empaqueChangeMatrix(product: any, newValue: number) {
    
    // Evitar valores nulos o inválidos
    const nuevoEmpaque = Number(product.empaque) || 0;
    // Preparar el tipo de precio o descuento
    const d_tipo_precio_desct = this.precio ? "Precio" : "Descuento";
    // Asegurar un empaque válido
    product.empaque = nuevoEmpaque;
    if (nuevoEmpaque === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: '! EMPAQUE 0! NO CALCULA' });
    } else {
      // Llamada a la API para obtener nuevos datos
      this.api
        .getAll(`/venta/transac/veproforma/getCantItemsbyEmp/${this.userConn}/${d_tipo_precio_desct}/${this.cod_precio_venta_modal_codigo}/${product.coditem}/${nuevoEmpaque}`)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (datav) => {
            

            // Actualizar valores directamente en el objeto del producto
            product.empaque = nuevoEmpaque
            product.cantidad = Number(datav.total);
            product.cantidad_pedida = Number(datav.total);
            product.coddescuento = Number(datav.coddescuento);
            product.preciolista = Number(datav.preciolista);
            product.preciodesc = Number(datav.preciodesc);
            product.precioneto = Number(datav.precioneto);
            //product.porcen_mercaderia = Number(datav.porcen_mercaderia).toFixed(2);
            product.porcen_mercaderia = Number(datav.porcen_mercaderia);
            product.total = Number(datav.total);
          },
          error: (err) => {
            console.error("Error al consultar la API:", err);
          },
        });
    }
  }

  cantidadChangeMatrix(elemento: any, newValue: number) {
    
    this.total = 0.00;
    this.subtotal = 0.00;
    this.iva = 0.00;
    this.des_extra = 0.00;
    this.recargos = 0.00;

    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";

    this.total_desct_precio = false;
    this.total_X_PU = true;

    this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
      + this.usuarioLogueado + "/" + elemento.coditem + "/" + elemento.codtarifa + "/" + elemento.coddescuento + "/" + elemento.cantidad +
      "/" + newValue + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          //this.almacenes_saldos = datav;
          
          // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
          elemento.coddescuento = Number(datav.coddescuento);
          elemento.preciolista = Number(datav.preciolista);
          elemento.preciodesc = Number(datav.preciodesc);
          elemento.precioneto = Number(datav.precioneto);
          elemento.porcen_mercaderia = Number(datav.porcen_mercaderia);
          elemento.total = Number(datav.total);
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      });
  }








  // onInputChangecantidadChangeMatrix(products: any, value: any) {
  //   let valor_input = value;
  //   if(value === '' || value === undefined){
  //     valor_input=0;
  //     products.cantidad = 0;
  //   };

  //   clearTimeout(this.debounceTimer);
  //   this.debounceTimer = setTimeout(() => {
  //     this.cantidadChangeMatrix(products, value);
  //   }, 500); // 300 ms de retardo
  // }

  // onInputChange(products: any, value: any) {
  //   clearTimeout(this.debounceTimer);
  //   this.debounceTimer = setTimeout(() => {
  //     this.pedidoChangeMatrix(products, value);
  //   }, 1250); // 300 ms de retardo    
  // }

  pedidoChangeMatrix(element: any, newValue: number) {
    element.cantidad = element.cantidad_pedida;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";
    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    this.total_desct_precio = true;

    this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
      + this.usuarioLogueado + "/" + element.coditem + "/" + element.codtarifa + "/" + element.coddescuento + "/" + element.cantidad_pedida +
      "/" + element.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          //this.almacenes_saldos = datav;
          // 
          // Actualizar la coddescuento en el element correspondiente en tu array de datos
          element.coddescuento = Number(datav.coddescuento);
          element.preciolista = Number(datav.preciolista);
          element.preciodesc = Number(datav.preciodesc);
          element.precioneto = Number(datav.precioneto);
          element.porcen_mercaderia = Number(datav.porcen_mercaderia);

          this.total = 0.00;
          this.subtotal = 0.00;
          this.iva = 0.00;
          this.des_extra = 0.00;
          this.recargos = 0.00;
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      });
  }

  // PRECIO VENTA DETALLE
  TPChangeMatrix(element: any, newValue: number) {
    
    // Actualizar la codtarifa en el elemento correspondiente en tu array de datos
    // Esto se ejecutará inmediatamente, pero se sobrescribirá cuando se reciba el nuevo valor del servicio
    element.codtarifa = Number(newValue);
    // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
    // 
    // this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;
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

  onLeavePrecioVentaDetalle(event: any, elemento) {
    // YA NO SE USA
    
    this.elementoSeleccionadoPrecioVenta = elemento;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";

    const inputValue = event.target.value;
    let entero = Number(this.elementoSeleccionadoPrecioVenta.codtarifa);
    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.tarifa_get_unico.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = 0;
      
    } else {
      event.target.value = entero;

      // 
      this.elementoSeleccionadoDescuento = elemento;

      this.servicioPrecioVenta.disparadorDePrecioVentaDetalle.subscribe(data => {
        // 
        this.elementoSeleccionadoPrecioVenta.codtarifa = data.precio_venta.codigo;

        this.total = 0;
        this.subtotal = 0;
        this.iva = 0
        this.des_extra = 0;
        this.recargos = 0;
      });

      //"api/venta/transac/veproforma/getItemMatriz_Anadir/DPD2_Loc_PE/PE/DPD2/35CH1H14/1/301/100/100/300800/0/311/FALSE/BS/2024-04-23"
      this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
        + this.usuarioLogueado + "/" + elemento.coditem + "/" + elemento.codtarifa + "/" + elemento.coddescuento + "/" + elemento.cantidad_pedida +
        "/" + elemento.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
        .pipe(takeUntil(this.unsubscribe$)).subscribe({
          next: (datav) => {
            // 
            // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
            elemento.preciolista = Number(datav.preciolista);
            elemento.preciodesc = Number(datav.preciodesc);
            elemento.precioneto = Number(datav.precioneto);

          },

          error: (err: any) => {
            
          },
          complete: () => {
            //this.simularTab();
          }
        });

    }
  }

  // Función que se llama cuando se hace clic en el input
  inputClickedPrecioVenta(elemento: any) {
    // Aquí puedes hacer lo que necesites con el elemento
    
    this.elementoSeleccionadoPrecioVenta = elemento;

    this.servicioPrecioVenta.disparadorDePrecioVentaDetalle.subscribe(data => {
      
      this.elementoSeleccionadoPrecioVenta.codtarifa = data.precio_venta.codigo;
    });
  }
  // FIN PRECIO VENTA DETALLE

  // DESCUENTO ESPECIAL DETALLE
  DEChangeMatrix(element: any, newValue: number) {
    // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
    element.coddescuento = Number(newValue);
    // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
    
    //this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;
  }

  onLeaveDescuentoEspecial(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.descuentos_get.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = 0;
      
    } else {
      event.target.value = entero;
    }
  }

  onLeaveDescuentoEspecialDetalle(event: any, element) {
    

    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";

    //desde aca verifica que lo q se ingreso al input sea data que existe en el array de descuentos descuentos_get
    let entero = Number(this.elementoSeleccionadoDescuento.coddescuento);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.descuentos_get.some(objeto => objeto.codigo === entero);
    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = 0;
      
      this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
        + this.usuarioLogueado + "/" + element.coditem + "/" + element.codtarifa + "/" + "0" + "/" + element.cantidad_pedida +
        "/" + element.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
        .pipe(takeUntil(this.unsubscribe$)).subscribe({
          next: (datav) => {
            //this.almacenes_saldos = datav;
            // 
            // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
            element.preciolista = Number(datav.preciolista);
            element.preciodesc = Number(datav.preciodesc);
            element.precioneto = Number(datav.precioneto);
            // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
            

            //this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;
          },

          error: (err: any) => {
            
          },
          complete: () => { }
        });
    } else {
      event.target.value = entero;

      // 
      this.elementoSeleccionadoDescuento = element;

      this.servicioDesctEspecial.disparadorDeDescuentosDetalle.subscribe(data => {
        
        this.elementoSeleccionadoDescuento.coddescuento = data.descuento.codigo;

        this.total = 0;
        this.subtotal = 0;
        this.iva = 0
        this.des_extra = 0;
        this.recargos = 0;
      });

      //"api/venta/transac/veproforma/getItemMatriz_Anadir/DPD2_Loc_PE/PE/DPD2/35CH1H14/1/301/100/100/300800/0/311/FALSE/BS/2024-04-23"
      this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
        + this.usuarioLogueado + "/" + element.coditem + "/" + element.codtarifa + "/" + element.coddescuento + "/" + element.cantidad_pedida +
        "/" + element.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
        .subscribe({
          next: (datav) => {
            //this.almacenes_saldos = datav;
            
            // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
            element.preciolista = Number(datav.preciolista);
            element.preciodesc = Number(datav.preciodesc);
            element.precioneto = Number(datav.precioneto);
            // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
            

            //this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;
            //this.simularTab();
          },

          error: (err: any) => {
            
            //this.simularTab();
          },
          complete: () => {
            //this.simularTab();
          }
        });
    }
  }

  inputClickedDescuento(elemento: any) {
    // Aquí puedes hacer lo que necesites con el elemento
    // 
    this.elementoSeleccionadoDescuento = elemento;

    this.servicioDesctEspecial.disparadorDeDescuentosDetalle.subscribe(data => {
      // 
      this.elementoSeleccionadoDescuento.coddescuento = data.descuento.codigo;
    });
  }
  //FIN DESCUENTO ESPECIAL DETALLE





  recalcularPedidoXPU(cantidad, precioneto) {
    
  }

  calcularTotalCantidadXPU(cantidad_pedida: number, cantidad: number, precioneto: number) {
    // todo despues del if ya que si no siempre esta escuchando los eventos
    if (cantidad_pedida !== undefined && precioneto !== undefined && cantidad !== undefined) {
      if (this.total_X_PU === true) {
        return this.formatNumberTotalSub(cantidad * precioneto);
      } else {
        // 
        let cantidadPedida = cantidad_pedida;
        // Realizar cálculos solo si los valores no son undefined
        
        return this.formatNumberTotalSub(cantidad * precioneto);
      }
    } else {
      return 0; // O algún otro valor predeterminado
    }
  }

  calcularTotalPedidoXPU(newValue: number, preciolista: number) {
    // todo despues del if ya que si no siempre esta escuchando los eventos
    if (newValue !== undefined && preciolista !== undefined) {
      // 
      let pedido = newValue;
      // Realizar cálculos solo si los valores no son undefined
      
      return pedido * preciolista;
    } else {
      return 0; // O algún otro valor predeterminado
    }
  }

  obtenerCantidadParaPedido(cantidad) {
    
    return cantidad;
  }

  enabledPagoFormaAnticipada(val, pago_contado_anticipado) {
    if (this.anticipo_button === val) {
      this.anticipo_button = false;
      this.monto_anticipo = 0;
      this.tabla_anticipos = [];
    } else {
      this.anticipo_button = true;
    }
  }

  definirClienteReferencia(codcliente) {
    

    // if (this.cliente_casual) {
    const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: "El código del Cliente: " + codcliente + " no es casual, por tanto no puede vincular con otro cliente, ¿ Esta seguro de continuar ?" },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        this.modalClientesparaReferencia();
      } else {
        //si es casual entra aca
        this.modalClientesparaReferencia();
      }
    });
    // }
  }

  imprimir_cotizacion_transferida(cotizacion) {
    
    this.id_tipo_view_get_codigo = cotizacion.cabecera.id;
    this.id_proforma_numero_id = cotizacion.cabecera.numeroid.toString();
    this.fecha_actual = cotizacion.cabecera.fecha;
    this.almacn_parame_usuario = cotizacion.cabecera.codalmacen;
    this.codigo_cliente = cotizacion.cabecera.codcliente;
    this.nombre_comercial_razon_social = cotizacion.cabecera.nomcliente;
    this.nit_cliente = cotizacion.cabecera.nit;
    this.cod_vendedor_cliente = cotizacion.cabecera.codvendedor;
    this.moneda_get_catalogo = cotizacion.cabecera.codmoneda;
    this.tipo_cambio_moneda_catalogo = cotizacion.cabecera.tdc;
    this.tipopago = cotizacion.cabecera.tipopago;
    this.preparacion = cotizacion.cabecera.preparacion;
    this.fecha_actual = cotizacion.cabecera.fecha;
    this.subtotal = cotizacion.cabecera.subtotal;
    this.recargos = cotizacion.cabecera.recargos;
    this.des_extra = cotizacion.cabecera.descuentos;
    this.iva = cotizacion.cabecera.iva;
    this.total = cotizacion.cabecera.total;

    this.direccion = cotizacion.cabecera.direccion;
    this.obs = cotizacion.cabecera.obs;
    this.transporte = cotizacion.cabecera.transporte;
    this.medio_transporte = cotizacion.cabecera.nombre_transporte;
    this.fletepor = cotizacion.cabecera.fletepor;
    this.habilitar_desct_sgn_solicitud = cotizacion.cabecera.desclinea_segun_solicitud;

    this.item_seleccionados_catalogo_matriz = cotizacion.detalle;

    this.array_items_carrito_y_f4_catalogo = cotizacion.detalle;
    this.dataSource = new MatTableDataSource(cotizacion.detalle);
  }

  imprimir_zip_importado(zip_json) {
    

    this.id_tipo_view_get_codigo = zip_json.cabeceraList[0].id;
    this.id_proforma_numero_id = zip_json.cabeceraList[0].numeroid.toString();
    this.fecha_actual = this.fecha_actual;
    this.almacn_parame_usuario = zip_json.cabeceraList[0].codalmacen;
    this.venta_cliente_oficina = zip_json.cabeceraList[0].venta_cliente_oficina;
    this.codigo_cliente = zip_json.cabeceraList[0].codcliente;
    this.nombre_cliente = zip_json.cabeceraList[0].nomcliente;
    this.nombre_comercial_cliente = zip_json.cabeceraList[0].nombre_comercial;
    this.nombre_factura = zip_json.cabeceraList[0].nombre_fact;
    this.razon_social = zip_json.cabeceraList[0].nomcliente;
    this.complemento_ci = zip_json.cabeceraList[0].complemento_ci;
    this.nombre_comercial_razon_social = zip_json.cabeceraList[0].nomcliente;
    this.tipo_doc_cliente = zip_json.cabeceraList[0].tipo_docid;
    this.nit_cliente = zip_json.cabeceraList[0].nit;
    this.email_cliente = zip_json.cabeceraList[0].email;
    this.cliente_casual = zip_json.cabeceraList[0].casual;
    this.moneda_get_catalogo = zip_json.cabeceraList[0].codmoneda;
    this.codigo_cliente = zip_json.cabeceraList[0].codcliente_real;
    this.tipopago = zip_json.cabeceraList[0].tipopago;
    this.tipo_cliente = zip_json.clienteList[0].tipo;

    this.transporte = zip_json.cabeceraList[0].transporte;
    this.medio_transporte = zip_json.cabeceraList[0].nombre_transporte;
    this.fletepor = zip_json.cabeceraList[0].fletepor;
    this.tipoentrega = zip_json.cabeceraList[0].tipoentrega;
    this.peso = zip_json.cabeceraList[0].peso;
    this.codigo_cliente_catalogo_real = zip_json.cabeceraList[0].codcliente_real

    this.cod_vendedor_cliente = zip_json.cabeceraList[0].codvendedor;
    this.venta_cliente_oficina = zip_json.cabeceraList[0].venta_cliente_oficina;
    this.tipo_cliente = zip_json.cabeceraList[0].tipo === undefined ? " " : " ";
    this.direccion = zip_json.cabeceraList[0].direccion;
    this.whatsapp_cliente = zip_json.cabeceraList[0].celular;
    this.latitud_cliente = zip_json.cabeceraList[0].latitud_entrega;
    this.longitud_cliente = zip_json.cabeceraList[0].longitud_entrega;
    this.central_ubicacion = zip_json.cabeceraList[0].central;
    this.obs = zip_json.cabeceraList[0].obs;
    this.desct_nivel_actual = zip_json.cabeceraList[0].niveles_descuento;
    this.whatsapp_cliente = "0";

    this.ubicacion_central = zip_json.cabeceraList[0].ubicacion;
    this.preparacion = zip_json.cabeceraList[0].preparacion;

    this.subtotal = zip_json.cabeceraList[0].subtotal;
    this.recargo_de_recargos = zip_json.recargoList;
    this.array_de_descuentos_ya_agregados = zip_json.descuentoList;
    this.veproforma_iva = zip_json.ivaList;
    this.total = zip_json.cabeceraList[0].total;


    this.item_seleccionados_catalogo_matriz = zip_json.detalleList[0];
    this.veproforma1 = zip_json.detalleList[0];

    // //la cabecera asignada a this.veproforma para totalizar y grabar
    this.veproforma = zip_json.cabeceraList[0]
    // //el cuerpo del detalle asignado al carrito
    this.array_items_carrito_y_f4_catalogo = zip_json.detalleList;

    this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.latitud_cliente + "%2C" + this.longitud_cliente;

    // //this.dataSource = new MatTableDataSource(proforma.detalle);
    // // se dibuja los items al detalle de la proforma
    this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
  }

  buscadorIDComplementarProforma(complemento_id, complemento_numero_id) {
    
    let b = this.id_proforma_numero_id.toString();
    // 

    if (this.disableSelectComplemetarProforma === false) {
      this.complementopf = 0;
    } else {
      this.complementopf = 1;
    }

    this.valor_formulario = [this.FormularioData.value];

    this.valor_formulario.map((element: any) => {
      this.valor_formulario_copied_map_all_complementar = {
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString() || '',
        codcliente: element.codcliente?.toString() || '',
        nombcliente: element.nombcliente?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente_real?.toString() || '',
        nomcliente_real: element.nomcliente_real?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        subtotaldoc: element.subtotal,
        totaldoc: element.total,
        tipo_vta: element.tipopago?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        preparacion: this.preparacion?.toString() || '',
        contra_entrega: element.contra_entrega,
        vta_cliente_en_oficina: element.venta_cliente_oficina,
        estado_contra_entrega: this.estado_contra_entrega_input === undefined ? " " : this.estado_contra_entrega_input,
        desclinea_segun_solicitud: element.desclinea_segun_solicitud,
        pago_con_anticipo: element.pago_contado_anticipado === null ? false : element.pago_contado_anticipado,
        niveles_descuento: element.niveles_descuento,
        transporte: element.transporte,
        nombre_transporte: element.nombre_transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: "",
        direccion: element.direccion,
        ubicacion: element.ubicacion,
        latitud: element.latitud_entrega,
        longitud: element.longitud_entrega,
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        fechadoc: element.fecha,
        idanticipo: element.idanticipo === null ? "" : element.idanticip,
        noridanticipo: element.numeroidanticipo?.toString() || '',
        tipo_cliente: this.tipo_cliente,
        codtarifadefecto: this.codTarifa_get?.toString(),
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
        fechalimite_dosificacion: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),


        // esto siempre vacio y ceo porq ya no se usa 13-12-2024
        idsol_nivel: "",
        nroidsol_nivel: "0",
        // esto siempre tiene valor del inpur de descuentos Especiales 13-12-2024
        desctoespecial: this.cod_descuento_modal?.toString(),
        totrecargos: this.recargos,


        monto_anticipo: 0,
        nrofactura: "0",
        nroticket: "",
        tipo_caja: "",
        nroautorizacion: "",
        nrocaja: "",
        version_codcontrol: "",
        estado_doc_vta: "EDITAR",
        idFC_complementaria: "",
        nroidFC_complementaria: "",
        idpf_solurgente: "0",
        noridpf_solurgente: "0",

        nroidpf_complemento: element.nroidpf_complemento?.toString(),
        tipo_complemento: element.tipo_complementopf?.toString(),
        idpf_complemento: this.idpf_complemento_view,
      }
    });

    let proforma_validar = {
      datosDocVta: this.valor_formulario_copied_map_all_complementar,
      detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
      preparacion: this.preparacion,
    }

    if (this.total === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'TOTALICE ANTES DE COMPLEMENTAR' });
      setTimeout(() => {
        this.spinner.hide();
      }, 50);
      return;
    }

    return this.api.create("/venta/transac/veproforma/recuperarPfComplemento/" + this.userConn + "/" + complemento_id + "/" +
      complemento_numero_id + "/" + this.tipo_complementopf_input + "/" + this.BD_storage, proforma_validar)
      .subscribe({
        next: (datav) => {
          // 
          this.complemento_proforma = datav;

          if (datav.value === false) {
            this.modalDetalleObservaciones(datav.resp, datav.detalle);
            // this.complementopf = false;
            this.disableSelectComplemetarProforma = false;
            this.tipo_complementopf_input = 3;
            this.idpf_complemento_view = "";
            this.nroidpf_complemento_view = "";

          } else {
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'PROFORMA COMPLEMENTADA CON EXITO ✅' })
          }

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err) => {
          
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! OCURRIO UN PROBLEMA AL COMPLEMENTAR FAVOR REVISAR CON SISTEMAS !' });
          // this.complementopf = false;
          this.disableSelectComplemetarProforma = false;
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => { }
      })
  }

  getSaldoItemSeleccionadoDetalle(item) {
    
    // 
    let agencia = this.agencia_logueado;
    this.item_seleccionados_catalogo_matriz_codigo = item;

    let agencia_concat = "AG" + this.agencia_logueado;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll
      ('/venta/transac/veproforma/getsaldosCompleto/' + this.userConn + "/" + agencia_concat + "/" + this.agencia_logueado + "/" + item + "/" + this.BD_storage + "/" + this.usuarioLogueado)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.id_tipo = datav;
          // 
          // this.letraSaldos = this.id_tipo[0].resp;
          // this.saldo_variable = this.id_tipo[2];

          // this.dataSource = new MatTableDataSource(this.id_tipo[1]);
          // this.dataSource.paginator = this.paginator;
          // this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

          // // LETRA
          // this.id_tipo[1].forEach(element => {
          //   if (element.descripcion === 'Total Saldo') {
          //     this.saldoLocal = element.valor;
          //   }
          // });
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getIDScomplementarProforma() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + 2)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.ids_complementar_proforma = datav;
          // 
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  // MODAL DE CONFIRMACION, PARA Q NO APAREZCAN TODOS DE GOLPE SI NO UNO POR UNO
  openConfirmationDialog(message: string): Promise<boolean> {
    //btn si/no
    const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: message },
      disableClose: true,
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  openConfirmationOKDialog(message: string): Promise<boolean> {
    //btn ok
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: message },
      disableClose: true,
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  //accion de btn grabar
  async submitDataModificarProforma() {
    let tamanio_array_etiqueta = this.etiqueta_get_modal_etiqueta.length;
    let tamanio_array_validaciones = this.validacion_post.length;
    let total_proforma_concat: any = [];

    this.totabilizar();

    const transformedArray = this.validacion_post.map((validaciones) => ({
      ...validaciones,
      codservicio: parseInt(validaciones.codServicio),
      clave_servicio: validaciones.claveServicio,
      codproforma: this.codigo_proforma,
      nroitems: parseInt(validaciones.nroItems) || 0,
      subtotal: parseFloat(validaciones.subtotal) || 0,
      descuentos: parseFloat(validaciones.descuentos) || 0,
      recargos: parseFloat(validaciones.recargos) || 0,
    }));

    this.submitted = true;
    let data = this.FormularioData.value;
    data = {
      ...data,
      codigo: this.codigo_proforma,
      codcliente_real: this.codigo_cliente,
      descuentos: this.des_extra,
      idpf_complemento: this.idpf_complemento_view === undefined ? " " : this.idpf_complemento_view, // complemento de complementar proforma
      nroidpf_complemento: this.nroidpf_complemento_view === undefined ? 0 : this.nroidpf_complemento_view, // complemento de complementar proforma
      tipo_complementopf: this.tipo_complementopf_input === undefined ? 3 : this.tipo_complementopf_input,
      tipo_venta: this.tipopago,
      idanticipo: "",
      idsoldesctos: "",
      numeroidanticipo: 0,
      obs2: "",
      usuarioaut: "",
      usuarioreg: this.usuarioLogueado,
      tipo_docid: this.tipo_doc_cliente
    };
    

    //se aumenta el array tabladescuentos y el array tablarecargos al array de validaciones
    let form_validacion = this.valor_formulario_copied_map_all;
    form_validacion = {
      ...form_validacion,
      estado_doc_vta: "EDITAR",
      numeroid: this.id_proforma_numero_id?.toString(),
      codalmacen: this.almacn_parame_usuario_almacen?.toString(),
      codvendedor: this.cod_vendedor_cliente?.toString(),
      contra_entrega: this.contra_entrega?.toString(),
      nroidpf_complemento: this.nroidpf_complemento_view?.toString() || '',
      latitud: this.latitud_cliente?.toString(),
      longitud: this.longitud_cliente?.toString(),
      cliente_habilitado: this.cliente_habilitado_get?.toString(),
      desctoespecial: this.cod_descuento_modal_codigo?.toString() || '',
      nitfactura: this.nit_cliente?.toString(),
      nombcliente: this.razon_social?.toString(),
      nomcliente_real: this.codigo_cliente_catalogo_real?.toString(),
      idsol_nivel: "0",
      nroidsol_nivel: "0",
      preciovta: this.cod_precio_venta_modal_codigo?.toString(),
      tipo_cliente: this.tipo_cliente.toString(),
      tipo_doc_id: this.tipo_doc_cliente?.toString(),
      tipo_vta: this.tipopago.toString(),
      tipo_complementopf: this.tipo_complementopf_input,
    };

    this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados?.map((element) => ({
      ...element,
      descrip: element.descripcion,
    }));

    //array carrito de compras
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((item) => ({
      ...item,
      cantaut: item.cantidad,
      totalaut: item.total,
      obs: item.obs,
      nroitem: item.nroitem,
      id: 0,
    }));

    total_proforma_concat = {
      veproforma: data,
      veproforma1: this.array_items_carrito_y_f4_catalogo,
      veproforma_valida: transformedArray,
      dt_anticipo_pf: this.tabla_anticipos,
      vedesextraprof: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados, // array de desct extra del totalizador
      verecargoprof: this.recargo_de_recargos, //array de recargos,
      veetiqueta_proforma: this.etiqueta_get_modal_etiqueta[0], // array de etiqueta
      veproforma_iva: this.veproforma_iva, //array de iva
      dvta: form_validacion, // aca el array de validacion mapeado con mas info xdxd  this.valor_formulario_copied_map_all;
      detalleAnticipos: this.tabla_anticipos,
      tabladescuentos: this.array_de_descuentos_ya_agregados,
      tablarecargos: this.recargo_de_recargos,
    };

    
    

    if (!this.FormularioData.valid) {
      this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'REVISE FORMULARIO' });
      
      setTimeout(() => {
        this.spinner.hide();
      }, 50);
    }

    if (tamanio_array_etiqueta === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡ FALTA GRABAR ETIQUETA !' });
      setTimeout(() => {
        this.spinner.hide();
      }, 50);
      return;
    }

    if (tamanio_array_validaciones === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡ FALTA VALIDAR, VALIDE PORFAVOR !' });
      setTimeout(() => {
        this.spinner.hide();
      }, 50);
      return;
    } else {
      setTimeout(() => {
        this.spinner.hide();
      }, 50);
    }

    if (this.total === 0.00) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'EL TOTAL NO PUEDE SER 0, PARA GRABAR PROFORMA' });
      setTimeout(() => {
        this.spinner.hide();
      }, 50);
      return;
    }

    if (this.api.statusInternet === false) {
      this.dialog.open(DialogConfirmActualizarComponent, {
        width: '450px',
        height: 'auto',
        data: { mensaje_dialog: "¿No tienes conexion a internet ⚠️, esta proforma se exportara en un excel, para que posteriormente continues dando curso al pedido?" },
        disableClose: true,
      });
    }

    let array_validacion_existe_aun_no_validos = this.validacion_post.filter(element => element.valido === "NO");
    let array_negativos_aun_existe = this.validacion_post_negativos.filter(element => element.obs === 'Genera Negativo');
    let array_negativos_aun_existe_tamanio = array_negativos_aun_existe.length;
    let array_validacion_existe_aun_no_validos_tamanio = array_validacion_existe_aun_no_validos.length;

    // Asegúrate de que las variables estén definidas antes de aplicar el filtro
    if (this.validacion_post && this.validacion_post_negativos) {
      try {
        if (array_validacion_existe_aun_no_validos_tamanio > 0) {
          const result = await this.openConfirmationDialog(`La Proforma ${this.id_tipo_view_get_codigo}-${this.id_proforma_numero_id} tiene validaciones las cuales tienen que ser revisadas. ¿Esta seguro de grabar la proforma?`);
          if (!result) {
            setTimeout(() => {
              this.spinner.hide();
            }, 50);
            return;
          }
        }

        if (array_negativos_aun_existe_tamanio > 0) {
          const result = await this.openConfirmationDialog(`La Proforma ${this.id_tipo_view_get_codigo}-${this.id_proforma_numero_id} genera saldos negativos. ¿Esta seguro de grabar la proforma?`);
          if (!result) {
            setTimeout(() => {
              this.spinner.hide();
            }, 500);
            return;
          }
        }

        const result = await this.openConfirmationDialog(`La Proforma ${this.id_tipo_view_get_codigo}-${this.id_proforma_numero_id} no esta confirmada. ¿Desea Confirmarla?`);
        if (result) {
          data = {
            ...data,
            confirmada: true,
          };
        }

      } catch (error) {
        console.error('Error al realizar las validaciones:', error);
      }
    }

    if (array_negativos_aun_existe_tamanio > 0) {
      this.hay_negativos_bool = true;
    } else {
      this.hay_negativos_bool = false;
    }

    
    const url = `/venta/modif/docmodifveproforma/guardarProforma/${this.userConn}/${this.codigo_proforma}/${this.BD_storage}/false/${this.codigo_cliente_catalogo_real}/${this.hay_negativos_bool}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;
    this.api.create(url, total_proforma_concat).subscribe({
      next: (datav) => {
        this.spinner.show();
        this.totabilizar_post = datav;
        // 
        this.log_module.guardarLog(this.ventana, "GRABAR" + this.totabilizar_post.codProf, "POST", this.id_tipo_view_get_codigo, this.id_proforma_numero_id);

        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      error: (err) => {
        
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO SE GRABO, OCURRIO UN PROBLEMA AL GRABAR ! ' });
        //this.detalleProformaCarritoTOExcel();
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      complete: () => {
        //aca exporta a ZIP
        const dialogRefZIP = this.dialog.open(DialogConfirmActualizarComponent, {
          width: '450px',
          height: 'auto',
          data: {
            mensaje_dialog: "Se Grabo La Proforma" + this.id_tipo_view_get_codigo + "-" + this.id_proforma_numero_id + " con Exito. ¿Desea Exportar el Documento? "
          },
          disableClose: true,
        });

        dialogRefZIP.afterClosed().subscribe((result: Boolean) => {
          if (result) {
            // this.exportProformaZIP(this.totabilizar_post.codProf);
            // aca manda a imprimir la proforma guardada
            this.modalBtnImpresiones(false);
          } else {
            //aca manda a imprimir la proforma guardada
            this.modalBtnImpresiones(false);
          }
        });

        this.guardarDataImpresion(this.totabilizar_post.codProf, false);
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      }
    });
  }

  // grabarYAprobar
  validarAntesDeGrabarAprobar() {
    

    let dataValidar = {
      id: this.id_tipo_view_get_codigo,
      numeroid: this.id_proforma_numero_id,
      tipopago: this.tipopago === 0 ? "CONTADO" : "CREDITO",
      contra_entrega: this.contra_entrega,
      codmoneda: this.moneda_get_catalogo,
      fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
      total: this.total,
      cantidad_anticipos: this.tabla_anticipos.length,
    }

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/modif/docmodifveproforma/anularProforma/";
    return this.api.create(`/venta/transac/veproforma/ValidarParaAprobarMayor50000/${this.userConn}/${this.BD_storage}/${this.usuarioLogueado}`, dataValidar)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: async (datav) => {
          
          if (datav.pedir_clave) {
            const result = await this.openConfirmationOKDialog(datav.respuesta);
            if (result) {
              const blnModalClave = await this.modalClaveDatoADatoB(datav.datoA, datav.datoB, "", datav.cod_servicio);
              if (blnModalClave) {
                // se guarda
                this.submitDataModificarProformaAprobar();
              } else {
                // no se guarda
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'CONTRASEÑA ERRONEA NO SE GRABO Y APROBO' });
              }
            }
          } else {
            this.submitDataModificarProformaAprobar();
          }

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        complete: () => {
          // window.location.reload();
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      });

  }
  async submitDataModificarProformaAprobar() {
    this.totabilizar();

    let tamanio_array_etiqueta = this.etiqueta_get_modal_etiqueta.length;
    let total_proforma_concat: any = [];
    let tamanio_array_validaciones = this.validacion_post.length;
    let data = this.FormularioData.value;

    let array_validacion_existe_aun_no_validos = this.validacion_post.filter(element => element.valido === "NO");
    let array_negativos_aun_existe = this.validacion_post_negativos.filter(element => element.obs === 'Genera Negativo');
    let array_negativos_aun_existe_tamanio = array_negativos_aun_existe.length;
    let array_validacion_existe_aun_no_validos_tamanio = array_validacion_existe_aun_no_validos.length;

    this.spinner.show();

    if (!this.FormularioData.valid) {
      this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'REVISE FORMULARIO' });
      // 
      setTimeout(() => {
        this.spinner.hide();
      }, 50);
    }

    if (tamanio_array_etiqueta === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡ FALTA GRABAR ETIQUETA !' });
      setTimeout(() => {
        this.spinner.hide();
      }, 50);
      return;
    }

    if (tamanio_array_validaciones === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡ FALTA VALIDAR, VALIDE PORFAVOR !' });
      setTimeout(() => {
        this.spinner.hide();
      }, 50);
      return;
    } else {
      setTimeout(() => {
        this.spinner.hide();
      }, 50);
    }

    if (this.total === 0.00) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'EL TOTAL NO PUEDE SER 0, PARA GRABAR Y APROBAR PROFORMA' });
      setTimeout(() => {
        this.spinner.hide();
      }, 50);
      return;
    }

    if (this.api.statusInternet === false) {
      const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
        width: '450px',
        height: 'auto',
        data: { mensaje_dialog: "¿No tienes conexion a internet ⚠️, esta proforma se exportara en un excel, para que posteriormente continues dando curso al pedido?" },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result: Boolean) => {
        if (result) {
          this.detalleProformaCarritoTOExcel();
        }
      });
    }

    // Asegúrate de que las variables estén definidas antes de aplicar el filtro
    if (this.validacion_post && this.validacion_post_negativos) {
      try {
        //validacion cuando hay validaciones NO VALIDADADAS PERO IGUAL QUIERES GUARDAR
        if (array_validacion_existe_aun_no_validos_tamanio > 0) {
          const result = await this.openConfirmationOKDialog(`La Proforma ${this.id_tipo_view_get_codigo}-${this.id_proforma_numero_id} tiene validaciones las cuales tienen que ser revisadas.`);
          if (result) {
            setTimeout(() => {
              this.spinner.hide();
            }, 50);
            return;
          } else {
            return;
          }
        }

        // VALIDACION SI EN LA VALIDACIONES HAY ITEMS QUE GENERAN NEGATIVOS
        if (array_negativos_aun_existe_tamanio > 0) {
          const result = await this.openConfirmationDialog(`La Proforma ${this.id_tipo_view_get_codigo}-${this.id_proforma_numero_id} genera saldos negativos. ¿Esta seguro de grabar la proforma?`);
          if (!result) {
            setTimeout(() => {
              this.spinner.hide();
            }, 500);
            return;
          }
        }
      } catch (error) {
        console.error('Error al realizar las validaciones:', error);
      }
    } else {
      console.error('validacion_post o validacion_post_negativos no están definidos');
    }

    const transformedArray = this.validacion_post.map((validaciones) => ({
      ...validaciones,
      clave_servicio: validaciones.claveServicio,
      codproforma: this.codigo_proforma,
      codServicio: parseInt(validaciones.codServicio),
      nroItems: parseInt(validaciones.nroItems) || 0,
      subtotal: parseFloat(validaciones.subtotal) || 0,
      descuentos: parseFloat(validaciones.descuentos) || 0,
      recargos: parseFloat(validaciones.recargos) || 0,
    }));

    //array carrito de compras
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((item) => ({
      ...item,
      cantaut: item.cantidad,
      totalaut: item.total,
      obs: item.obs,
      nroitem: item.nroitem,
      id: 0,
    }));

    data = {
      ...data,
      codigo: this.codigo_proforma,
      codcliente_real: this.codigo_cliente,
      descuentos: this.des_extra,
      idpf_complemento: this.idpf_complemento_view === undefined ? " " : this.idpf_complemento_view, // complemento de proforma
      nroidpf_complemento: this.nroidpf_complemento_view === undefined ? 0 : this.nroidpf_complemento_view, // complemento de proforma
      tipo_complementopf: this.tipo_complementopf_input,
      tipo_venta: this.tipopago,
      idanticipo: "",
      idsoldesctos: "",
      numeroidanticipo: 0,
      obs2: "",
      usuarioaut: "",
      usuarioreg: this.usuarioLogueado,
      pago_contado_anticipado: this.pago_contado_anticipado,
      tipo_docid: this.tipo_doc_cliente
    };

    // 
    // 

    this.submitted = true;

    //se aumenta el array tabladescuentos y el array tablarecargos al array de validaciones
    let form_validacion = this.valor_formulario_copied_map_all;
    form_validacion = {
      ...form_validacion,
      estado_doc_vta: "EDITAR",
      numeroid: this.id_proforma_numero_id?.toString(),
      codalmacen: this.almacn_parame_usuario_almacen?.toString(),
      codvendedor: this.cod_vendedor_cliente?.toString(),
      contra_entrega: this.contra_entrega?.toString(),
      nroidpf_complemento: this.nroidpf_complemento_view?.toString() || '',
      latitud: this.latitud_cliente?.toString(),
      longitud: this.longitud_cliente?.toString(),
      cliente_habilitado: this.cliente_habilitado_get?.toString(),
      desctoespecial: this.cod_descuento_modal_codigo?.toString() || '',
      nitfactura: this.nit_cliente?.toString(),
      nombcliente: this.razon_social?.toString(),
      nomcliente_real: this.codigo_cliente_catalogo_real?.toString(),
      idsol_nivel: "0",
      nroidsol_nivel: "0",
      preciovta: this.cod_precio_venta_modal_codigo?.toString(),
      tipo_cliente: this.tipo_cliente?.toString(),
      tipo_doc_id: this.tipo_doc_cliente?.toString(),
      tipo_vta: this.tipopago?.toString(),
      tipo_complementopf: this.tipo_complementopf_input,
      // tabladescuentos: this.array_de_descuentos_ya_agregados,
      // tablarecargos: this.recargo_de_recargos,
    };

    this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados?.map((element) => ({
      ...element,
      descrip: element.descripcion,
    }));

    let tabladescuentos_map = this.array_de_descuentos_ya_agregados?.map((element) => ({
      coddesextra: element.coddesextra,
      descripcion: element.descripcion,
      porcen: element.porcen,
      montodoc: element.montodoc,
      codcobranza: element.codcobranza,
      codcobranza_contado: element.codcobranza_contado,
      codanticipo: element.codanticipo
    }));

    let tablarecargos_map = this.recargo_de_recargos?.map((element) => ({
      codrecargo: element.codrecargo,
      descripcion: element.descripcion,
      porcen: element.porcen,
      monto: element.monto,
      moneda: element.moneda,
      montodoc: element.montodoc,
      codcobranza: element.codcobranza
    }));

    total_proforma_concat = {
      veproforma: data,
      veproforma1: this.array_items_carrito_y_f4_catalogo,
      veproforma_valida: transformedArray,
      dt_anticipo_pf: this.tabla_anticipos,
      vedesextraprof: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados, // array de desct extra del totalizador
      verecargoprof: this.recargo_de_recargos, //array de recargos,
      veetiqueta_proforma: this.etiqueta_get_modal_etiqueta[0], // array de etiqueta
      veproforma_iva: this.veproforma_iva, //array de iva
      dvta: form_validacion, // aca el array de validacion mapeado con mas info xdxd  this.valor_formulario_copied_map_all;
      detalleAnticipos: [],

      tabladescuentos: tabladescuentos_map === undefined ? [] : tabladescuentos_map,
      tablarecargos: tablarecargos_map
    };

    let resp: any;
    let alerts: any;

    if (array_negativos_aun_existe_tamanio > 0) {
      this.hay_negativos_bool = true;
    } else {
      this.hay_negativos_bool = false;
    }

    
    const url = `/venta/modif/docmodifveproforma/guardarProforma/${this.userConn}/${this.codigo_proforma}/${this.BD_storage}/true/${this.codigo_cliente_catalogo_real}/${this.hay_negativos_bool}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;
    this.api.create(url, total_proforma_concat).subscribe({
      next: async (datav) => {
        this.messageService.add({ severity: 'info', summary: 'Informacion', detail: "GUARDADO CON EXITO ✅" });
        this.totabilizar_post = datav;
        

        resp = datav.resp;
        alerts = datav.alerts;

        // Mostrar el mensaje de guardado con éxito
        this.messageService.add({ severity: 'info', summary: 'Informacion', detail: resp + "✅" });
        this.log_module.guardarLog(this.ventana, "Creacion" + this.totabilizar_post.codProf, "POST", this.id_tipo_view_get_codigo, this.id_proforma_numero_id);

        // Si hay alertas, abrir el primer modal y esperar a que se cierre
        if (alerts) {
          const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
            width: '450px',
            height: 'auto',
            data: {
              mensaje_dialog: alerts
            },
            disableClose: true,
          });

          // Esperar a que se cierre el primer modal
          await firstValueFrom(dialogRef.afterClosed());
        }

        // Mostrar el segundo modal después de cerrar el primero
        const dialogRefZIP = this.dialog.open(DialogConfirmActualizarComponent, {
          width: '450px',
          height: 'auto',
          data: {
            mensaje_dialog: resp + " " + this.id_tipo_view_get_codigo + "-" + this.id_proforma_numero_id + " con Exito. ¿Desea Exportar el Documento?"
          },
          disableClose: true,
        });

        // Esperar el cierre del segundo modal
        dialogRefZIP.afterClosed().subscribe(async (result: Boolean) => {
          if (result) {
            await this.modalBtnImpresiones(true);
          } else {
            this.modalBtnImpresiones(true);
          }
        });

        this.guardarDataImpresion(datav.codProf, true);
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      error: (err) => {
        
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO SE GRABO, OCURRIO UN PROBLEMA AL GRABAR !' });

        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      }
    });


  }





























  totabilizar() {
    let total_proforma_concat: any = [];

    //valor del check en el mat-tab complementar proforma
    if (this.disableSelect.value === false) { //valor del check en el mat-tab complementar proforma this.disableSelect.value 
      this.complementopf = 0;
    } else {
      this.complementopf = 1;
    }
    if (this.array_items_carrito_y_f4_catalogo.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO HAY ITEMS EN EL DETALLE DE PROFORMA' });

      this.total = 0.00;
      this.subtotal = 0.00;
      this.des_extra = 0.00;
      this.recargos = 0.00;
    };

    if (this.habilitar_desct_sgn_solicitud === undefined) {
      this.habilitar_desct_sgn_solicitud = false;
    };

    // let tamanio_array_descuentos = this.array_de_descuentos_ya_agregados?.length;
    // if (tamanio_array_descuentos === 0) {
    //   this.array_de_descuentos_ya_agregados = [];
    // };
    total_proforma_concat = {
      veproforma: this.FormularioData.value, //este es el valor de todo el formulario de proforma
      veproforma1_2: this.array_items_carrito_y_f4_catalogo, //este es el carrito con las items
      veproforma_valida: [],
      veproforma_anticipo: [],
      vedesextraprof: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados, //array de descuentos
      verecargoprof: this.recargo_de_recargos, // array de recargos
      veproforma_iva: this.veproforma_iva, //array de iva
      detalleAnticipos: this.tabla_anticipos === undefined ? [] : this.tabla_anticipos,
    };

    
    // 

    if (this.habilitar_desct_sgn_solicitud != undefined && this.complementopf != undefined) {
      
      this.spinner.show();
      let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/veproforma/totabilizarProf/";
      return this.api.create(`/venta/transac/veproforma/totabilizarProf/${this.userConn}/${this.usuarioLogueado}/${this.BD_storage}/
        ${this.habilitar_desct_sgn_solicitud}/${this.tipo_complementopf_input}/${this.desct_nivel_actual}/${this.codigo_cliente_catalogo_real}`, total_proforma_concat)
        .subscribe({
          next: (datav) => {
            this.totabilizar_post = datav;
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! TOTALIZADO EXITOSAMENTE !' })

            setTimeout(() => {
              this.spinner.hide();
            }, 50);
          },

          error: (err) => {
            
            this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO SE TOTALIZO !' });
            setTimeout(() => {
              this.spinner.hide();
            }, 10);
          },
          complete: () => {
            this.mandarEntregar();
            this.total = this.totabilizar_post.totales?.total;
            this.subtotal = this.totabilizar_post.totales?.subtotal;
            this.recargos = this.totabilizar_post.totales?.recargo;
            this.des_extra = this.totabilizar_post.totales?.descuento;
            this.iva = this.totabilizar_post.totales?.iva;
            this.peso = Number(this.totabilizar_post.totales?.peso);
            this.tablaIva = this.totabilizar_post.totales?.tablaIva;

            this.getNombreDeDescuentos(this.totabilizar_post.totales?.tablaDescuentos);
            this.array_de_descuentos_ya_agregados = this.totabilizar_post?.totales.tablaDescuentos;

            this.array_items_carrito_y_f4_catalogo = this.totabilizar_post?.detalleProf;

            if (this.totabilizar_post.totales?.mensaje) {
              this.openConfirmationOKDialog(this.totabilizar_post.totales?.mensaje)
            }

            // Agregar el número de orden a los objetos de datos
            this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
              element.nroitem = index + 1;
              element.orden = index + 1;
            });

            this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
          }
        })
    } else {
      this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'REVISE FORMULARIO ' });
      
    }
  }

  totabilizarValidar23(): Promise<void> {
    return new Promise((resolve, reject) => {
      let total_proforma_concat: any = [];

      if (this.disableSelect.value === false) {
        this.complementopf = 0;
      } else {
        this.complementopf = 1;
      }

      if (this.array_items_carrito_y_f4_catalogo.length === 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO HAY ITEMS EN EL DETALLE DE PROFORMA ' });
        reject("No hay items en el detalle de la proforma");
        return;
      }

      if (this.habilitar_desct_sgn_solicitud === undefined) {
        this.habilitar_desct_sgn_solicitud = false;
      }

      this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
        empaque: element.empaque === null ? 0 : element.empaque,
      }));

      this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados ? this.array_de_descuentos_ya_agregados?.map((element) => ({
        ...element,
      })) : [];

      total_proforma_concat = {
        veproforma: this.FormularioData.value,
        veproforma1_2: this.array_items_carrito_y_f4_catalogo,
        veproforma_valida: [],
        veproforma_anticipo: [],
        vedesextraprof: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados,
        verecargoprof: this.recargo_de_recargos,
        veproforma_iva: this.veproforma_iva,
        detalleAnticipos: this.tabla_anticipos === undefined ? [] : this.tabla_anticipos,
      };

      if (this.habilitar_desct_sgn_solicitud !== undefined && this.complementopf !== undefined) {
        this.spinner.show();

        this.api.create("/venta/transac/veproforma/totabilizarProf/" + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/" +
          this.habilitar_desct_sgn_solicitud + "/" + this.tipo_complementopf_input + "/" + this.desct_nivel_actual + "/" + this.codigo_cliente_catalogo_real, total_proforma_concat)
          .pipe(takeUntil(this.unsubscribe$)).subscribe({
            next: (datav) => {
              this.totabilizar_post = datav;
              this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! TOTALIZADO EXITOSAMENTE !' })
              setTimeout(() => {
                this.spinner.hide();
              }, 50);

              this.mandarEntregar();
              this.total = this.totabilizar_post.totales?.total;
              this.subtotal = this.totabilizar_post.totales?.subtotal;
              this.recargos = this.totabilizar_post.totales?.recargo;
              this.des_extra = this.totabilizar_post.totales?.descuento;
              this.iva = this.totabilizar_post.totales?.iva;
              this.peso = Number(this.totabilizar_post.totales?.peso);
              this.tablaIva = this.totabilizar_post.totales?.tablaIva;

              if (this.totabilizar_post.totales?.mensaje) {
                this.openConfirmationOKDialog(this.totabilizar_post.totales?.mensaje)
              }

              this.getNombreDeDescuentos(this.totabilizar_post.totales?.tablaDescuentos);
              this.array_de_descuentos_ya_agregados = this.totabilizar_post?.totales.tablaDescuentos;
              this.array_items_carrito_y_f4_catalogo = this.totabilizar_post?.detalleProf;

              this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
                element.nroitem = index + 1;
                element.orden = index + 1;
              });

              this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

              resolve();  // Operación exitosa, resolvemos la promesa
            },
            error: (err) => {
              
              this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO SE TOTALIZO !' });

              setTimeout(() => {
                this.spinner.hide();
              }, 10);

              reject(err);  // Error, rechazamos la promesa
            }
          });
      } else {
        this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'REVISE FORMULARIO' });
        
        reject("Datos no validados");
      }
    });
  }

  anularProformar() {
    let data_anular = {
      dt_anticipo_pf: [],
      dt_anticipo_pf_inicial: this.tabla_anticipos
    };
    

    const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: "¿ SEGURO QUE DESEA ANULAR LA PROFORMA: " + this.id_tipo_view_get_codigo + "-" + this.id_proforma_numero_id + "?" },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/modif/docmodifveproforma/anularProforma/";
        return this.api.update('/venta/modif/docmodifveproforma/anularProforma/' + this.userConn + "/" + this.codigo_proforma + "/" + this.usuarioLogueado + "/" + this.BD_storage, data_anular)
          .pipe(takeUntil(this.unsubscribe$)).subscribe({
            next: (datav) => {
              
              // se guarda LOG al anular
              this.log_module.guardarLog(this.ventana, "Anulacion" + this.totabilizar_post.codProf, "PUT", this.id_tipo_view_get_codigo, this.id_proforma_numero_id);

              this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp })
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            },

            error: (err: any) => {
              
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            },

            complete: () => {
              // window.location.reload();
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            }
          })
      }
    });
  }

  convertToNumber(value: any): number {
    if (value === undefined) {
      return 0; // O cualquier valor predeterminado que desees
    }
    return parseFloat(value.toString().replace(',', '.'));
  }

  formatNumberTotalSubTOTALES(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_2decimales.format(formattedNumber);
  }

  formatNumberTotalSub(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número

    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_5decimales.format(Number(formattedNumber));
  }

  async validarProformaAll() {
    console.clear();
    this.getPrecioInicial();

    let tamanio_array_etiqueta = this.etiqueta_get_modal_etiqueta.length;

    if (this.total === 0.00) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'EL TOTAL NO PUEDE SER 0' });
      setTimeout(() => {
        this.spinner.hide();
      }, 50);
      return;
    }

    if (!this.FormularioData.valid || tamanio_array_etiqueta === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡ FALTA GRABAR ETIQUETA !' });
      setTimeout(() => {
        this.spinner.hide();
      }, 50);
      return;
    }

    // Preguntar si desea aplicar el desct 23 APLICAR DESCT POR DEPOSITO
    const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: "¿Desea aplicar DESCUENTO POR DEPOSITO, si el cliente tiene pendiente algun descuento por este concepto?" },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (result: Boolean) => {
      if (result) {
        try {
          await this.aplicarDesctPorDepositoBTNModal();  // Espera a que aplique el descuento
          //await this.totabilizar();  // Luego, espera a que totabilice
          //await this.validar();  // Finalmente, realiza la validación
        } catch (error) {
          console.error("Error durante la ejecución de las funciones:", error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema durante la validación.' });
        }
      } else {
        this.validar();
      }
    });
  }

  validacionesTodosFilterToggle() {
    this.toggleValidacionesAll = true;
    this.toggleValidos = false;
    this.toggleNoValidos = false;

    this.dataSource_validacion = new MatTableDataSource(this.validacion_post);
  }

  validacionesValidosFilterToggle() {
    this.toggleValidacionesAll = false;
    this.toggleValidos = true;
    this.toggleNoValidos = false;

    this.validacion_solo_validos = this.validacion_post.filter((element) => {
      return element.valido === "SI";
    });

    this.dataSource_validacion = new MatTableDataSource(this.validacion_solo_validos);
  }

  validacionesNOValidosFilterToggle() {
    this.toggleValidacionesAll = false;
    this.toggleValidos = false;
    this.toggleNoValidos = true;

    this.validacion_no_validos = this.validacion_post.filter((element) => {
      return element.valido === "NO";
    });

    this.dataSource_validacion = new MatTableDataSource(this.validacion_no_validos);
  }
  // FIN VALIDACION ALL

  // NEGATIVOS
  validacion_post_negativos_filtrados_solo_negativos: any = [];
  validacion_post_negativos_filtrados_solo_positivos: any = [];

  toggleTodosNegativos: boolean = false;
  toggleNegativos: boolean = false;
  togglePositivos: boolean = false;

  validarProformaSoloNegativos() {
    console.clear();
    // 00060 - VALIDAR SALDOS NEGATIVOS
    // VACIO - TODOS LOS CONTROLES
    this.valor_formulario = [this.FormularioData.value];
    // 

    let tipo_complemento
    
    switch (this.complementopf) {
      case 3:
        tipo_complemento = "";
        break;
      case 0:
        tipo_complemento = "complemento_mayorista_dimediado";
        break;
      case 1:
        tipo_complemento = "complemento_para_descto_monto_min_desextra";
        break;
    }

    this.valor_formulario.map((element: any) => {
      return this.valor_formulario_negativos = {
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString(),
        codcliente: element.codcliente?.toString() || '',
        nombcliente: element.nombcliente?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente_real?.toString() || '',
        nomcliente_real: element.nomcliente_real?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        subtotaldoc: element.subtotal,
        totaldoc: this.total,
        tipo_vta: element.tipopago?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        preparacion: element.preparacion,
        contra_entrega: element.contra_entrega?.toString() === true ? "SI" : "NO",
        vta_cliente_en_oficina: element.venta_cliente_oficina,
        estado_contra_entrega: element.estado_contra_entrega === undefined ? "SI" : "NO",
        desclinea_segun_solicitud: element.desclinea_segun_solicitud,
        pago_con_anticipo: element.pago_contado_anticipado === null ? false : element.pago_contado_anticipado,
        niveles_descuento: element.niveles_descuento,
        transporte: element.transporte,
        nombre_transporte: element.nombre_transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: element.tipoentrega,
        direccion: element.direccion,
        ubicacion: element.ubicacion,
        latitud: element.latitud_entrega,
        longitud: element.longitud_entrega,
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        fechadoc: element.fecha,

        idanticipo: this.idanticipo,
        noridanticipo: element.numeroidanticipo?.toString() || '0',

        monto_anticipo: 0,
        nrofactura: "0",
        nroticket: "",
        tipo_caja: "",
        tipo_cliente: this.tipo_cliente,
        nroautorizacion: "",
        nrocaja: "",
        idsol_nivel: "",
        nroidsol_nivel: "0",
        version_codcontrol: "",
        estado_doc_vta: "EDITAR",
        codtarifadefecto: this.codTarifa_get?.toString(),
        desctoespecial: this.cod_descuento_modal?.toString(),
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
        totrecargos: 0,

        idpf_complemento: this.idpf_complemento_view,
        nroidpf_complemento: this.nroidpf_complemento_view?.toString(),
        tipo_complemento: this.tipo_complementopf_input?.toString(),

        idFC_complementaria: "",
        nroidFC_complementaria: "0",
        fechalimite_dosificacion: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),

        idpf_solurgente: "",
        noridpf_solurgente: "0",
      }
    });
    this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados?.map((element) => ({
      ...element,
      codcobranza_contado: element.codcobranza_contado === null ? 0 : element.codcobranza_contado,
      codcobranza: element.codcobranza === null ? 0 : element.codcobranza,
      codanticipo: element.codanticipo === null ? 0 : element.codanticipo,
    }));

    this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados?.map((element) => ({
      ...element,
      descripcion: element.descrip,
    }))

    // boolean que verifica que el formulario este con sus data llenada
    this.submitted = true;
    if (this.FormularioData.valid) {
      this.spinner.show();
      
      // 

      let proforma_validar = {
        datosDocVta: this.valor_formulario_negativos,
        detalleAnticipos: this.tabla_anticipos,
        detalleDescuentos: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados,
        //detalleEtiqueta: [this.etiqueta_get_modal_etiqueta],
        detalleEtiqueta: [this.etiqueta_get_modal_etiqueta[0]],
        detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
        detalleRecargos: [],
      }

      // 
      const url = `/venta/transac/veproforma/validarProforma/${this.userConn}/00060/proforma/grabar_aprobar/${this.BD_storage}/${this.usuarioLogueado}`;
      const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;

      this.api.create(url, proforma_validar).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'VALIDACION CORRECTA NEGATIVOS ✅' });
          if (datav.jsonResult) {
            this.validacion_post_negativos = datav.jsonResult[0].dtnegativos;
          }

          this.abrirTabPorLabel("Negativos");
          // 

          this.toggleTodosNegativos = true;
          this.toggleNegativos = false;
          this.togglePositivos = false;

          this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos);
          this.array_items_carrito_y_f4_catalogo = datav.itemDataMatriz;
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        error: (err) => {
          
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO SE VALIDO NEGATIVOS, OCURRIO UN PROBLEMA !' });
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      });
    } else {
      this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'REVISE FORMULARIO ' });
      
    }
  }

  negativosTodosFilterToggle() {
    this.toggleTodosNegativos = true;
    this.toggleNegativos = false;
    this.togglePositivos = false;

    this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos);
  }

  negativosNegativosFilterToggle() {
    this.toggleTodosNegativos = false;
    this.toggleNegativos = true;
    this.togglePositivos = false;

    this.validacion_post_negativos_filtrados_solo_negativos = this.validacion_post_negativos.filter((element) => {
      return element.obs === "Genera Negativo";
    });

    this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos_filtrados_solo_negativos);
  }

  negativosPositivosFilterToggle() {
    this.toggleTodosNegativos = false;
    this.toggleNegativos = false;
    this.togglePositivos = true;

    this.validacion_post_negativos_filtrados_solo_positivos = this.validacion_post_negativos.filter((element) => {
      return element.obs === "Positivo";
    });

    this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos_filtrados_solo_positivos);
  }
  //FIN NEGATIVOS

  // MAX VENTAS
  validacion_post_max_venta_filtrados_si_sobrepasa: any = [];
  validacion_post_max_venta_filtrados_no_sobrepasa: any = [];

  toggleTodosMaximoVentas: boolean = false;
  toggleMaximoVentaSobrepasan: boolean = false;
  toggleMaximoVentasNoSobrepasan: boolean = false;

  validarProformaSoloMaximoVenta() {
    // console.clear();
    // 00058 - VALIDAR MAXIMO DE VENTA
    // VACIO - TODOS LOS CONTROLES
    this.valor_formulario = [this.FormularioData.value];
    // 

    let tipo_complemento
    // 
    switch (this.complementopf) {
      case 3:
        tipo_complemento = "";
        break;
      case 0:
        tipo_complemento = "complemento_mayorista_dimediado";
        break;
      case 1:
        tipo_complemento = "complemento_para_descto_monto_min_desextra";
        break;
    }

    this.valor_formulario.map((element: any) => {
      return this.validacion_post_max_ventas = {
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString(),
        codcliente: element.codcliente?.toString() || '',
        nombcliente: element.nombcliente?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente_real?.toString() || '',
        nomcliente_real: element.nomcliente_real?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        subtotaldoc: element.subtotal,
        totaldoc: this.total,
        tipo_vta: element.tipopago?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        preparacion: element.preparacion,
        contra_entrega: element.contra_entrega?.toString() === true ? "SI" : "NO",
        vta_cliente_en_oficina: element.venta_cliente_oficina,
        estado_contra_entrega: element.estado_contra_entrega === undefined ? "SI" : "NO",
        desclinea_segun_solicitud: element.desclinea_segun_solicitud,
        pago_con_anticipo: element.pago_contado_anticipado === null ? false : element.pago_contado_anticipado,
        niveles_descuento: element.niveles_descuento,
        transporte: element.transporte,
        nombre_transporte: element.nombre_transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: element.tipoentrega,
        direccion: element.direccion,
        ubicacion: element.ubicacion,
        latitud: element.latitud_entrega,
        longitud: element.longitud_entrega,
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        fechadoc: element.fecha,
        idanticipo: this.idanticipo,
        noridanticipo: element.numeroidanticipo?.toString() || '',
        monto_anticipo: 0,
        nrofactura: "0",
        nroticket: "",
        tipo_caja: "",
        tipo_cliente: this.tipo_cliente,
        nroautorizacion: "",
        nrocaja: "",
        idsol_nivel: "",
        nroidsol_nivel: "0",
        version_codcontrol: "",
        estado_doc_vta: "EDITAR",
        codtarifadefecto: this.codTarifa_get?.toString(),
        desctoespecial: this.cod_descuento_modal?.toString(),
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
        totrecargos: 0,

        idpf_complemento: this.idpf_complemento_view,
        nroidpf_complemento: this.nroidpf_complemento_view?.toString(),
        tipo_complemento: this.tipo_complementopf_input?.toString(),

        idFC_complementaria: "",
        nroidFC_complementaria: "",
        fechalimite_dosificacion: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        idpf_solurgente: "0",
        noridpf_solurgente: "0",
      }
    });

    // boolean que verifica que el formulario este con sus data llenada
    this.submitted = true;
    this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados?.map((element) => ({
      ...element,
      codcobranza_contado: element.codcobranza_contado === null ? 0 : element.codcobranza_contado,
      codcobranza: element.codcobranza === null ? 0 : element.codcobranza,
      codanticipo: element.codanticipo === null ? 0 : element.codanticipo,
    }));

    if (this.FormularioData.valid) {
      
      this.spinner.show();
      
      let proforma_validar = {
        datosDocVta: this.validacion_post_max_ventas,
        detalleAnticipos: [],
        detalleDescuentos: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados,
        // detalleEtiqueta: [this.etiqueta_get_modal_etiqueta],
        detalleEtiqueta: [],
        detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
        detalleRecargos: [],
      }

      // 
      const url = `/venta/transac/veproforma/validarProforma/${this.userConn}/00058/proforma/grabar_aprobar/${this.BD_storage}/${this.usuarioLogueado}`;
      const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;

      this.api.create(url, proforma_validar).subscribe({
        next: (datav) => {
          
          this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'VALIDACION CORRECTA MAX VENTAS ✅' });
          this.validacion_post_max_ventas = datav.jsonResult[0].dtnocumplen;

          this.toggleTodosMaximoVentas = true;
          this.toggleMaximoVentaSobrepasan = false;
          this.toggleMaximoVentasNoSobrepasan = false;

          this.dataSourceLimiteMaximoVentas = new MatTableDataSource(this.validacion_post_max_ventas);
          setTimeout(() => {
            this.spinner.hide();
          }, 0);
        },
        error: (err) => {
          
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO SE VALIDO MAX VENTAS, OCURRIO UN PROBLEMA !' });
          setTimeout(() => {
            this.spinner.hide();
          }, 0);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 0);
        }
      });
    } else {
      this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'REVISE FORMULARIO' });
      
    }
  }

  maximoVentasAllFilterToggle() {
    this.toggleTodosMaximoVentas = true;
    this.toggleMaximoVentaSobrepasan = false;
    this.toggleMaximoVentasNoSobrepasan = false;

    this.dataSourceLimiteMaximoVentas = new MatTableDataSource(this.validacion_post_max_ventas);
  }

  maxmoVentasNOSobrepasanFilterToggle() {
    this.toggleTodosMaximoVentas = false;
    this.toggleMaximoVentaSobrepasan = false;
    this.toggleMaximoVentasNoSobrepasan = true;

    this.validacion_post_max_venta_filtrados_no_sobrepasa = this.validacion_post_max_ventas.filter((element) => {
      return element.obs === "Cumple";
    });

    this.dataSourceLimiteMaximoVentas = new MatTableDataSource(this.validacion_post_max_venta_filtrados_no_sobrepasa);
  }

  maxmoVentasSISobrepasanFilterToggle() {
    this.toggleTodosMaximoVentas = false;
    this.toggleMaximoVentaSobrepasan = true;
    this.toggleMaximoVentasNoSobrepasan = false;

    this.validacion_post_max_venta_filtrados_si_sobrepasa = this.validacion_post_max_ventas.filter((element) => {
      return element.obs != "Cumple";
    });

    this.dataSourceLimiteMaximoVentas = new MatTableDataSource(this.validacion_post_max_venta_filtrados_si_sobrepasa);
  }
  // FIN MAX VENTAS

  verificarNit() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/transac/prgfacturarNR_cufd/getVerifComunicacionSIN/";
    return this.api.getAll('/venta/transac/veproforma/validarNITenSIN/' + this.userConn + "/" + this.BD_storage + "/" + this.usuarioLogueado + "/" + this.agencia_logueado + "/" + this.nit_cliente + "/" + this.tipo_doc_cliente)
      .subscribe({
        next: (datav) => {
          // 
          if (datav.nit_es_valido === "VALIDO") {
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.nit_es_valido })
            this.dialog.open(DialogConfirmacionComponent, {
              width: '450px',
              height: 'auto',
              data: { mensaje_dialog: datav.nit_es_valido },
              disableClose: true,
            });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: datav.nit_es_valido });
            this.dialog.open(DialogConfirmacionComponent, {
              width: '450px',
              height: 'auto',
              data: { mensaje_dialog: datav.nit_es_valido },
              disableClose: true,
            });
          }
        },

        error: (err: any) => {
          
        },
        complete: () => {
        }
      })
  }

  getNombreDeDescuentos(array_descuentos) {
    // 
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion POST -/venta/transac/veproforma/getDescripDescExtra/";
    return this.api.create('/venta/transac/veproforma/getDescripDescExtra/' + this.userConn, array_descuentos)
      .subscribe({
        next: (datav) => {
          this.array_de_descuentos_ya_agregados = datav.tabladescuentos?.map((element) => ({
            ...element,
            descripcion: element?.descrip,
            descrip: element?.descrip
          }));
        },
        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  estadoMoraValidacion() {
    
  }

  empaquesCerradosValidacion() {
    this.spinner.show()
    let mesagge: string;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/empaquesCerradosVerifica/";
    return this.api.create('/venta/transac/veproforma/empaquesCerradosVerifica/' + this.userConn + "/" + this.codigo_cliente, this.array_items_carrito_y_f4_catalogo)
      .subscribe({
        next: (datav) => {
          

          if (datav.cumple === true) {
            mesagge = "CUMPLE";
          } else {
            mesagge = "NO CUMPLE";
            this.pinta_empaque_minimo = false;
          }

          this.modalDetalleObservaciones(datav.reg, mesagge);
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'EMPAQUES CERRADOS PROCESANDO ⚙️' })
          this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;

          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      })
  }

  pinta_empaque_minimo: boolean = false;
  empaquesMinimosPrecioValidacion() {
    let mesagge: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/empaquesMinimosVerifica/";
    return this.api.create('/venta/transac/veproforma/empaquesMinimosVerifica/' + this.userConn + "/" + this.codigo_cliente + "/" + this.agencia_logueado, this.array_items_carrito_y_f4_catalogo)
      .subscribe({
        next: (datav) => {
          // 

          if (datav.cumple === true) {
            mesagge = "CUMPLE";
          } else {
            mesagge = "NO CUMPLE";
            this.pinta_empaque_minimo = true;
          }

          this.modalDetalleObservaciones(datav.reg, mesagge);
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'EMPAQUES MINIMO PROCESANDO ⚙️' })
          this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;

          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      });
  }

  aplicarDesctPorDepositoBTNModal() {
    this.spinner.show();

    let array_descuentos_dest_deposito = (this.array_de_descuentos_ya_agregados || []).map((element) => ({
      ...element,
      descripcion: element.descrip,
      descrip: element.descrip,
      // codproforma: 0,
      // coddesextra: element.coddesextra,
      // porcen: element.porcen,
      // montodoc: element.montodoc,
      // codcobranza: 0,
      // codcobranza_contado: 0,
      // codanticipo: 0,
      // id: 0,
      // aplicacion: element.aplicacion,
      // codmoneda: element.codmoneda,
      // total_dist: 0,
      // total_desc: 0,
      // montorest: 0
    }));

    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
      ...element,
      cumple: element.cumple === 1 ? true : false,
    }));

    let a = {
      getTarifaPrincipal: {
        tabladetalle: this.array_items_carrito_y_f4_catalogo,
        dvta: this.FormularioData.value,
      },
      tabladescuentos: array_descuentos_dest_deposito,
      tblcbza_deposito: [],
    };

    // 
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/aplicar_descuento_por_deposito/";
    return this.api.create('/venta/transac/veproforma/aplicar_descuento_por_deposito/' + this.userConn + "/" + this.codigo_cliente + "/" +
      this.codigo_cliente_catalogo_real + "/" + this.nit_cliente + "/" + this.BD_storage + "/" + this.subtotal + "/" + this.moneda_get_catalogo + "/" + this.codigo_proforma, a)
      .subscribe({
        next: async (datav) => {
          
          let msa: any = datav.respOculto;
          // if (datav.respOculto) {
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'DESCT. DEPOSITO APLICANDO ⚙️' })
          if (datav.respOculto) {
            // const result = await this.openConfirmationOKDialog(msa);
            // if (result) {
            //ACA NO LLEGA LOS DESCT, SOLO LA RESP OCULTA
            // this.modalDetalleObservaciones(datav.msgVentCob, datav.megAlert);
            // } 
          } else {
            //ACA SE HACE EL MAPEO PORQ YA LLEGA LOS DESCT
            this.array_de_descuentos_ya_agregados = datav.tabladescuentos;
            this.array_de_descuentos_ya_agregados = datav.tabladescuentos?.map((element) => ({
              ...element,
              descripcion: element.descrip,
              descrip: element.descrip,
            }));
          }
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: async () => {
          this.aplicarDesctPorDepositoYTotalizarYValidar();
        }
      });
  }

  async aplicarDesctPorDepositoYTotalizarYValidar() {
    let total_proforma_concat: any = [];


    

    //valor del check en el mat-tab complementar proforma
    if (this.disableSelect.value === false) { //valor del check en el mat-tab complementar proforma this.disableSelect.value 
      this.complementopf = 0;
    } else {
      this.complementopf = 1;
    }
    if (this.array_items_carrito_y_f4_catalogo.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO HAY ITEMS EN EL DETALLE DE PROFORMA' });
    };

    if (this.habilitar_desct_sgn_solicitud === undefined) {
      this.habilitar_desct_sgn_solicitud = false;
    };
    let tamanio_array_descuentos = this.array_de_descuentos_ya_agregados?.length === undefined ? [] : this.array_de_descuentos_ya_agregados?.length;
    if (tamanio_array_descuentos === 0) {
      this.array_de_descuentos_ya_agregados = [];
    };

    total_proforma_concat = {
      veproforma: this.FormularioData.value, //este es el valor de todo el formulario de proforma
      veproforma1_2: this.array_items_carrito_y_f4_catalogo, //este es el carrito con las items
      veproforma_valida: [],
      veproforma_anticipo: [],
      vedesextraprof: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados, //array de descuentos
      verecargoprof: this.recargo_de_recargos, //array de recargos
      veproforma_iva: this.veproforma_iva, //array de iva
      detalleAnticipos: this.tabla_anticipos === undefined ? [] : this.tabla_anticipos,
    };

    
    if (this.habilitar_desct_sgn_solicitud != undefined && this.complementopf != undefined) {
      
      this.spinner.show();
      let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/veproforma/totabilizarProf/";
      return this.api.create("/venta/transac/veproforma/totabilizarProf/" + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/" +
        this.habilitar_desct_sgn_solicitud + "/" + this.tipo_complementopf_input + "/" + this.desct_nivel_actual + "/" + this.codigo_cliente_catalogo_real, total_proforma_concat)
        .subscribe({
          next: (datav) => {
            this.totabilizar_post = datav;
            
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! TOTALIZADO EXITOSAMENTE !' })
          },

          error: (err) => {
            
            setTimeout(() => {
              this.spinner.hide();
            }, 10);
          },
          complete: async () => {
            this.mandarEntregar();

            this.total = this.totabilizar_post.totales?.total;
            this.subtotal = this.totabilizar_post.totales?.subtotal;
            this.recargos = this.totabilizar_post.totales?.recargo;
            this.des_extra = this.totabilizar_post.totales?.descuento;
            this.iva = this.totabilizar_post.totales?.iva;
            this.peso = Number(this.totabilizar_post.totales?.peso);
            this.tablaIva = this.totabilizar_post.totales?.tablaIva;

            if (this.totabilizar_post.totales?.mensaje) {
              this.openConfirmationOKDialog(this.totabilizar_post.totales?.mensaje)
            }
            this.array_items_carrito_y_f4_catalogo = this.totabilizar_post.detalleProf;

            // Agregar el número de orden a los objetos de datos
            this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
              element.nroitem = index + 1;
              element.orden = index + 1;
            });

            await this.validar();
          }
        })
    } else {
      this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'REVISE FORMULARIO' });
      
    }
  }

  async validar() {
    // ACA TRAE TODAS LAS VALIDACIONES QUE SE REALIZAN EN EL BACKEND
    // VACIO - TODOS LOS CONTROLES
    this.spinner.show();
    this.valor_formulario = [this.FormularioData.value];
    

    let tipo_complemento
    
    switch (this.tipo_complementopf_input) {
      case 3:
        tipo_complemento = "";
        break;
      case 0:
        tipo_complemento = "complemento_mayorista_dimediado";
        break;
      case 1:
        tipo_complemento = "complemento_para_descto_monto_min_desextra";
        break;
    };

    this.valor_formulario.map((element: any) => {
      if (this.tipopago === 1) {
        element.contra_entrega = false;
        element.estado_contra_entrega = "";
      }

      this.valor_formulario_copied_map_all = {
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString(),
        codcliente: element.codcliente?.toString() || '',
        nombcliente: this.razon_social?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente_real?.toString() || '',
        nomcliente_real: this.nombre_cliente_catalogo_real,
        codmoneda: element.codmoneda?.toString() || '',
        subtotaldoc: element.subtotal,
        totaldoc: this.total,
        tipo_vta: element.tipopago === 0 ? "CONTADO" : "CREDITO",
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        preparacion: element.preparacion,
        contra_entrega: element.contra_entrega === true ? "SI" : "NO",
        vta_cliente_en_oficina: element.venta_cliente_oficina,
        estado_contra_entrega: element.estado_contra_entrega === undefined ? "" : element.estado_contra_entrega,
        desclinea_segun_solicitud: element.desclinea_segun_solicitud,
        pago_con_anticipo: element.pago_contado_anticipado === null ? false : element.pago_contado_anticipado,
        niveles_descuento: element.niveles_descuento,
        transporte: element.transporte,
        nombre_transporte: element.nombre_transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: element.tipoentrega,
        direccion: element.direccion,
        ubicacion: element.ubicacion,
        latitud: element.latitud_entrega,
        longitud: element.longitud_entrega,
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        fechadoc: element.fecha,
        idanticipo: element.idanticipo === null ? "" : element.idanticipo,
        noridanticipo: element.numeroidanticipo?.toString() || '',
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
        tipo_cliente: this.tipo_cliente,
        codtarifadefecto: this.codTarifa_get?.toString(),
        idpf_complemento: this.idpf_complemento_view,
        nroidpf_complemento: this.nroidpf_complemento_view?.toString(),
        tipo_complemento: tipo_complemento,



        // esto siempre vacio y ceo porq ya no se usa 13-12-2024
        idsol_nivel: "",
        nroidsol_nivel: "0",
        // esto siempre tiene valor del inpur de descuentos Especiales 13-12-2024
        desctoespecial: this.cod_descuento_modal?.toString(),
        totrecargos: this.recargos,


        monto_anticipo: 0,
        nrofactura: "0",
        nroticket: "",
        tipo_caja: "",
        nroautorizacion: "",
        nrocaja: "",
        version_codcontrol: "",
        estado_doc_vta: "EDITAR",


        idFC_complementaria: "",
        nroidFC_complementaria: "",
        fechalimite_dosificacion: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        idpf_solurgente: "0",
        noridpf_solurgente: "0",
      }
    });

    this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados?.map((element) => ({
      ...element,
      codcobranza_contado: element.codcobranza_contado === null ? 0 : element.codcobranza_contado,
      codcobranza: element.codcobranza === null ? 0 : element.codcobranza,
      codanticipo: element.codanticipo === null ? 0 : element.codanticipo,
    }));

    this.etiqueta_get_modal_etiqueta = this.etiqueta_get_modal_etiqueta.map((element) => ({
      ...element,
      linea2: element.linea2 === undefined ? "" : element.linea2,
    }));

    let proforma_validar = {
      datosDocVta: this.valor_formulario_copied_map_all,
      detalleAnticipos: this.tabla_anticipos,
      detalleDescuentos: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados,
      detalleEtiqueta: [this.etiqueta_get_modal_etiqueta[0]],
      detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
      detalleRecargos: this.recargo_de_recargos,
      detalleControles: this.validacion_post === undefined ? [] : this.validacion_post,
    }
    

    // 
    // 
    // 
    // 
    this.submitted = true;

    const url = `/venta/transac/veproforma/validarProforma/${this.userConn}/vacio/proforma/grabar_aprobar/${this.BD_storage}/${this.usuarioLogueado}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;
    this.api.create(url, proforma_validar).subscribe({
      next: (datav) => {
        this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'VALIDACION EN CURSO ⚙️' });
        this.validacion_post = datav.jsonResult;
        

        this.abrirTabPorLabel("Resultado de Validacion");
        this.dataSource_validacion = new MatTableDataSource(this.validacion_post);

        this.toggleValidacionesAll = true;
        this.toggleValidos = false;
        this.toggleNoValidos = false;

        datav.jsonResult.forEach(element => {
          if (element.codigo === 60) {
            this.validacion_post_negativos = element.dtnegativos;
            this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos);
          }

          if (element.codigo === 58) {
            this.validacion_post_max_ventas = element.dtnocumplen;
            this.dataSourceLimiteMaximoVentas = new MatTableDataSource(this.validacion_post_max_ventas);
          }
        });

        this.array_items_carrito_y_f4_catalogo = datav.itemDataMatriz;


        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },
      error: (err) => {
        
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      },
      complete: () => {
        this.abrirTabPorLabel("Resultado de Validacion");
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      }
    });
  }

  ordenarDetalleSegunOrdenPedido() {
    
    this.array_items_carrito_y_f4_catalogo = [...this.array_items_carrito_y_f4_catalogo.sort((a, b) => b.nroitem - a.nroitem)];
    

    // Forzar la detección de cambios
    this.cdr.detectChanges();

    return this.array_items_carrito_y_f4_catalogo;
  }

  //btn
  aplicarDesctPorDepositoHTML() {
    this.spinner.show();

    let array_descuentos_dest_deposito = (this.array_de_descuentos_ya_agregados || []).map((element) => ({
      ...element,
      descrip: element.descrip,
      descripcion: element.descrip,
      // codproforma: 0,
      // coddesextra: element.coddesextra,
      // porcen: element.porcen,
      // montodoc: element.montodoc,
      // codcobranza: 0,
      // codcobranza_contado: 0,
      // codanticipo: 0,
      // id: 0,
      // aplicacion: element.aplicacion,
      // codmoneda: element.codmoneda,

      // total_dist: 0,
      // total_desc: 0,
      // montorest: 0
    }));

    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
      ...element,
      cumple: element.cumple === 1 ? true : false,
    }));

    let a = {
      getTarifaPrincipal: {
        tabladetalle: this.array_items_carrito_y_f4_catalogo,
        dvta: this.FormularioData.value,
      },
      tabladescuentos: array_descuentos_dest_deposito,
      tblcbza_deposito: [],
    };

    
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/aplicar_descuento_por_deposito/";
    return this.api.create('/venta/transac/veproforma/aplicar_descuento_por_deposito/' + this.userConn + "/" + this.codigo_cliente + "/" +
      this.codigo_cliente_catalogo_real + "/" + this.nit_cliente + "/" + this.BD_storage + "/" + this.subtotal + "/" + this.moneda_get_catalogo + "/" + 0, a)
      .subscribe({
        next: async (datav) => {
          
          let msa: any = datav.respOculto;
          if (datav.respOculto) {
            const result = await this.openConfirmationOKDialog(msa);
            if (result) {
              //ACA NO LLEGA LOS DESCT, SOLO LA RESP OCULTA
              this.modalDetalleObservaciones(datav.msgVentCob, datav.megAlert);
              this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'DESCT. DEPOSITO APLICANDO ⚙️' })
            } else {
              //ACA SE HACE EL MAPEO PORQ YA LLEGA LOS DESCT
              this.array_de_descuentos_ya_agregados = datav.tabladescuentos;
              this.array_de_descuentos_ya_agregados = datav.tabladescuentos?.map((element) => ({
                ...element,
                descripcion: element.descrip,
                descrip: element.descrip,
              }));
            }
          } else {
            //ACA SE HACE EL MAPEO PORQ YA LLEGA LOS DESCT
            this.array_de_descuentos_ya_agregados = datav?.tabladescuentos;
            this.array_de_descuentos_ya_agregados = datav.tabladescuentos?.map((element) => ({
              ...element,
              descripcion: element.descrip,
              descrip: element.descrip,
            }));
          }

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: async () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      })
  }

  getPrecioInicial() {
    // this.valor_formulario.map((element: any) => {
    //   this.valor_formulario_copied_map_all = {
    //     coddocumento: 0,
    //     id: element.id.toString() || '',
    //     numeroid: element.numeroid?.toString(),
    //     codcliente: element.codcliente?.toString() || '',
    //     nombcliente: this.razon_social?.toString() || '',
    //     nitfactura: element.nit?.toString() || '',
    //     tipo_doc_id: element.tipo_docid?.toString() || '',
    //     codcliente_real: element.codcliente_real?.toString() || '',
    //     nomcliente_real: this.nombre_cliente_catalogo_real,
    //     codmoneda: element.codmoneda?.toString() || '',
    //     subtotaldoc: element.subtotal,
    //     totaldoc: this.total,
    //     tipo_vta: element.tipopago === 0 ? "CONTADO" : "CREDITO",
    //     codalmacen: element.codalmacen?.toString() || '',
    //     codvendedor: element.codvendedor?.toString() || '',
    //     preciovta: element.preciovta?.toString() || '',
    //     preparacion: element.preparacion,
    //     contra_entrega: element.contra_entrega,
    //     vta_cliente_en_oficina: element.venta_cliente_oficina,
    //     estado_contra_entrega: element.estado_contra_entrega === undefined ? "" : element.estado_contra_entrega,
    //     desclinea_segun_solicitud: element.desclinea_segun_solicitud,
    //     pago_con_anticipo: element.pago_contado_anticipado === null ? false : element.pago_contado_anticipado,
    //     niveles_descuento: element.niveles_descuento,
    //     transporte: element.transporte,
    //     nombre_transporte: element.nombre_transporte,
    //     fletepor: element.fletepor === undefined ? "" : element.fletepor,
    //     tipoentrega: element.tipoentrega,
    //     direccion: element.direccion,
    //     ubicacion: element.ubicacion,
    //     latitud: element.latitud_entrega,
    //     longitud: element.longitud_entrega,
    //     nroitems: this.array_items_carrito_y_f4_catalogo.length,
    //     fechadoc: element.fecha,
    //     idanticipo: element.idanticipo === null ? "" : element.idanticipo,
    //     noridanticipo: element.numeroidanticipo?.toString() || '',
    //     monto_anticipo: 0,
    //     nrofactura: "0",
    //     nroticket: "",
    //     tipo_caja: "",
    //     tipo_cliente: this.tipo_cliente,
    //     nroautorizacion: "",
    //     nrocaja: "",
    //     idsol_nivel: "",
    //     nroidsol_nivel: "0",
    //     version_codcontrol: "",
    //     estado_doc_vta: "EDITAR",
    //     codtarifadefecto: this.codTarifa_get?.toString(),
    //     desctoespecial: "0",
    //     cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
    //     totdesctos_extras: this.des_extra,
    //     totrecargos: 0,

    //     idpf_complemento: this.idpf_complemento_view,
    //     nroidpf_complemento: this.nroidpf_complemento_view?.toString(),
    //     tipo_complemento: this.tipo_complementopf_input,

    //     idFC_complementaria: "",
    //     nroidFC_complementaria: "",
    //     fechalimite_dosificacion: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
    //     idpf_solurgente: "0",
    //     noridpf_solurgente: "0",
    //   }
    // });
    // this.spinner.show();
    let array_cumple: any = [];

    array_cumple = [this.FormularioData.value].map((element) => ({
      ...element,
      cumple: element.cumple === 1 ? true : false
    }));

    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
      ...element,
      cumple: element.cumple === 1 ? true : false,
    }));

    
    

    let array_post = {
      tabladetalle: this.array_items_carrito_y_f4_catalogo,
      dvta: array_cumple[0],
    };
    

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTarifaPrincipal/"
    return this.api.create('/venta/transac/veproforma/getTarifaPrincipal/' + this.userConn, array_post)
      .subscribe({
        next: (datav) => {
          
          this.codTarifa_get = datav.codTarifa;
        },

        error: (err: any) => {
          
        },

        complete: () => { }
      })
  }

  // MAT-TAB Ultimas Proformas
  ultimasProformas() {
    this.spinner.show();
    this.abrirTabPorLabelFooter("Ultimas-Proformas");
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/ultimasProformas/";
    return this.api.getAll('/venta/transac/veproforma/ultimasProformas/' + this.userConn + "/" + this.codigo_cliente + "/" + this.codigo_cliente_catalogo_real + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.array_ultimas_proformas = datav;
          // 

          this.dataSourceUltimasProformas = new MatTableDataSource(this.array_ultimas_proformas);
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      })
  }
  //FIN MATTAB Ultimas Proformas

  // MAT-TAB Ultimas Proformas
  getDiasControl(item) {
    this.abrirTabPorLabelFooter("Ultimas Ventas Item 23 Dias");
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getDiasControl/";
    return this.api.getAll('/venta/transac/veproforma/getDiasControl/' + this.userConn + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          // 

          this.ultimasVentas23Dias(item, datav.diascontrol)
        },

        error: (err: any) => {
          

        },
        complete: () => { }
      })
  }

  ultimasVentas23Dias(item, dias) {
    this.spinner.show();
    this.abrirTabPorLabelFooter("Ultimas Ventas Item 23 Dias");
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/cargarPFVtaDias/";
    return this.api.getAll('/venta/transac/veproforma/cargarPFVtaDias/' + this.userConn + "/" + item + "/" + this.BD_storage + "/" + this.codigo_cliente_catalogo_real + "/" + dias)
      .subscribe({
        next: (datav) => {
          this.array_venta_item_23_dias = datav;
          // 

          this.dataSource__venta_23_dias = new MatTableDataSource(this.array_venta_item_23_dias);
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      })
  }
  //FIN MATTAB Ultimas Proformas

  //MAT-TAB Precios - Descuentos Especiales
  aplicarDescuentoEspecialSegunTipoPrecio() {
    this.spinner.show();
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/aplicar_desc_esp_seg_precio/";
    return this.api.create('/venta/transac/veproforma/aplicar_desc_esp_seg_precio/' + this.userConn, this.array_items_carrito_y_f4_catalogo)
      .subscribe({
        next: (datav) => {
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'DESCT. ESPECIAL S/TIPO PRECIO PROCESANDO ⚙️' })
          this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;

          //siempre sera uno
          this.orden_creciente = 1;
          // Agregar el número de orden a los objetos de datos
          this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
            element.orden = index + 1;
            element.nroitem = index + 1;
          });
          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

          if (datav.msgTitulo !== '' && datav.msgDetalle !== '') {
            this.modalDetalleObservaciones(datav.msgTitulo, datav.msgDetalle);
          }

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      });
  }
  //FIN MAT-TAB Precios - Descuentos Especiales

  borrarDesct() {
    this.spinner.show();
    this.array_items_carrito_y_f4_catalogo.map((element) => {
      element.coddescuento = 0
      this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'BORRANDO DESCUENTOS ⚙️ ' })
    });
    setTimeout(() => {
      this.spinner.hide();
    }, 50);
  }

  validarEmpaqueDescEspc() {
    this.spinner.show();
    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    if (this.disableSelect.value === false) {
      this.complementopf = 0;
    } else {
      this.complementopf = 1;
    }

    let array = {
      codempresa: this.BD_storage,
      usuario: this.usuarioLogueado,
      codalmacen: Number(this.agencia_logueado),
      codcliente_real: this.codigo_cliente_catalogo_real,
      codcliente: this.codigo_cliente,
      opcion_nivel: this.complementopf.toString(),
      desc_linea_seg_solicitud: this.desct_nivel_actual,
      codmoneda: this.moneda_get_catalogo,
      fecha: fecha,
      tabladetalle: this.array_items_carrito_y_f4_catalogo
    };
    

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/valEmpDescEsp/";
    return this.api.create('/venta/transac/veproforma/valEmpDescEsp/' + this.userConn, array)
      .subscribe({
        next: (datav) => {
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'VALIDAR EMPAQUE DESC. ESPECIAL ⚙️' })
          this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;

          //siempre sera uno
          this.orden_creciente = 1;

          // Agregar el número de orden a los objetos de datos
          this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
            element.orden = index + 1;
            element.nroitem = index + 1;
          });
          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

          if (datav.cumple === true) {
            this.modalDetalleObservaciones("CUMPLE", datav.msg);
          } else {
            this.modalDetalleObservaciones("NO CUMPLE", datav.msg);
          }

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          this.totabilizar();
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      });
  }

  dividirItemsParaCumplirCajaCerrada() {
    this.total = 0.00;
    this.subtotal = 0.00;

    // dejar tabla de descuentos sugeridos en blanco sino al darle click en aplica a todos aplica a los q no son xD
    this.dataSource_precios_desct = new MatTableDataSource([]);
    
    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    this.spinner.show();

    if (this.disableSelect.value === false) {
      this.complementopf = 0;
    } else {
      this.complementopf = 1;
    }

    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
      ...element,
      cumple: element.cumple === 1 ? true : false
    }));

    this.spinner.show();
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/aplicar_dividir_items/";
    return this.api.create('/venta/transac/veproforma/aplicar_dividir_items/' + this.userConn + "/" + this.BD_storage + "/" + this.usuarioLogueado
      + "/" + this.codigo_cliente + "/" + this.desct_nivel_actual + "/" + this.agencia_logueado + "/" + "false" + "/" + this.moneda_get_catalogo + "/" + fecha,
      this.array_items_carrito_y_f4_catalogo)
      .subscribe({
        next: (datav) => {
          

          if (datav.resp === "Los items ya cumplen con empaques, no se dividiran.") {
            this.modalDetalleObservaciones(datav.resp, " ");
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav?.resp })

            setTimeout(() => {
              this.spinner.hide();
            }, 500);
          } else {
            this.modalDetalleObservaciones(datav.alertMsg, " ");

            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'DIVIDIR ITEMS PARA CUMPLIR EMPAQUE CAJA CERRADA PROCESADO ⚙️' })
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav?.resp })

            this.array_items_carrito_y_f4_catalogo = datav?.tabladetalle;
            

            //siempre sera uno
            this.orden_creciente = 1;
            // Agregar el número de orden a los objetos de datos
            this.array_items_carrito_y_f4_catalogo?.forEach((element, index) => {
              element.orden = index + 1;
              element.nroitem = index + 1;
            });

            this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

            setTimeout(() => {
              this.spinner.hide();
            }, 500);
          }
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          this.totabilizar();
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      });
  }

  sugerirCantidadDescEspecial() {
    // 
    this.restablecerContadorClickSugerirCantidad();
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/sugerirCantDescEsp/";
    return this.api.create('/venta/transac/veproforma/sugerirCantDescEsp/' + this.userConn + "/" + this.cod_descuento_modal_codigo + "/" + this.agencia_logueado
      + "/" + this.BD_storage, this.array_items_carrito_y_f4_catalogo)
      .subscribe({
        next: (datav) => {
          // 

          if (datav.status === false) {
            this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: datav.resp });
            return;
          }

          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'VALIDAR EMPAQUE DESCT. ESPECIAL ⚙️' })
          this.array_items_carrito_y_f4_catalogo = [...datav.tabladetalle];

          //siempre sera uno
          this.orden_creciente = 1;

          // Agregar el número de orden a los objetos de datos
          this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
            element.orden = index + 1;
            element.nroitem = index + 1;
          });

          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
          
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: datav.msgDetalle });
          this.dataSource_precios_desct = new MatTableDataSource(datav.tabla_sugerencia);

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      });
  }

  //btn APLICAR de su tabla detalle por ITEM
  aplicarCantidadSugeridadParaCumplirEmpaque(detalle, item) {
    // 
    let item_select = detalle.filteredData.find((element1) => element1.coditem === item.coditem);

    
    // Actualizar la codtarifa en el elemento correspondiente en tu array de datos
    // Esto se ejecutará inmediatamente, pero se sobrescribirá cuando se reciba el nuevo valor del servicio
    if (item_select) {
      if (item_select.cantidad === item.cantidad && item.cantidad_sugerida_aplicable >= 0) {
        item_select.cantidad += item.cantidad_sugerida_aplicable;
        //item_select.cantidad_pedida = (item_select.cantidad_pedida + item.cantidad_sugerida_aplicable);
        // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
        
        this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

        this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
      }
      else {
        if (item_select.cantidad === item.cantidad) {
          item_select.cantidad -= item.cantidad_sugerida_aplicable;
          //item_select.cantidad_pedida = (item_select.cantidad_pedida - item.cantidad_sugerida_aplicable);
          // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
          
          this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
        }
      }
    } else {
      console.error("Elemento no encontrado en detalle.filteredData");
    }
  }

  //btn RESTAURAR de su tabla detalle por ITEM
  restaurarCantidadSugeridadParaCumplirEmpaque(detalle, item) {
    // 
    // 
    let item_select = detalle.filteredData.find((element1) => element1.coditem === item.coditem);

    // 

    // Actualizar la codtarifa en el elemento correspondiente en tu array de datos
    // Esto se ejecutará inmediatamente, pero se sobrescribirá cuando se reciba el nuevo valor del servicio
    if (item_select) {
      if (item_select.cantidad !== item.cantidad) {
        if (item.cantidad_sugerida_aplicable >= 0) {
          item_select.cantidad -= item.cantidad_sugerida_aplicable;
          //item_select.cantidad_pedida = (item_select.cantidad_pedida - item.cantidad_sugerida_aplicable);
          // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
          
          this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
        }
      } else {
        if (item_select.cantidad !== item.cantidad) {
          item_select.cantidad += item.cantidad_sugerida_aplicable;
          //item_select.cantidad_pedida = (item_select.cantidad_pedida + item.cantidad_sugerida_aplicable);
          // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
          // 
          this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
        }
      }
    } else {
      console.error("Elemento no encontrado en detalle.filteredData");
    }
  }

  // Contador de clics TODOS
  contadorClicks = 0;
  contadorClicksRestaur = 0;

  aplicarCantidadSugeridadParaCumplirEmpaqueATODO(carrito, sugerencia_array) {
    let carrito1 = carrito.filteredData;
    let array_sugerido = sugerencia_array.filteredData;
    this.contadorClicksRestaur = 0;

    

    if (this.contadorClicks <= 0) {
      carrito1.forEach((elementCarrito) => {
        array_sugerido.forEach((elementSugerido) => {
          if (elementCarrito.coditem === elementSugerido.coditem) {
            if (elementSugerido.obs !== 'No Cumple.' && elementSugerido.obs !== 'Cumple Empaque Cerrado.') {
              if (elementSugerido.cantidad_sugerida_aplicable >= 0) {
                elementCarrito.cantidad += elementSugerido.cantidad_sugerida_aplicable;
              } else {
                elementCarrito.cantidad -= elementSugerido.cantidad_sugerida_aplicable;
              }
            }
          }
        });
      });
      // Incrementar el contador de clics después de aplicar la suma
      this.contadorClicks += 1;
    }
    // 'carrito' ahora contiene todos los elementos con la cantidad sugerida aplicada
    
  }

  restablecerContadorClickSugerirCantidad() {
    this.contadorClicks = 0;
    this.contadorClicksRestaur = 0;
  }

  restaurarCantidadSugeridadParaCumplirEmpaqueATODO(carrito, sugerencia_array) {
    let carrito1 = carrito.filteredData;
    let array_sugerido = sugerencia_array.filteredData;
    this.contadorClicks = 0;

    // 

    if (this.contadorClicksRestaur <= 0) {
      carrito1.forEach((elementCarrito) => {
        // Verificar si el elemento ya ha sido sumado antes
        array_sugerido.forEach((elementSugerido) => {
          if (elementCarrito.coditem === elementSugerido.coditem) {
            if (elementSugerido.obs !== 'No Cumple.' && elementSugerido.obs !== 'Cumple Empaque Cerrado.') {
              if (elementSugerido.cantidad_sugerida_aplicable >= 0) {
                elementCarrito.cantidad -= elementSugerido.cantidad_sugerida_aplicable;
              } else {
                elementCarrito.cantidad += elementSugerido.cantidad_sugerida_aplicable;
              }
            }
          }
        });
      });
      // Incrementar el contador de clics después de aplicar la suma
      this.contadorClicksRestaur += 1;
    }

    // 'carrito' ahora contiene todos los elementos con la cantidad sugerida aplicada
    
  }
  // FIN MAT-TAB Precios - Descuentos Especiales


  // const zip = new JSZip();
  // const zipContent = await this.readFile(file);
  // const zipData = await zip.loadAsync(zipContent);
  // 
  // this.extractedFiles = [];


  // zipData.forEach((relativePath, zipEntry) => {
  //   zipEntry.async("string").then(content => {
  //     this.extractedFiles.push({ name: relativePath, content });
  //     //this.modalDetalleObservaciones(relativePath, content);
  //     
  //     this.convertXmlToJson()
  //   });
  // });


  //Importar a EXCEL
  async onFileChange(event: any) {
    const file = event.target.files[0];
    

    if (file && file.type === 'application/x-zip-compressed') {
      // Crear un FormData y agregar el archivo
      const formData = new FormData();
      formData.append('file', file, file.name);

      this.api.cargarArchivo('/venta/transac/veproforma/importProfinJson/', formData)
        .subscribe({
          next: (datav) => {
            
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'ARCHIVO ZIP CARGADO EXITOSAMENTE ✅ ' })
            this.imprimir_zip_importado(datav);

            setTimeout(() => {
              this.spinner.hide();
            }, 50);
          },
          error: (err: any) => {
            
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ERROR AL CARGAR EL ARCHIVO ❌' });
            setTimeout(() => {
              this.spinner.hide();
            }, 50);
          },
          complete: () => {
            setTimeout(() => {
              this.spinner.hide();
            }, 50);
          }
        });
    } else {
      console.error('Please upload a valid ZIP file.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'SOLO SELECCIONAR FORMATO .ZIP ❌' });
    }
  }






  isZipFile(file: File): boolean {
    return file.name.endsWith('.zip');
  }

  readFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = error => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }
  //FIN Importar a EXCEL




  // Exportar a EXCEL
  exportProformaZIP(cod_proforma: any) {
    const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: {
        mensaje_dialog: "Se Grabo La Proforma" + this.id_tipo_view_get_codigo + "-" + this.id_proforma_numero_id
          + " con Exito. ¿Desea Exportar el Documento?"
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        

        this.api.descargarArchivo('/venta/transac/veproforma/exportProforma/' + this.userConn + "/" + cod_proforma + "/" + this.codigo_cliente, { responseType: 'arraybuffer' })
          .subscribe({
            next: (datav: ArrayBuffer) => {
              // 
              this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'DESCARGA EN PROCESO' })

              // Convertir ArrayBuffer a Blob
              const blob = new Blob([datav], { type: 'application/zip' });
              const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');  // Formato: YYYYMMDDTHHMMSS

              // Crear el objeto URL para el Blob recibido
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = timestamp + "-" + this.id_tipo_view_get_codigo + "-" + this.id_proforma_numero_id + '.zip';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);

              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            },

            error: (err: any) => {
              
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            },

            complete: () => {
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            }
          });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO SE DESCARGO' });
      }
    });
  }

  detalleProformaCarritoTOExcel() {
    

    //aca mapear el array del carrito para que solo esten con las columnas necesarias
    const nombre_archivo = this.id_tipo_view_get_codigo + "_" + this.id_proforma_numero_id;
    const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: "¿ Desea Exportar El Detalle Del Documento a Excel ?" },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        // Convertir los datos a una hoja de cálculo
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.array_items_carrito_y_f4_catalogo);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

        // Generar el archivo Excel
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Guardar el archivo
        this.saveAsExcelFile(excelBuffer, nombre_archivo);
      } else {
        

      }
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const cod_clien = this.codigo_cliente;
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');  // Formato: YYYYMMDDTHHMMSS
    const fullFileName = `${timestamp}_${fileName}_${cod_clien}.xlsx`;

    saveAs(data, fullFileName);
  }

  //FIN Exportar a EXCEL






  onRowSelect(event: any) {
    
    this.item_obj_seleccionado = event.data;

    this.itemDataAll(event.data.coditem);

    this.total = 0.00;
    this.subtotal = 0.00;
    this.iva = 0.00;
    this.des_extra = 0.00;
    this.recargos = 0.00;
  }

  onRowSelectForDelete() {
    

    // Filtrar el array para eliminar los elementos que están en el array de elementos seleccionados
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.filter(item => {
      return !this.selectedProducts.some(selectedItem =>
        selectedItem.orden === item.orden && selectedItem.coditem === item.coditem);
    });

    // Actualizar el número de orden de los objetos de datos restantes
    this.array_items_carrito_y_f4_catalogo?.forEach((element, index) => {
      element.orden = index + 1;
      element.nroitem = index + 1;
    });

    // Actualizar el origen de datos del MatTableDataSource
    this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

    // Limpiar el array de productos seleccionados
    this.selectedProducts = [];
  }

  onRowUnselect(event: any) {
    
    this.updateSelectedProducts();
  }

  updateSelectedProducts() {
    
  }


  valor_desct_nivel: any = [];
  tarifaPrincipal_value: any;
  tipo_desct_nivel: any;

  aplicarDescuentoNivel() {
    let array_descuentos_nivel = {
      cmbtipo_desc_nivel: this.tipo_desct_nivel === undefined ? "" : this.tipo_desct_nivel,
      fechaProf: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd").toString(),
      codtarifa_main: this.tarifaPrincipal_value,
      codcliente: this.codigo_cliente.toString(),
      codcliente_real: this.codigo_cliente_catalogo_real.toString(),
      codclientedescripcion: this.nombre_cliente_catalogo_real
    };

    
    let mesagge: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/aplicarDescuentoCliente/";
    return this.api.create('/venta/transac/veproforma/aplicarDescuentoCliente/' + this.userConn + "/" + this.usuarioLogueado, array_descuentos_nivel)
      .subscribe({
        next: (datav) => {
          

          if (datav.resp) {
            this.messageService.add({ severity: 'info', summary: 'Informacion', detail: datav.resp });
          }

          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      });
  }

  getTipoDescNivel() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getTipoDescNivel/";
    return this.api.getAll('/venta/transac/veproforma/getTipoDescNivel/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.valor_desct_nivel = datav;
          // 

          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      })
  }

  // MAT-TAB Ultimas Proformas
  getPrecioMayorEnDetalle() {
    let array_cumple: any = [];

    array_cumple = [this.FormularioData.value].map((element) => ({
      ...element,
      cumple: element.cumple === 1 ? true : false
    }));

    let array_post = {
      tabladetalle: this.array_items_carrito_y_f4_catalogo,
      dvta: array_cumple[0],
    };

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTarifaPrincipal/"
    return this.api.create('/venta/transac/veproforma/getTarifaPrincipal/' + this.userConn, array_post)
      .subscribe({
        next: (datav) => {
          this.tarifaPrincipal_value = datav.codTarifa;
          
        },

        error: (err: any) => {
          
        },

        complete: () => { }
      })
  }
  // FIN MAT-TAB Ultimas Proformas








































































  async quitarDescDeposito23() {
    
    const result = await this.openConfirmationDialog(`¿Esta seguro de quitar el Desct 23 ?`);

    if (result) {
      this.spinner.show();
      let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/reqstQuitarDescDeposito/"
      return this.api.create('/venta/transac/veproforma/reqstQuitarDescDeposito/' + this.userConn + "/" + this.BD_storage, this.array_de_descuentos_ya_agregados)
        .subscribe({
          next: (datav) => {
            this.tarifaPrincipal = datav;
            
            this.spinner.hide();

            this.total = 0
            this.subtotal = 0;
            this.des_extra = 0;
            this.recargos = 0;
          },

          error: (err: any) => {
            
            this.spinner.hide();
          },

          complete: () => {
            this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados.filter(desct =>
              desct.coddesextra !== 23,
            );
            this.spinner.hide();
            
          }
        })
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'SE CANCELO LA ACCION' });
    }
  }

  eliminarItemTabla(orden, coditem) {
    // Filtrar el array para eliminar el elemento con el número de orden dado y el código de ítem
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.filter(item => {
      return item.orden !== orden || item.coditem !== coditem;
    });

    // Agregar el número de orden a los objetos de datos
    this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
      element.orden = index + 1;
      element.nroitem = index + 1;
    });

    this.totabilizar();

    // Actualizar el origen de datos del MatTableDataSource
    this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
  }

  onPaste(event: any) {
    event.preventDefault();
    // También puedes mostrar un mensaje al usuario indicando que el pegado está bloqueado
    alert("EVENTO BLOQUEADO, NO PEGAR");
  }

  modalTipoID(): void {
    this.dialog.open(ModalIdtipoComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { almacen: "almacen" }
    });
  }

  modalCatalogoMoneda(): void {
    this.dialog.open(MonedaCatalogoComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalVendedor(): void {
    this.dialog.open(ModalVendedorComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        ventana: "ventana"
      }
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

  modalPrecioVentaDetalle(): void {
    
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { detalle: true }
    });
  }

  modalDescuentoEspecial(): void {
    this.dialog.open(ModalDescuentosComponent, {
      width: 'auto',
      height: 'auto',
      data: { detalle: false }
    });
  }

  modalDescuentoEspecialDetalle(): void {
    
    this.dialog.open(ModalDescuentosComponent, {
      width: 'auto',
      height: 'auto',
      data: { detalle: true }
    });
  }

  modalMatrizProductos(): void {
    // Realizamos todas las validaciones
    if (this.moneda_get_catalogo === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE MONEDA",
        }
      });
      return; // Detenemos la ejecución de la función si la validación falla
    }

    if (this.codigo_cliente === undefined || this.codigo_cliente === '' || this.razon_social === undefined || this.razon_social === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE CLIENTE EN PROFORMA",
        }
      });
      return;
    }

    if (this.almacn_parame_usuario === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE ALMACEN",
        }
      });
      return;
    }

    if (this.desct_nivel_actual === undefined) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE NIVEL DE DESCT.",
        }
      });
      return;
    }
    let a = this.array_items_carrito_y_f4_catalogo.length
    
    // Si todas las validaciones pasan, abrimos el MatrizItemsComponent
    this.dialog.open(MatrizItemsComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: {
        //esta info tarifa ya esta en la matriz xd
        // tarifa: this.cod_precio_venta_modal_codigo,
        descuento: this.cod_descuento_modal_codigo,
        codcliente: this.codigo_cliente,
        codcliente_real: this.codigo_cliente_catalogo_real,
        codalmacen: this.agencia_logueado,
        // ACA ES IMPORTANTE PASARLO A STRING, PORQ LA BD ESPERA STRING NO BOOLEAN habilitar_desct_sgn_solicitud
        // ESTA VARIABLE ESTA EN EL TAB DESCUENTOS DE LINEA DE SOLICITUD
        desc_linea_seg_solicitud: this.habilitar_desct_sgn_solicitud === false ? "false" : "true",
        codmoneda: this.moneda_get_catalogo,
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        items: this.array_items_carrito_y_f4_catalogo,
        descuento_nivel: this.desct_nivel_actual,
        tamanio_carrito_compras: a + 1,
      }
    });
  }

  modalCatalogoProductos(): void {
    this.dialog.open(ModalItemsComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        tarifa: this.cod_precio_venta_modal_codigo,
        descuento: this.cod_descuento_modal_codigo,
        codcliente: this.codigo_cliente,
        codalmacen: this.agencia_logueado,
        desc_linea_seg_solicitud: "",
        codmoneda: this.moneda_get_catalogo,
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        //itemss: this.item_seleccionados_catalogo_matriz_sin_procesar,
        descuento_nivel: this.desct_nivel_actual,
      },
    });
  }

  modalClientes(): void {
    this.dialog.open(ModalClienteComponent, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        ventana: "ventana_catalogo"
      }
    });
  }

  modalClientesparaReferencia(): void {
    this.dialog.open(ModalClienteComponent, {
      width: '700px',
      height: 'auto',
      data: {
        cliente_referencia_proforma: true,
        ventana: "ventana_cliente_referencia"
      }
    });
  }

  modalClientesInfo(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ModalClienteInfoComponent, {
      width: 'auto',
      height: '94vh',
      disableClose: true,
      enterAnimationDuration,
      exitAnimationDuration,
      data: { codigo_cliente: this.codigo_cliente },
    });
  }

  modalClientesDireccion(cod_cliente): void {
    this.dialog.open(ModalClienteDireccionComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { cod_cliente: cod_cliente },
    });
  }

  modalSaldos(cod_almacen, posicion_fija): void {
    this.dialog.open(ModalSaldosComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cod_almacen: cod_almacen,
        cod_item: this.item_seleccionados_catalogo_matriz_codigo,
        posicion_fija: posicion_fija,
        id_proforma: this.id_tipo_view_get_codigo,
        numero_id: this.id_proforma_numero_id
      },
    });
  }

  modalVerificarCreditoDisponible(): void {
    if (this.tipopago === '' || this.tipopago === "CONTADO") {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "EL TIPO DE PAGO EN LA PROFORMA TIENE QUE SER CREDITO",
        }
      });
      return;
    }

    if (this.total === 0) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "EL TOTAL TIENE QUE SER DISTINTO A 0",
        }
      });
      return;
    }

    if (this.moneda_get_catalogo === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE MONEDA",
        }
      });
      return;
    }

    if (this.codigo_cliente === '' && this.codigo_cliente === undefined) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "INGRESE CODIGO DE USUARIO EN PROFORMA",
        }
      });
      return;
    }

    this.dialog.open(VerificarCreditoDisponibleComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cod_cliente: this.codigo_cliente,
        cod_moneda: this.moneda_get_catalogo,
        totalProf: this.total,
        tipoPago: this.tipopago,
        cliente_real: this.codigo_cliente_catalogo_real,
        codmoneda: this.moneda_get_catalogo,
        moneda: this.moneda_get,
        id_prof: this.id_tipo_view_get_codigo,
        numero_id_prof: this.id_proforma_numero_id,
      }
    });
  }

  modalAnticiposProforma(): void {
    // Validaciones necesarias:
    // codcliente
    // tipopago === contado
    // total != 0

    if (this.codigo_cliente === '' && this.codigo_cliente === undefined) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "INGRESE CODIGO DE USUARIO EN PROFORMA",
        }
      });
      return;
    }

    if (this.tipopago === 1 || this.tipopago === undefined) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "EL TIPO DE PAGO EN LA PROFORMA TIENE QUE SER CONTADO",
        }
      });
      return;
    }

    if (this.total === 0) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "EL TOTAL TIENE QUE SER DISTINTO A 0",
        }
      });
      return;
    }

    this.dialog.open(AnticiposProformaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cod_cliente: this.codigo_cliente,
        nombre_cliente: this.razon_social,
        nit: this.nit_cliente,
        cod_moneda: this.moneda_get_catalogo,
        totalProf: this.total,
        tipoPago: this.tipopago,
        vendedor: this.cod_vendedor_cliente,
        id: this.id_tipo_view_get_codigo,
        numero_id: this.id_proforma_numero_id,
        cod_cliente_real: this.cliente_catalogo_real,
        total: this.total,
        tdc: this.tipo_cambio_moneda_catalogo,
        array_tabla_anticipos: this.tabla_anticipos,
        nombre_ventana: this.nombre_ventana,
        cod_proforma: this.codigo_proforma,
      },
    });
  }

  tranferirProformaModal() {
    this.dialog.open(ModalTransfeProformaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  estadoPagoClientes() {
    this.dialog.open(ModalEstadoPagoClienteComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        // descuento_nivel: this.desct_nivel_actual,
        cod_cliente: this.codigo_cliente,
        // cod_almacen: this.agencia_logueado,
        // cod_moneda: this.moneda_get_catalogo,
        // desc_linea: this.habilitar_desct_sgn_solicitud,
        // items: this.array_items_carrito_y_f4_catalogo,
        // fecha: this.fecha_actual
      },
    });
  }

  //SECCION DE TOTALES
  modalSubTotal() {
    this.dialog.open(ModalSubTotalComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        descuento_nivel: this.desct_nivel_actual,
        cod_cliente: this.codigo_cliente,
        cod_almacen: this.agencia_logueado,
        cod_moneda: this.moneda_get_catalogo,
        desc_linea: this.habilitar_desct_sgn_solicitud,
        items: this.array_items_carrito_y_f4_catalogo,
        fecha: this.fecha_actual
      },
    });
  }

  modalRecargos() {
    let a = this.recargo_de_recargos.length;
    this.dialog.open(ModalRecargosComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cabecera: this.FormularioData.value,
        items: this.array_items_carrito_y_f4_catalogo,
        recargos: this.recargo_de_recargos,
        des_extra_del_total: this.des_extra,
        cod_moneda: this.moneda_get_catalogo,
        tamanio_recargos: a,
        cliente_real: this.codigo_cliente_catalogo_real
      },
    });
  }

  modalDescuentosTotales(): void {
    if (this.codigo_cliente === undefined || this.codigo_cliente === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE CLIENTE EN PROFORMA",
        }
      });
      return;
    }

    if (this.array_items_carrito_y_f4_catalogo.length === 0) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "NO HAY ITEM'S EN PROFORMA",
        }
      });
      return;
    }

    if (this.tipopago === undefined || this.tipopago === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE TIPO PAGO EN PROFORMA",
        }
      });
      return;
    }

    // if (this.tipopago === 0) {
    //   this.tipopago = 0;
    // } else {
    //   this.tipopago = 1;
    // }

    this.submitted = true;
    if (this.FormularioData.valid) {
      this.dialog.open(ModalDesctExtrasComponent, {
        width: 'auto',
        height: 'auto',
        data: {
          cabecera: this.FormularioData.value,
          desct: this.cod_descuento_total,
          contra_entrega: this.contra_entrega,
          items: this.array_items_carrito_y_f4_catalogo,
          recargos_del_total: this.recargos,
          cod_moneda: this.moneda_get_catalogo,
          recargos_array: this.recargo_de_recargos,
          array_de_descuentos_ya_agregados_a_modal: this.array_de_descuentos_ya_agregados,
          cmtipo_complementopf: this.tipo_complementopf_input,
          cliente_real: this.codigo_cliente_catalogo_real,
          detalleAnticipos: this.tabla_anticipos === undefined ? [] : this.tabla_anticipos,
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'REVISE FORMULARIO' });
    }
  }

  modalIva() {
    
    this.dialog.open(ModalIvaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { tablaIva: this.tablaIva },
    });
  }

  modalClienteEtiqueta(direccion): void {
    this.dialog.open(ModalEtiquetaComponent, {
      width: '505px',
      height: 'auto',
      disableClose: true,
      data: {
        // cod_cliente_proforma: cod_cliente,
        cod_cliente_proforma1: this.codigo_cliente,
        id_proforma: this.id_tipo_view_get_codigo,
        numero_id: this.id_proforma_numero_id,
        nom_cliente: this.nombre_cliente_catalogo_real,
        desc_linea: this.habilitar_desct_sgn_solicitud,
        id_sol_desct: this.id_solicitud_desct,
        nro_id_sol_desct: this.numero_id_solicitud_desct,
        direccion: direccion,
        latitud: this.latitud_cliente,
        longitud: this.longitud_cliente,
        linea2: this.linea2,
        cliente_real: this.codigo_cliente_catalogo_real === undefined ? this.codigo_cliente_catalogo_real : this.codigo_cliente_catalogo_real,
        etiqueta_elegida: this.etiqueta_get_modal_etiqueta,
      },
    });
  }

  async limpiarEtiqueta() {
    const result = await this.openConfirmationDialog(`¿Esta Segur@ de limpiar la etiqueta?`);
    if (result) {
      this.etiqueta_get_modal_etiqueta = [];
      this.direccion = "";
      this.latitud_cliente = "";
      this.longitud_cliente = "";

      this.total = 0;
      this.subtotal = 0;
      this.des_extra = 0;
      this.recargos = 0;

      this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'ETIQUETA LIMPIADA' })
    } else {
      this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'ETIQUETA NO LIMPIADA' })
    }
  }
  //FIN SECCION TOTALES

  //seccion mat-tab Resultado de Validacion
  resolverValidacion() {
    const dialogRef = this.dialog.open(PermisosEspecialesParametrosComponent, {
      width: '600px',
      height: 'auto',
      data: {
        dataA: '00068',
        dataB: 140,
        dataPermiso: "122 - TRANSFERIR PROFORMA",
        dataCodigoPermiso: "122",
        //abrir: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      
      if (result) {
        this.tranferirProformaModal();
        //this.log_module.guardarLog(ventana, detalle, tipo);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '! CANCELADO !' });
      }
    });
  }

  verificarDepositoPendientesDescuentoCliente() {
    if (this.codigo_cliente === undefined || this.codigo_cliente === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE CLIENTE EN PROFORMA",
        }
      });
      return;
    }

    this.dialog.open(ModalDesctDepositoClienteComponent, {
      width: '1325px',
      height: 'auto',
      data: {
        cod_cliente: this.codigo_cliente,
        nombre_cliente: this.razon_social,
        cliente_real: this.codigo_cliente_catalogo_real === undefined ? this.codigo_cliente : this.codigo_cliente_catalogo_real,
        nit: this.nit_cliente,
      },
    });
  }

  modalBtnImpresiones(grabar_aprobar: boolean) {
    this.guardarDataImpresion(this.codigo_proforma, grabar_aprobar);
    this.dialog.open(ModalBotonesImpresionComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalBtnImpresionesAgarrandoValorAprobada() {
    this.guardarDataImpresion(this.codigo_proforma, this.aprobada);
    this.dialog.open(ModalBotonesImpresionComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  guardarDataImpresion(codigo_proforma_submitdata, grabar_aprobar: boolean) {
    let data = [{
      codigo_proforma: codigo_proforma_submitdata,
      cod_cliente: this.codigo_cliente,
      cod_cliente_real: this.codigo_cliente_catalogo_real,
      cmbestado_contra_entrega: this.contra_entrega,
      estado_contra_entrega: this.empty(this.estado_contra_entrega_input) ? " " : this.estado_contra_entrega_input,
      codigo_vendedor: this.cod_vendedor_cliente,
      grabar_aprobar: grabar_aprobar,
    }];

    

    sessionStorage.setItem('data_impresion', JSON.stringify(data));
  }

  empty(value: any): boolean {
    return value === null || value === undefined || value === "";
  }

  modalSolicitudUrgente() {
    this.dialog.open(ModalSolicitarUrgenteComponent, {
      disableClose: true,
      width: 'auto',
      height: 'auto',
      data: {},
    });
  }

  modalBuscadorAvanzado() {
    this.dialog.open(BuscadorAvanzadoComponent, {
      disableClose: true,
      width: '820px',
      height: 'auto',
      data: {
        ventana: "modificar_proforma"
      },
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
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

  habilitarComplementarProforma() {
    
    // this.disableSelectComplemetarProforma = true;
  }

  modalMatrizClasica(): void {
    // Realizamos todas las validaciones
    if (this.moneda_get_catalogo === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE MONEDA",
        }
      });
      return; // Detenemos la ejecución de la función si la validación falla
    }

    if (this.codigo_cliente === undefined || this.codigo_cliente === '' || this.razon_social === undefined || this.razon_social === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE CLIENTE EN PROFORMA",
        }
      });
      return;
    }

    if (this.almacn_parame_usuario === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE ALMACEN",
        }
      });
      return;
    }

    if (this.desct_nivel_actual === undefined) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE NIVEL DE DESCT.",
        }
      });
      return;
    }

    
    // Si todas las validaciones pasan, abrimos el MatrizItemsComponent
    this.dialog.open(MatrizItemsClasicaComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: {
        //esta info tarifa ya esta en la matriz xd
        // tarifa: this.cod_precio_venta_modal_codigo,
        descuento: this.cod_descuento_modal,
        codcliente: this.codigo_cliente,
        codcliente_real: this.codigo_cliente_catalogo_real,
        codalmacen: this.agencia_logueado,
        // ACA ES IMPORTANTE PASARLO A STRING, PORQ LA BD ESPERA STRING NO BOOLEAN habilitar_desct_sgn_solicitud
        // ESTA VARIABLE ESTA EN EL TAB DESCUENTOS DE LINEA DE SOLICITUD
        desc_linea_seg_solicitud: this.habilitar_desct_sgn_solicitud === false ? "false" : "true",
        codmoneda: this.moneda_get_catalogo,
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        items: this.array_items_carrito_y_f4_catalogo,
        descuento_nivel: this.desct_nivel_actual,
        tamanio_carrito_compras: this.array_items_carrito_y_f4_catalogo.length,
        // tamanio_carrito_compras: ultimo_valor?.nroitem,

        id_proforma: this.id_tipo_view_get_codigo,
        num_id_proforma: this.id_proforma_numero_id,
      }
    });
  }

  modalMatrizLista(): void {
    // Realizamos todas las validaciones
    if (this.moneda_get_catalogo === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE MONEDA",
        }
      });
      return; // Detenemos la ejecución de la función si la validación falla
    }

    if (this.codigo_cliente === undefined || this.codigo_cliente === '' || this.razon_social === undefined || this.razon_social === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE CLIENTE EN PROFORMA",
        }
      });
      return;
    }

    if (this.almacn_parame_usuario === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE ALMACEN",
        }
      });
      return;
    }

    if (this.desct_nivel_actual === undefined) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE NIVEL DE DESCT.",
        }
      });
      return;
    }

    
    // Si todas las validaciones pasan, abrimos el MatrizItemsComponent
    this.dialog.open(MatrizItemsListaComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: {
        //esta info tarifa ya esta en la matriz xd
        // tarifa: this.cod_precio_venta_modal_codigo,
        descuento: this.cod_descuento_modal,
        codcliente: this.codigo_cliente,
        codcliente_real: this.codigo_cliente_catalogo_real,
        codalmacen: this.agencia_logueado,
        // ACA ES IMPORTANTE PASARLO A STRING, PORQ LA BD ESPERA STRING NO BOOLEAN habilitar_desct_sgn_solicitud
        // ESTA VARIABLE ESTA EN EL TAB DESCUENTOS DE LINEA DE SOLICITUD
        desc_linea_seg_solicitud: this.habilitar_desct_sgn_solicitud === false ? "false" : "true",
        codmoneda: this.moneda_get_catalogo,
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        items: this.array_items_carrito_y_f4_catalogo,
        descuento_nivel: this.desct_nivel_actual,
        tamanio_carrito_compras: this.array_items_carrito_y_f4_catalogo.length,
        // tamanio_carrito_compras: ultimo_valor?.nroitem,

        id_proforma: this.id_tipo_view_get_codigo,
        num_id_proforma: this.id_proforma_numero_id,
      }
    });
  }
















  modalClaveDatoADatoB(dataA, dataB, permiso, codpermiso) {
    const dialogRef = this.dialog.open(PermisosEspecialesParametrosComponent, {
      width: '450px',
      height: 'auto',
      data: {
        dataA: dataA,
        dataB: dataB,
        dataPermiso: permiso,
        dataCodigoPermiso: codpermiso,
      },
    });

    return firstValueFrom(dialogRef.afterClosed());
  }







  resolverValidacionEnValidar(datoA, datoB, msj_validacion, cod_servicio, element) {
    //En este array ya estan filtrados las validaciones con observacion this.validacion_no_validos.
    
    this.array_original_de_validaciones_copied = this.validacion_no_validos;
    this.validacion_post
    const dialogRef = this.dialog.open(PermisosEspecialesParametrosComponent, {
      width: '450px',
      height: 'auto',
      data: {
        dataA: datoA,
        dataB: datoB,
        dataPermiso: msj_validacion,
        dataCodigoPermiso: cod_servicio,
      },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        //let a = this.validacion_no_validos.filter(i => i.Codigo !== element.Codigo);
        // Verificar si el elemento ya está presente en el array
        const indice_NO_VALIDAS_RESUELTAS = this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.findIndex(item => item.codigo === element.codigo);
        // Si el índice es -1, significa que el elemento no está en el array y se puede agregar
        if (indice_NO_VALIDAS_RESUELTAS === -1) {
          // Agregar el elemento seleccionado al array de NO VALIDAS PERO YA RESUELTAS 
          this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.push(element);
        } else {
          // El elemento ya está presente en el array
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "EL Codigo" + element.Codigo + "ya se encuentra resuelto" });
          
          //si ya esta presente eliminarlo de validaciones NO VALIDAS
        }

        // Filtrar los elementos de array1 que no están presentes en array2
        //ACA LO SACA DEL ARRAY EL ELEMENTO RESUELTO
        const elementosDiferentes = this.validacion_no_validos.filter(item1 => !this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.find(item2 => item1.codigo === item2.codigo));

        //UNA VEZ QUE ESTE APROBADO POR LA CONTRASEÑA, MAPEAR LA COPIA DEL ARRAY ORIGINAL
        //(ORIGINAL)this.validacion_post, (COPIA)array_original_de_validaciones_copied 
        //cambiando los valores de Valido NO a Valido SI y el valor de ClaveServicio a "AUTORIZADO" 
        //en caso que se cancele colocar "NO AUTORIZADO",
        //pero solo del elemento seleccionado no de cada item del array

        // Encontrar el índice del elemento seleccionado en el array original
        const indice = this.array_original_de_validaciones_copied.findIndex(item => item.codigo === element.codigo);
        if (indice !== -1) {
          // Crear una copia del array original
          const nuevoArray = [...this.array_original_de_validaciones_copied];
          // Reemplazar el elemento modificado en su posición original en el nuevo array
          //nuevoArray[indice] = element;
          nuevoArray[indice].claveServicio = "AUTORIZADO";
          nuevoArray[indice].valido = "SI";
          // Actualizar el array original con el nuevo array que contiene el elemento modificado
          this.array_original_de_validaciones_copied = nuevoArray;
        }

        this.dataSource_validacion = new MatTableDataSource(elementosDiferentes);

        
        
        
        

        // al array de validacionesOriginal asignarle el array de validaciones q ya esta resueltas array_original_de_validaciones_NO_VALIDAS_RESUELTAS
        this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.forEach(validacionResuelta => {
          // Busca el elemento en el array original por el campo 'Codigo'
          const validacionOriginal = this.validacion_post.find(validacion => validacion.codigo === validacionResuelta.codigo);

          // Si encuentra una coincidencia, actualiza los datos
          if (validacionOriginal) {
            Object.assign(validacionOriginal, validacionResuelta);  // Mapea los campos del resuelto al original
             // Mostrar el elemento actualizado
          }
        });

        // Después de todo el mapeo, mostrar el array original completo
        
        return this.validacionesNOValidosFilterToggle();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡CANCELADO!' });
        // Encontrar el índice del elemento seleccionado en el array original
        const indice = this.array_original_de_validaciones_copied.findIndex(item => item.codigo === element.codigo);
        if (indice !== -1) {
          // Crear una copia del array original
          const nuevoArray = [...this.array_original_de_validaciones_copied];
          // Reemplazar el elemento modificado en su posición original en el nuevo array
          //nuevoArray[indice] = element;
          nuevoArray[indice].claveServicio = "NO AUTORIZADO";
          nuevoArray[indice].valido = "NO";
          // Actualizar el array original con el nuevo array que contiene el elemento modificado
          this.array_original_de_validaciones_copied = nuevoArray;
        }
        return this.validacionesNOValidosFilterToggle();
      }
    });
  }

  resolverValidacionEnValidarMensaje(element) {
    this.array_original_de_validaciones_copied = this.validacion_no_validos;

    const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: `${element.observacion}` + "¿Desea Continuar?" },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        //let a = this.validacion_no_validos.filter(i => i.Codigo !== element.Codigo);

        // Verificar si el elemento ya está presente en el array
        const indice_NO_VALIDAS_RESUELTAS = this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.findIndex(item => item.codigo === element.codigo);

        // Si el índice es -1, significa que el elemento no está en el array y se puede agregar
        if (indice_NO_VALIDAS_RESUELTAS === -1) {
          // Agregar el elemento seleccionado al array de NO VALIDAS PERO YA RESUELTAS 
          this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.push(element);
        } else {
          // El elemento ya está presente en el array
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "EL Codigo" + element.codigo + "ya se encuentra resuelto" });
          
        }
        // Filtrar los elementos de array1 que no están presentes en array2
        const elementosDiferentes = this.validacion_no_validos.filter(item1 => !this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.find(item2 => item1.codigo === item2.codigo));

        //UNA VEZ QUE ESTE APROBADO POR LA CONTRASEÑA, MAPEAR LA COPIA DEL ARRAY ORIGINAL
        //(ORIGINAL)this.validacion_post, (COPIA)array_original_de_validaciones_copied 
        //cambiando los valores de Valido NO a Valido SI y el valor de ClaveServicio a "AUTORIZADO" 
        //en caso que se cancele colocar "NO AUTORIZADO",
        //pero solo del elemento seleccionado no de cada item del array

        // Encontrar el índice del elemento seleccionado en el array original
        const indice = this.array_original_de_validaciones_copied.findIndex(item => item.codigo === element.codigo);
        if (indice !== -1) {
          // Crear una copia del array original
          const nuevoArray = [...this.array_original_de_validaciones_copied];
          // Reemplazar el elemento modificado en su posición original en el nuevo array
          //nuevoArray[indice] = element;
          nuevoArray[indice].claveServicio = "AUTORIZADO";
          nuevoArray[indice].valido = "SI";
          // Actualizar el array original con el nuevo array que contiene el elemento modificado
          this.array_original_de_validaciones_copied = nuevoArray;
        }

        this.dataSource_validacion = new MatTableDataSource(elementosDiferentes);

        
        
        
        

        // al array de validacionesOriginal asignarle el array de validaciones q ya esta resueltas array_original_de_validaciones_NO_VALIDAS_RESUELTAS
        this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.forEach(validacionResuelta => {
          // Busca el elemento en el array original por el campo 'Codigo'
          const validacionOriginal = this.validacion_post.find(validacion => validacion.codigo === validacionResuelta.codigo);

          // Si encuentra una coincidencia, actualiza los datos
          if (validacionOriginal) {
            Object.assign(validacionOriginal, validacionResuelta);  // Mapea los campos del resuelto al original
             // Mostrar el elemento actualizado
          }
        });

        // Después de todo el mapeo, mostrar el array original completo
        
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡CANCELADO! ' });
        // Encontrar el índice del elemento seleccionado en el array original
        const indice = this.array_original_de_validaciones_copied.findIndex(item => item.codigo === element.codigo);
        if (indice !== -1) {
          // Crear una copia del array original
          const nuevoArray = [...this.array_original_de_validaciones_copied];
          // Reemplazar el elemento modificado en su posición original en el nuevo array
          //nuevoArray[indice] = element;
          nuevoArray[indice].claveServicio = "NO AUTORIZADO";
          nuevoArray[indice].valido = "NO";
          // Actualizar el array original con el nuevo array que contiene el elemento modificado
          this.array_original_de_validaciones_copied = nuevoArray;
        }
      }
    });
  }

  modalDetalleObservaciones(obs, obsDetalle) {
    this.dialog.open(ModalDetalleObserValidacionComponent, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        obs_titulo: obs,
        obs_contenido: obsDetalle,
      },
    });
  }

  changeValueCheck(type: string) {
    if (type === 'precio') {
      if (this.calcularEmpaquePorPrecio) {
        this.calcularEmpaquePorDescuento = false;
      }
    } else if (type === 'descuento') {
      if (this.calcularEmpaquePorDescuento) {
        this.calcularEmpaquePorPrecio = false;
      }
    }
  }

  alMenu() {
    const dialogRefLimpiara = this.dialog.open(DialogConfirmActualizarComponent, {
      width: 'auto',
      height: 'auto',
      data: { mensaje_dialog: "¿ ESTA SEGUR@ DE SALIR AL MENU PRINCIPAL ?" },
      disableClose: true,
    });


    dialogRefLimpiara.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        this.router.navigateByUrl('');
      }
    });
  }

  eventoBackspaceLimpiarCliente() {
    this.codigo_cliente = "";
    this.codigo_cliente_catalogo_real = "";
    this.nombre_comercial_cliente = "";
    this.nombre_factura = "";
    this.razon_social = "";
    this.complemento_ci = ""
    this.nombre_comercial_razon_social = "";
    this.tipo_doc_cliente = "";
    this.nit_cliente = "";
    this.email_cliente = "";
    this.cliente_casual = false;
    this.cliente_habilitado_get = "";
    this.nombre_cliente_catalogo_real = "";

    this.cod_vendedor_cliente = "31101";

    this.whatsapp_cliente = "0";
    this.latitud_cliente = "0";
    this.longitud_cliente = "0";
    this.central_ubicacion = "";
  }
}
