import { Component, HostListener, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ItemDetalle, veCliente } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServicioclienteService } from '../../serviciocliente/serviciocliente.service';
import { ItemServiceService } from '../../serviciosItem/item-service.service';
import { TipoidService } from '../../serviciotipoid/tipoid.service';
import { ModalPrecioVentaComponent } from '../../modal-precio-venta/modal-precio-venta.component';
import { ModalDescuentosComponent } from '../../descuentos-especiales/modal-descuentos/modal-descuentos.component';
import { MatrizItemsComponent } from '../../matriz-items/matriz-items.component';
import { ModalClienteInfoComponent } from '../../modal-cliente-info/modal-cliente-info.component';
import { ModalSaldosComponent } from '../../matriz-items/modal-saldos/modal-saldos.component';
import { DatePipe } from '@angular/common';
import { ModalSubTotalComponent } from '../../modal-sub-total/modal-sub-total.component';
import { ModalIvaComponent } from '../../modal-iva/modal-iva.component';
import { MatTabGroup } from '@angular/material/tabs';
import { CatalogoNotasRemisionComponent } from './catalogo-notas-remision/catalogo-notas-remision.component';
import { ModalTransfeNotaRemisionComponent } from './modal-transfe-nota-remision/modal-transfe-nota-remision.component';
import { SaldoItemMatrizService } from '../../matriz-items/services-saldo-matriz/saldo-item-matriz.service';
import { ServicioTransfeAProformaService } from '../proforma/modal-transfe-proforma/servicio-transfe-a-proforma/servicio-transfe-a-proforma.service';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import { DialogConfirmacionComponent } from '@modules/dialog-confirmacion/dialog-confirmacion.component';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { CatalogoNotasRemisionService } from './servicio-catalogo-notas-remision/catalogo-notas-remision.service';
import { ModalDetalleObserValidacionComponent } from '../../modal-detalle-obser-validacion/modal-detalle-obser-validacion.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-nota-remision',
  templateUrl: './nota-remision.component.html',
  styleUrls: ['./nota-remision.component.scss']
})
export class NotaRemisionComponent implements OnInit, AfterViewInit, OnDestroy {

  public nombre_ventana: string = "docveremision.vb";
  public ventana: string = "Notas De Remision SIAW";
  public detalle = "Notas De Remision";
  public tipo = "transaccion-nota-remision-POST";

  @HostListener("document:keydown.F4", []) unloadHandler() {
    this.modalMatrizProductos();
  }

  @HostListener("document:keydown.F5", []) unloadHandler2(event: Event) {
    
    event.preventDefault();
    this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'TECLA DESHABILITADA ⚠️' });
  }

  @HostListener("document:keydown.Delete", []) unloadHandler7() {
    
    this.onRowSelectForDelete();
  }

  nrSelect: string = "Normal";
  tipoPagoSelect: string = "CREDITO";
  opcions_preparacion = ['Normal', 'Urgente', 'Final', 'Urgente Provincias', 'Por Comisionista', 'Caja Cerrada Recoge Cliente'];
  opcions_tipo_pago = ['Credito', 'Contado',];

  cliente: any = [];
  moneda_get: any = [];
  vendedor_get: any = [];
  agencia_get: any = [];
  tarifa_get: any = [];
  descuento_get: any = [];
  precio_venta_get: any = [];
  documento_identidad: any = [];
  empaquesItem: any = [];
  id_tipo_view_get: any = [];
  id_proforma_numero_id: any = [];
  email_save: any = [];
  almacenes_saldos: any = [];
  item_tabla: any = [];
  almacn_parame_usuario: any = [];

  tarifa_get_unico: any;
  descuentos_get_unico: any;
  direccion_central: any;

  dataform: any = '';
  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();

  public cliente_create: any = [];
  veCliente: veCliente[] = [];

  private unsubscribe$ = new Subject<void>();

  public cod_cliente_enter;
  public disable_input_create: boolean;
  public codigo_cliente: string;
  public nombre_cliente: string;
  public nombre_comercial_cliente: string;
  public razon_social: string;
  public nombre_comercial_razon_social: string;
  public nombre_factura: string;
  public tipo_doc_cliente: string;
  public nit_cliente: string;
  public email_cliente: string;
  public whatsapp_cliente: string;
  public moneda: string;
  public parsed: string;
  public longitud: string;
  public latitud: string;
  public complemento_ci: string
  public cod_vendedor_cliente: string;
  public cod_vendedor_cliente_modal: string;
  public cod_id_tipo_modal: string;
  public cod_descuento_modal: string;
  public cod_precio_venta_modal: string;
  public cod_almacen_cliente: string;
  public codigo_vendedor_catalogo: string;
  public direccion_cen: string;
  public direccion_central_input: string;
  public empaque_item_codigo: string;
  public empaque_item_descripcion: string;
  public cantidad: string;
  public empaque_descripcion_concat: string;
  public isDisabled: boolean = true;
  public selected: string = "Credito";

  public complementopf: any;
  public tipo_complementopf_input: any;
  public idpf_complemento_view: any;
  public disableSelect = new FormControl(false);
  public disableSelectComplemetarProforma: boolean = false;
  precio: any = true;
  desct: any = false;

  public total_desct_precio: boolean = false;
  public anticipo_button: boolean;
  public cliente_casual: boolean;
  public total_X_PU: boolean = false;
  public submitted = false;

  //TABLA DETALLE
  products!: ItemDetalle[];
  selectedProducts: ItemDetalle[] = [];

  elementoSeleccionadoPrecioVenta: any;
  elementoSeleccionadoDescuento: any;

  // TRANSFERENCIA
  moneda_get_catalogo: string;
  cod_id_tipo_modal_id: string;
  tipopago: any;
  transporte: string;
  medio_transporte: string;
  fletepor: string;
  tipoentrega: string;
  peso: any;
  desct_nivel_actual: string;
  preparacion: string;
  tipo_cambio_moneda_catalogo: string;
  id_tipo_view_get_codigo: string;

  habilitar_desct_sgn_solicitud: any = [];
  item_seleccionados_catalogo_matriz: any = [];
  array_items_carrito_y_f4_catalogo: any = [];

  public codigo_cliente_catalogo_real: string;
  public venta_cliente_oficina: string;
  public tipo_cliente: string;

  public direccion: string;
  public latitud_cliente: string;
  public longitud_cliente: string;
  public central_ubicacion: string;
  public URL_maps: string;
  public obs: string;

  public saldoItem: number;
  saldo_modal_total_1: any;
  saldo_modal_total_2: any;
  saldo_modal_total_3: any;
  saldo_modal_total_4: any;
  saldo_modal_total_5: any;

  public ubicacion_central: string;
  public ids_complementar_proforma: any = [];

  decimalPipe: any;
  private debounceTimer: any;

  // formulario
  tdc: any;
  id_nro_id_proforma: any;
  odc: any;
  nroidpf_complemento: number;
  nivel_descuento: any;
  pago_contado_anticipado: any;
  estado: any;

  public input_complemento_view: any;
  public estado_contra_entrega_input: any;

  // NEGATIVOS
  validacion_post_negativos_filtrados_solo_negativos: any = [];
  validacion_post_negativos_filtrados_solo_positivos: any = [];

  toggleTodosNegativos: boolean = false;
  toggleNegativos: boolean = false;
  togglePositivos: boolean = false;

  public cliente_habilitado_get: any;

  //VALIDACIONES TODOS, NEGATIVOS, MAXIMO VENTA
  public validacion_post: any = [];
  public valor_formulario: any = [];
  public validacion_post_negativos: any = [];

  public valor_formulario_copied_map_all: any = {};
  public valor_formulario_negativos: any = {};

  public negativos_validacion: any = [];
  public tabla_anticipos: any;

  public item_obtenido: any = [];
  porcen_item: string;

  desclinea_segun_solicitud: any;
  total_cabecera: any;
  moneda_cabecera: any;
  txtid_solurgente: any;
  txtnroid_solurgente: any;


  fecha_confirmada: any;
  fechaaut: any;
  fecha_reg: any;
  fecha: any;
  fecha_inicial: any;

  horareg: any;
  hora: any;
  usuarioreg: any;
  horaaut: any;
  hora_confirmada: any;
  hora_inicial: any;
  contra_entrega: any;
  complemento_proforma: any;
  codcliente_real: any;
  descuento_total: any;
  codigo_proforma: any;

  // totales
  public subtotal: number;
  public recargos: number;
  public des_extra: number;
  public iva: number;
  public total: number;

  totabilizar_post: any = [];
  tablaIva: any = [];

  cod_descuento_modal_codigo: any;
  cod_precio_venta_modal_codigo: number;

  item_seleccionados_catalogo_matriz_codigo: any;

  array_de_descuentos_ya_agregados: any = [];
  almacn_parame_usuario_almacen: any;

  selectTPago: string = "Credito";
  selectedCountryControl = new FormControl(this.selectTPago);

  public codigo_cliente_catalogo: string;
  public codigo_item_catalogo: string;
  id_tipo: any = [];
  es_venta: boolean = true;

  fecha_actual_server: any;
  hora_fecha_server: any;

  dataSource_negativos = new MatTableDataSource();
  dataSourceWithPageSize_negativos = new MatTableDataSource();

  codcliente_real_descripcion: string;
  fecha_actual_format: string;

  id_proforma: any;
  nro_id_proforma: any;
  cod_nota_remision: any;
  tipoventa: any;

  public valor_formulario_copied_map_all_complementar: any = {};
  public nroidpf_complemento_view: any;

  // COLOCAR VARIABLES BOOLEANAS PARA LOS PARAMETROS DE LAS RUTAS
  sin_validar_empaques: boolean = false;
  sin_validar_negativos: boolean = false;
  sin_validar_monto_min_desc: boolean = false;
  sin_validar_monto_total: boolean = false;
  sin_validar_doc_ant_inv: boolean = false;

  private numberFormatter_5decimales: Intl.NumberFormat;
  private numberFormatter_2decimales: Intl.NumberFormat;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  displayedColumnsNegativos = ['kit', 'nro_partes', 'coditem_cjto', 'coditem_suelto', 'codigo',
    'descitem', 'cantidad', 'cantidad_conjunto', 'cantidad_suelta', 'saldo_sin_descontar_reservas',
    'cantidad_reservada_para_cjtos', 'saldo_descontando_reservas', 'obs'];

  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService,
    private servicioCliente: ServicioclienteService, private _formBuilder: FormBuilder,
    private serviciotipoid: TipoidService, private messageService: MessageService, private spinner: NgxSpinnerService,
    private log_module: LogService, private datePipe: DatePipe, private saldoItemServices: SaldoItemMatrizService,
    public servicioTransfeProformaCotizacion: ServicioTransfeAProformaService, public servicioCatalogoNotasRemision: CatalogoNotasRemisionService,
    public nombre_ventana_service: NombreVentanaService) {

    this.FormularioData = this.createForm();

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    //this.getParametrosIniciales();
    this.api.getRolUserParaVentana(this.nombre_ventana);

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

  ngOnInit() {
    this.fecha_actual_format = this.datePipe.transform(this.fecha_actual, 'dd-MM-yyyy')
    this.mandarNombre();
    this.es_venta = true;

    this.serviciotipoid.disparadorDeIDTipo.subscribe(data => {
      
      this.cod_id_tipo_modal = data.id_tipo.id;
    });

    this.servicioCatalogoNotasRemision.disparadorDeIDNotaRemision.subscribe(data => {
      
      this.cod_id_tipo_modal = data.proforma.id;
      this.getIdTipoNumeracion(data.proforma.id)
    });

    // transferencia
    this.servicioTransfeProformaCotizacion.disparadorDeProformaTransferir.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      
      const dialogRefTransfeProformaCotizacion = this.dialog.open(DialogConfirmActualizarComponent, {
        width: 'auto',
        height: 'auto',
        data: { mensaje_dialog: "¿ ESTA SEGURO QUE DESEA TRANFERIR LA PROFORMA?, SE REMPLAZARA EL CONTENIDO DE LA PROFORMA ACTUAL !" },
        disableClose: true,
      });

      dialogRefTransfeProformaCotizacion.afterClosed().subscribe((result: Boolean) => {
        if (result) {
          this.spinner.show();
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! TRANSFERENCIA EN PROGESO ! ⚙️' })
          //SE PINTA LA DATA TRANSFERIDA A LA NOTA DE REMISION
          this.imprimir_proforma_tranferida(data.proforma_transferir);
          this.codigo_proforma = data.proforma_transferir.data.cabecera.codigo;
          setTimeout(() => {
            this.spinner.hide();
          }, 0);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! CANCELADO ! ❌' });
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      });
    });
    // fin_transferencia 

    this.itemservice.disparadorDeItems.subscribe(data => {
      
      this.codigo_item_catalogo = data.item;
      this.getEmpaqueItem(this.codigo_item_catalogo);
    });

    this.servicioCliente.disparadorDeClientes.subscribe(data => {
      
      this.codigo_cliente_catalogo = data.cliente;
      this.getClientByID(this.codigo_cliente_catalogo);
    });

    //SALDOS ITEM PIE DE PAGINA
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
    //FIN SALDOS ITEM PIE DE PAGINA
  }

  ngAfterViewInit() {
    this.getHoraFechaServidorBckEnd();
    this.getIDScomplementarProforma();
    this.getIdTipo();
    this.getAlmacenParamUsuario();
    this.getTarifa();
    this.getDescuentos();
    this.getAllmoneda();
    this.getTipoDocumentoIdentidadProforma();
    this.getVendedor();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

  getHoraFechaServidorBckEnd() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + this.userConn)
      .subscribe({
        next: (datav) => {
          

          this.fecha_actual_server = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");;
          this.hora_fecha_server = datav.horaServidor;

          
        },

        error: (err: any) => {
          
        },
        complete: () => {
        }
      })
  }

  getIdTipo() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/transac/veproforma/catalogoNumProf/";
    return this.api.getAll('/venta/transac/veremision/getParametrosIniciales/' + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          
          this.cod_id_tipo_modal = datav.id;
          this.id_proforma_numero_id = datav.numeroid;
          // this.almacn_parame_usuario_almacen = datav.codalmacen;
          this.moneda_get_catalogo = datav.codmoneda;
          this.tdc = datav.codtarifadefect;
          this.cod_descuento_modal_codigo = datav.coddescuentodefect;
          this.cod_precio_venta_modal_codigo = datav.codtarifadefect;
          this.cod_vendedor_cliente_modal = datav.codvendedor;
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
          

          // this.almacn_parame_usuario_almacen = datav.codalmacen;
          this.cod_precio_venta_modal_codigo = this.almacn_parame_usuario.codtarifa;
          this.cod_descuento_modal_codigo = this.almacn_parame_usuario.coddescuento;
        },
        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getIdTipoNumeracion(id_proforma) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getNumActProd/' + this.userConn + "/" + id_proforma)
      .subscribe({
        next: (datav) => {
          // 
          this.id_proforma_numero_id = datav
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getTarifa() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/mant/intarifa/catalogo/";

    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.tarifa_get_unico = datav.shift();
          // 
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getDescuentos() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/mant/vedescuento/catalogo";
    return this.api.getAll('/venta/mant/vedescuento/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.descuentos_get_unico = datav.shift();
          // 
        },
        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getClientByID(codigo) {
    
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/mant/vecliente/";
    return this.api.getAll('/venta/mant/vecliente/' + this.userConn + "/" + codigo)
      .subscribe({
        next: (datav) => {
          this.cliente = datav;
          

          this.codigo_cliente = this.cliente.cliente.codigo;
          this.codigo_cliente_catalogo_real = this.cliente.cliente.codigo;
          this.nombre_comercial_cliente = this.cliente.cliente.nombre_comercial;
          this.nombre_factura = this.cliente.cliente.nombre_fact;
          this.razon_social = this.cliente.cliente.razonsocial;
          this.complemento_ci = this.cliente.cliente.complemento_ci
          this.nombre_comercial_razon_social = this.nombre_comercial_cliente;
          this.tipo_doc_cliente = this.cliente.cliente.tipo_docid;
          this.nit_cliente = this.cliente.cliente.nit;
          this.email_cliente = this.cliente.cliente.email;
          this.cliente_casual = this.cliente.cliente.casual;

          this.cod_vendedor_cliente = this.cliente.cliente.codvendedor;
          this.moneda = this.cliente.cliente.moneda;
          this.venta_cliente_oficina = this.cliente.cliente.venta_cliente_oficina;
          this.tipo_cliente = this.cliente.cliente.tipo;

          this.direccion = this.cliente.vivienda.direccion;
          this.whatsapp_cliente = this.cliente.vivienda.celular;
          this.latitud_cliente = this.cliente.vivienda.latitud;
          this.longitud_cliente = this.cliente.vivienda.longitud;
          this.central_ubicacion = this.cliente.vivienda.central;

          this.obs = this.cliente.vivienda.obs;
        },

        error: (err: any) => {
          
          this.limpiar();
        },
        complete: () => {
          this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.latitud_cliente + "%2C" + this.longitud_cliente;
          this.getUbicacionCliente(this.codigo_cliente_catalogo, this.cliente.vivienda.direccion);
        }
      })
  }

  getUbicacionCliente(cod_cliente, direccion) {
    let dirclient = {
      codcliente: cod_cliente,
      dircliente: direccion,
    }

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getUbicacionCliente/"
    return this.api.create('/venta/transac/veproforma/getUbicacionCliente/' + this.userConn, dirclient)
      .subscribe({
        next: (datav) => {
          this.central_ubicacion = datav;
          this.ubicacion_central = datav.ubi
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getAllmoneda() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/admoneda/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda_get = datav.shift();
          
        },
        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getTipoDocumentoIdentidadProforma() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getTipoDocIdent/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.documento_identidad = datav;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getVendedor() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/mant/vevendedor/catalogo/";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.vendedor_get = datav.shift();
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getEmpaqueItem(item) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/transac/veproforma/getempaques/";
    return this.api.getAll('/venta/transac/veproforma/getempaques/' + this.userConn + "/" + item)
      .subscribe({
        next: (datav) => {
          this.empaquesItem = datav;

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

  getAlmacenesSaldos() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getCodAlmSlds/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.almacenes_saldos = datav;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  mandarEntregar() {
    this.valor_formulario = [this.FormularioData.value];
    

    this.submitted = true;
    this.valor_formulario.map((element: any) => {
      this.valor_formulario_copied_map_all = {
        ...element,
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString() || '',
        codcliente: element.codcliente?.toString() || '',
        nombcliente: element.nombcliente?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_doc_id?.toString() || '',
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
        estado_contra_entrega: element.estado_contra_entrega === "undefined" ? "NO" : "SI",
        desclinea_segun_solicitud: element.desclinea_segun_solicitud,
        pago_con_anticipo: element.pago_contado_anticipado,
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
        idanticipo: element.idanticipo,
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
        estado_doc_vta: "NUEVO",
        codtarifadefecto: "1",
        desctoespecial: "0",
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
        totrecargos: 0,
        idpf_complemento: "",
        nroidpf_complemento: " ",
        idFC_complementaria: "",
        nroidFC_complementaria: "",
        fechalimite_dosificacion: "2030-04-10",
        idpf_solurgente: "0",
        noridpf_solurgente: "0",
      }
    });

    if (this.preparacion === undefined) {
      this.preparacion = "NORMAL";
    } else {
      this.preparacion;
    }

    let proforma_validar = {
      datosDocVta: this.valor_formulario_copied_map_all,
      detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
      preparacion: this.preparacion,
    }
    
    

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/get_entrega_pedido/"
    return this.api.create('/venta/transac/veproforma/get_entrega_pedido/' + this.userConn + "/" + this.BD_storage, proforma_validar)
      .subscribe({
        next: (datav) => {
          this.tipoentrega = datav.mensaje;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      });
  }

  limpiar() {
    this.fecha_actual = this.fecha_actual;
    this.almacn_parame_usuario = "";
    this.cod_vendedor_cliente_modal = "";
    this.venta_cliente_oficina = "";
    this.codigo_cliente = "";
    this.nombre_cliente = "";
    this.nombre_comercial_cliente = "";
    this.nombre_factura = "";
    this.complemento_ci = "";
    this.tipo_doc_cliente = "";
    this.nit_cliente = "";
    this.email_cliente = "";
    this.cliente_casual = false;
    this.preparacion = "";
    this.estado = "";

    this.moneda_get_catalogo = "";
    this.tdc = "";
    this.codigo_cliente = "";
    this.tipopago = "";
    this.estado_contra_entrega_input = "";
    this.id_nro_id_proforma = "";

    this.transporte = "";
    this.medio_transporte = "";
    this.fletepor = "";
    this.tipoentrega = "";
    this.peso = "";
    this.direccion_central_input = "";
    this.odc = "";

    this.codigo_cliente_catalogo_real = "";

    this.cod_vendedor_cliente = "";
    this.venta_cliente_oficina = "";
    this.tipo_cliente = "";
    this.direccion = "";
    this.whatsapp_cliente = "";
    this.latitud_cliente = "";
    this.longitud_cliente = "";
    this.central_ubicacion = "";
    this.obs = "";
    this.desct_nivel_actual = "";
    this.whatsapp_cliente = "0";

    this.ubicacion_central = "";
    this.preparacion = "";

    //Descuentos De Linea de CLiente
    this.nivel_descuento = "";

    //complementarProforma
    this.idpf_complemento_view = "";
    // this.nroidpf_complemento = 0;

    this.pago_contado_anticipado = "";

    //eso nop porque se totaliza una vez transferida
    // this.subtotal = proforma.cabecera.subtotal;
    // this.recargos = proforma.cabecera.recargos;
    // this.des_extra = proforma.cabecera.descuentos;
    // this.iva = proforma.cabecera.iva;
    // this.total = proforma.cabecera.total;

    this.item_seleccionados_catalogo_matriz = [];
    this.array_de_descuentos_ya_agregados = [];
    this.array_items_carrito_y_f4_catalogo = [];
    //this.cod_descuento_total = proforma.descuentos;

    this.subtotal = 0;
    this.recargos = 0;
    this.des_extra = 0;
    this.iva = 0;
    this.total = 0;

    this.total_cabecera = 0;
    this.email_cliente = "";
    this.moneda_cabecera = "";
  }

  codcliente_real_para_parametro: any;

  imprimir_proforma_tranferida(proforma) {
    this.spinner.show();
    

    if (proforma.datos.cabecera.nroidpf_complemento > 0) {
      this.disableSelectComplemetarProforma = true;
    }

    this.tipoventa = 0;
    this.tipopago = proforma.datos.cabecera.tipopago
    this.codigo_proforma = proforma.datos.cabecera.codigo;
    this.total_cabecera = proforma.datos.cabecera.total;
    this.moneda_cabecera = proforma.datos.cabecera.codmoneda;
    this.complemento_proforma = proforma.datos.cabecera.complemento_proforma;

    // this.cod_id_tipo_modal = proforma.cabecera.id;
    // this.id_proforma_numero_id = proforma.cabecera.numeroid;

    this.id_proforma = proforma.datos.cabecera.id;
    this.nro_id_proforma = proforma.datos.cabecera.numeroid;

    this.almacn_parame_usuario = proforma.datos.cabecera.codalmacen;
    this.cod_vendedor_cliente_modal = proforma.datos.cabecera.codvendedor;
    this.venta_cliente_oficina = proforma.datos.cabecera.venta_cliente_oficina;
    this.codigo_cliente = proforma.datos.cabecera.codcliente;
    this.nombre_cliente = proforma.datos.cabecera.nomcliente;
    this.nombre_comercial_cliente = proforma.datos.cabecera.nombre_comercial;
    this.nombre_factura = proforma.datos.cabecera.nombre_fact;
    this.complemento_ci = proforma.datos.cabecera.complemento_ci;
    this.tipo_doc_cliente = proforma.datos.cabecera.tipo_docid;
    this.nit_cliente = proforma.datos.cabecera.nit;
    this.email_cliente = proforma.datos.cabecera.email;
    this.cliente_casual = proforma.datos.cabecera.casual;
    this.preparacion = proforma.datos.cabecera.preparacion;
    this.almacn_parame_usuario_almacen = proforma.datos.cabecera.codalmacen;

    this.moneda_get_catalogo = proforma.datos.cabecera.codmoneda;
    this.tdc = proforma.datos.cabecera.tdc;

    this.codcliente_real_para_parametro = proforma.datos.codcliente_real;
    this.codcliente_real_descripcion = proforma.datos.codclientedescripcion;

    // codcliente de cabecera se utiliza este
    this.codigo_cliente_catalogo_real = proforma.datos.cabecera.codcliente_real;

    this.estado_contra_entrega_input = proforma.datos.cabecera.estado_contra_entrega;
    this.contra_entrega = proforma.datos.cabecera.contra_entrega;
    this.codigo_proforma = proforma.datos.cabecera.codigo;
    this.id_nro_id_proforma = proforma.datos.cabecera.id + "-" + proforma.datos.cabecera.numeroid;

    this.transporte = proforma.datos.cabecera.transporte;
    this.medio_transporte = proforma.datos.cabecera.nombre_transporte;
    this.fletepor = proforma.datos.cabecera.fletepor;
    this.tipoentrega = proforma.datos.cabecera.tipoentrega;
    this.peso = proforma.datos.cabecera.peso;
    this.direccion_central_input = proforma.datos.cabecera.direccion;
    this.odc = proforma.datos.cabecera.odc;

    this.desclinea_segun_solicitud = proforma.datos.cabecera.desclinea_segun_solicitud;

    this.cod_vendedor_cliente = proforma.datos.cabecera.codvendedor;
    this.venta_cliente_oficina = proforma.datos.cabecera.venta_cliente_oficina;
    this.tipo_cliente = proforma.tipo_cliente;
    this.direccion = proforma.datos.cabecera.direccion;
    this.whatsapp_cliente = proforma.datos.cabecera.celular;
    this.latitud_cliente = proforma.datos.cabecera.latitud_entrega;
    this.longitud_cliente = proforma.datos.cabecera.longitud_entrega;
    this.central_ubicacion = proforma.datos.cabecera.ubicacion;
    this.obs = proforma.datos.cabecera.obs;
    this.desct_nivel_actual = proforma.datos.cabecera.niveles_descuento;
    this.whatsapp_cliente = "0";

    this.ubicacion_central = proforma.datos.cabecera.ubicacion;
    this.preparacion = proforma.datos.cabecera.preparacion;

    //Descuentos De Linea de CLiente
    this.nivel_descuento = proforma.datos.cabecera.niveles_descuento;

    //complementarProforma
    this.idpf_complemento_view = proforma.datos.cabecera.idpf_complemento;
    this.nroidpf_complemento = proforma.datos.cabecera.nroidpf_complemento;
    this.pago_contado_anticipado = proforma.datos.cabecera.pago_contado_anticipado;
    this.tipo_complementopf_input = proforma.datos.cabecera.tipo_complementopf === 0 ? 3 : proforma.datos.cabecera.tipo_complementopf;
    this.nroidpf_complemento_view = proforma.datos.cabecera.nroidpf_complemento;
    //complementar proforma

    //eso nop porque se totaliza una vez transferida
    // this.subtotal = proforma.cabecera.subtotal;
    // this.recargos = proforma.cabecera.recargos;
    this.descuento_total = proforma.datos.cabecera.descuentos;
    // this.total = proforma.cabecera.total;

    this.iva = proforma.datos.cabecera.iva;
    this.tablaIva = proforma.datos.iva

    this.item_seleccionados_catalogo_matriz = proforma.datos.detalle;
    this.array_de_descuentos_ya_agregados = proforma.datos.descuentos;
    //this.cod_descuento_total = proforma.descuentos;

    //el cuerpo del detalle asignado al carrito
    this.array_items_carrito_y_f4_catalogo = proforma.datos.detalle;

    //fechas
    // this.fecha = this.datePipe.transform(proforma.cabecera.fecha, "yyyy-MM-dd");
    this.fecha_inicial = this.datePipe.transform(proforma.datos.cabecera.fecha_inicial, "yyyy-MM-dd");
    this.fecha_confirmada = this.datePipe.transform(proforma.datos.cabecera.fecha_confirmada, "yyyy-MM-dd");
    this.fechaaut = this.datePipe.transform(proforma.datos.cabecera.fechaaut, "yyyy-MM-dd");
    this.fecha_reg = this.datePipe.transform(proforma.datos.cabecera.fechareg, "yyyy-MM-dd");

    this.hora_inicial = proforma.datos.cabecera.hora_inicial;
    this.horareg = proforma.datos.cabecera.horareg;
    this.hora = proforma.datos.cabecera.hora;
    this.usuarioreg = proforma.datos.cabecera.usuarioreg;
    this.horaaut = proforma.datos.cabecera.horaaut;
    this.hora_confirmada = proforma.datos.cabecera.hora_confirmada;
    //fin-fecha

    this.tabla_anticipos = proforma.datos?.detalleAnticipos;

    // Agregar el número de orden a los objetos de datos
    this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
      element.orden = index + 1;
      if (element.empaque === null) {
        element.empaque = 0;
      }
    });

    this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.latitud_cliente + "%2C" + this.longitud_cliente;

    //id_solurgente, txtnroid_solurgente
    this.txtid_solurgente = proforma.txtid_solurgente;
    this.txtnroid_solurgente = proforma.txtnroid_solurgente;

    

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.spinner.show();

      // this.spinner.hide();
      this.totabilizarYGrabar();
    }, 500); // 300 ms de retardo
  }

  createForm(): FormGroup {
    let valor_cero: number = 0;

    if (this.input_complemento_view === null) {
      this.input_complemento_view = valor_cero;
    }

    return this._formBuilder.group({
      total_cabecera: [this.dataform.total_cabecera],
      moneda_cabecera: [this.dataform.moneda_cabecera],
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
      cod_descuento: [this.dataform.descuentos],
      transporte: [this.dataform.transporte === "FLOTA", Validators.required],
      nombre_transporte: [this.dataform.nombre_transporte, Validators.compose([Validators.required])],
      tipo_docid: [{ value: this.dataform.tipo_docid, disabled: true }, Validators.compose([Validators.required])],
      preparacion: [this.dataform.preparacion, Validators.compose([Validators.required])],
      tipoentrega: [this.dataform.tipoentrega === undefined ? "ENTREGAR" : this.dataform.tipoentrega, Validators.compose([Validators.required])],
      fletepor: [this.dataform.fletepor === "CLIENTE", Validators.compose([Validators.required])],
      estado_proforma: [{ value: this.dataform.estado_proforma, disabled: true }],
      tdc: [this.dataform.tdc],
      anulada: [false],
      aprobada: [false],
      paraaprobar: [false],
      transferida: [false],
      usuarioaut: [""],
      confirmada: [false],
      impresa: [false],
      etiqueta_impresa: [false],
      es_sol_urgente: [false],
      codproforma: this.dataform.codproforma,
      id_nro_id_proforma_form: [this.dataform.id_nro_id_proforma_form],
      complemento_proforma: [this.dataform.complemento_proforma],
      obs: this.dataform.obs ? this.dataform.obs.trim() : '',
      obs2: [""],
      direccion: [this.dataform.direccion],
      codcliente_real: [this.dataform.codcliente_real],
      // peso: Number(this.peso),
      peso: Number(this.dataform.peso),

      latitud_entrega: [this.dataform.latitud_entrega === undefined ? this.dataform.latitud : this.dataform.latitud],
      longitud_entrega: [this.dataform.longitud_entrega === undefined ? this.dataform.longitud : this.dataform.longitud],
      ubicacion: [this.dataform.ubicacion === null ? 'LOCAL' : this.dataform.ubicacion],
      email: [this.dataform.email],

      venta_cliente_oficina: [{ value: this.dataform.venta_cliente_oficina === undefined ? false : true, disabled: true }],
      desclinea_segun_solicitud: [this.dataform.desclinea_segun_solicitud], //Descuentos de Linea de Solicitud

      contra_entrega: this.dataform.contra_entrega,
      estado_contra_entrega: [this.dataform.estado_contra_entrega],

      tipo_venta: 0,
      tipopago: [{ value: this.dataform.tipopago === "CONTADO" ? 0 : 1, disabled: true }],

      // tipopago: [this.dataform.tipopago],
      odc: "",

      idanticipo: [""], //anticipo VentasL
      numeroidanticipo: [0], //anticipo Ventas
      pago_contado_anticipado: [false], //anticipo Ventas
      complemento_ci: [this.dataform.complemento_ci === undefined ? "" : this.dataform.complemento_ci],
      codcomplementaria: [this.dataform.codcomplementaria === null ? 0 : 0], //aca es para complemento de proforma //ACA REVIS

      idsoldesctos: "", // Descuentos de Linea de Solicitud, esto ya no se utiliza enviar valor 0
      nroidsoldesctos: [valor_cero], // Descuentos de Linea de Solicitud, ya no se usa a fecha mayo/2024

      // idpf_complemento: this.dataform.idpf_complemento === undefined ? "" : this.dataform.idpf_complemento, //aca es para complemento de proforma
      // nroidpf_complemento: this.dataform.nroidpf_complemento === undefined ? 0 : this.dataform.nroidpf_complemento,
      // tipo_complementopf: [this.dataform.tipo_complementopf], //aca es para complemento de proforma

      //complementar input
      idpf_complemento: this.dataform.idpf_complemento === undefined ? " " : this.dataform.idpf_complemento, //aca es para complemento de proforma
      nroidpf_complemento: this.dataform.nroidpf_complemento === undefined ? 0 : this.dataform.nroidpf_complemento,
      tipo_complementopf: this.dataform.tipo_complementopf, //aca es para complemento de proforma
      monto_anticipo: [0], //anticipo Ventas
      niveles_descuento: [this.dataform.niveles_descuento === undefined ? 'ACTUAL' : this.dataform.niveles_descuento], //niveles de descuento

      // fechaaut_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // subtotal_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // total_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // moneda_total_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario

      // no hay mas en esta seccion xD
      subtotal: [this.dataform.subtotal === null ? 0.00 : this.dataform.subtotal], //TOTALES
      recargos: [this.dataform.recargos === null ? 0.00 : this.dataform.recargos], //TOTALES
      //des_extra: [this.dataform.des_extra], //TOTALES
      iva: [this.iva === null ? 0.00 : this.iva], //TOTALES
      total: [this.dataform.total === null ? 0.00 : this.dataform.total], //TOTALES
      porceniva: [0],

      fecha: this.dataform.fecha,
      fechareg: this.dataform.fechareg,
      fecha_confirmada: this.dataform.fecha_confirmada,
      fechaaut: this.dataform.fechaaut,
      fecha_inicial: this.dataform.fecha_inicial,

      horareg: this.dataform.horareg,
      hora: this.dataform.hora,
      usuarioreg: this.dataform.usuarioLogueado,
      horaaut: this.dataform.horaaut,
      hora_inicial: this.dataform.hora_inicial,
      hora_confirmada: this.dataform.hora_confirmada,

      es_venta: { value: this.dataform.es_venta, disabled: true }
    });
  }

  // BTN GRABAR NT RMS
  async submitDataNotaRemision(codigo_control) {
    this.spinner.show();
    // validaciones
    if (this.array_items_carrito_y_f4_catalogo.length === 0 ) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO HAY ITEMS EN EL DETALLE' });
      this.spinner.hide();
      return;
    }

    if (this.total === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'EL TOTAL NO PUEDE SER 0' });
      this.spinner.hide();
      return;
    }

    if (this.cod_id_tipo_modal === undefined || null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO HAY ID DE NR REVISE PORFAVOR' });
      this.spinner.hide();
      return;
    }

    if (this.moneda_get_catalogo === undefined || null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO HAY MONEDA REVISE PORFAVOR' });
      this.spinner.hide();
      return;
    }
    
    if (this.codigo_cliente === undefined || null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO HAY CODIGO CLIENTE REVISE PORFAVOR' });
      this.spinner.hide();
      return;
    }

    //si hay negativos no tiene q dejar grabar y pide clave
    let a = [this.FormularioData.value].map((element) => ({
      ...element,
      descuentos: this.des_extra,
      contra_entrega: this.contra_entrega,
      codproforma: this.codigo_proforma,
      tipo_docid: this.tipo_doc_cliente,
      venta: this.es_venta,
      codalmacen_saldo: this.almacn_parame_usuario_almacen,
      descarga: true,
      tipo_venta: 0,
      tipopago: this.tipopago,
    }));

    let submit_nota_remision = {
      veremision: a[0],
      veremision1: this.array_items_carrito_y_f4_catalogo,
      vedesextraremi: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados,
      verecargoremi: [],
      veremision_iva: this.tablaIva,
      veremision_chequerechazado: {}
    };

    if (this.txtid_solurgente === "") {
      this.txtid_solurgente = "0";
    }

    
    
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veremision/grabarNotaRemision/ " + "/ false /" + this.sin_validar_empaques + " / " + this.sin_validar_negativos + " / " + this.sin_validar_monto_min_desc + " / " + this.sin_validar_monto_total + " /" + this.sin_validar_doc_ant_inv
    return this.api.create('/venta/transac/veremision/grabarNotaRemision/' + this.userConn + "/" + this.cod_id_tipo_modal + "/" + this.usuarioLogueado
      + "/" + this.desclinea_segun_solicitud + "/" + this.codigo_proforma + "/" + this.id_proforma + "/" + this.nro_id_proforma + "/" + this.BD_storage + "/"
      + this.txtid_solurgente + "/" + this.txtnroid_solurgente + "/false/" + this.sin_validar_empaques + "/" + this.sin_validar_negativos + "/" + this.sin_validar_monto_min_desc + "/" + this.sin_validar_monto_total + "/" + this.sin_validar_doc_ant_inv, submit_nota_remision)
      .subscribe({
        next: async (datav) => {
          codigo_control = datav.codigo_control,
            this.dataSource_negativos = new MatTableDataSource(datav.dtnegativos_result);
          this.validacion_post_negativos = datav.dtnegativos_result
          
          // aca sale el mensaje de la primera validacion
          try {
            if (datav.resp === false) {
              const result = await this.openConfirmacionDialog(datav.msgsAlert, []);
              if (!result) {
                setTimeout(() => {
                  this.spinner.hide();
                }, 1000);
                return;
              }
            } else {
              // Abrir el diálogo y esperar a que el usuario responda
              const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
                width: '400px',
                height: 'auto',
                data: { mensaje_dialog: datav.resp + "¿ DESEA IMPRIMIR LA NOTA DE REMISION ?" },
                disableClose: true,
              });

              // Esperar a que el diálogo se cierre y capturar el resultado
              const dialogReConfirmImpresion = await dialogRef.afterClosed().toPromise();

              // Procesar la respuesta del diálogo
              if (!dialogReConfirmImpresion) {
                
                window.location.reload();
                return;
              } else {
                this.mandarAImprimir(datav.codNotRemision);
                

                setTimeout(() => {
                  this.spinner.hide();
                }, 1000);
                return;
              }
            }

            if (datav.mostrarVentanaModifPlanCuotas === true) {
              const result = await this.openConfirmacionDialog("", datav.planCuotas);
              if (!result) {
                setTimeout(() => {
                  this.spinner.hide();
                }, 1000);
                return;
              }
            }
          } catch (error) {
            console.error(error);
          }

          // si el codigo_control es igual a :
          // 3 - sin_validar_negativos,
          // 25 - sin_validar_empaques,
          // 65 - sin_validar_monto_min_desc,
          // 147 - sin_validar_monto_total,
          // 48 - sin_validar_doc_ant_inv
          this.totabilizar_post = datav;
          switch (codigo_control) {
            case 3:
              const dialogRefEspeciales_sin_validar_negativos = this.dialog.open(PermisosEspecialesParametrosComponent, {
                width: 'auto',
                height: 'auto',
                data: {
                  dataA: this.cod_id_tipo_modal,
                  dataB: this.id_proforma_numero_id,
                  dataPermiso: "NOTA DE REMISION QUE NO CUMPLA",
                  dataCodigoPermiso: "03",
                },
              });

              dialogRefEspeciales_sin_validar_negativos.afterClosed().subscribe((result: Boolean) => {
                if (result) {
                  // aca la logica despues de grabar y q salte la validaciones poner aca de nuevo la ruta correcta para q se grabe
                  let errorMessage = "CODIGO 3 " + "/false/" + this.sin_validar_empaques + "/" + this.sin_validar_negativos + "/" + this.sin_validar_monto_min_desc + "/" + this.sin_validar_monto_total + "/" + this.sin_validar_doc_ant_inv

                  return this.api.create('/venta/transac/veremision/grabarNotaRemision/' + this.userConn + "/" + this.cod_id_tipo_modal + "/" + this.usuarioLogueado
                    + "/" + this.desclinea_segun_solicitud + "/" + this.codigo_proforma + "/" + this.id_proforma + "/" + this.nro_id_proforma + "/" + this.BD_storage + "/"
                    + this.txtid_solurgente + "/" + this.txtnroid_solurgente +
                    "/false/" + this.sin_validar_empaques + "/" + this.sin_validar_negativos + "/" + this.sin_validar_monto_min_desc + "/" + this.sin_validar_monto_total + "/" + this.sin_validar_doc_ant_inv, submit_nota_remision)
                    .subscribe({
                      next: async (datav) => {
                        // this.tipoentrega = datav.mensaje;
                        

                        //PRIMERO SE CAMBIAN LOS VALORES Y LUEGO SE LLAMA A LA RECURSIVA
                        this.sin_validar_empaques = true;
                        this.sin_validar_negativos = true;

                        // aca se vuelve RECURSIVA, volviendo a llamar a la funcion pasandole el nuevo codigo_control recibido
                        this.submitDataNotaRemision(codigo_control);

                        
                        setTimeout(() => {
                          this.spinner.hide();
                        }, 1000);
                        return;
                      },
                      error: (err: any) => {
                        
                      },
                      complete: async () => {
                        // this.toastr.success("GUARDADO EXITOSAMENTE");
                        // const resultComplete3 = await this.openConfirmacionDialog("NOTA DE REMISION" + datav.codNotRemision + "-" + datav.nroIdRemision + "GRABADA EXITOSAMENTE", []);
                        // if (resultComplete3) {
                        //   this.mandarAImprimir(datav.codNotRemision);
                        // }
                      }
                    });
                } else {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'SE CANCELO' });
                }
              });
              break;
            case 25:
              const dialogRefEspeciales_sin_validar_empaques = this.dialog.open(PermisosEspecialesParametrosComponent, {
                width: 'auto',
                height: 'auto',
                data: {
                  dataA: this.cod_id_tipo_modal,
                  dataB: this.id_proforma_numero_id,
                  dataPermiso: "ACEPTAR VENTA SIN EMPAQUES CERRADOS",
                  dataCodigoPermiso: "25",
                },
              });

              dialogRefEspeciales_sin_validar_empaques.afterClosed().subscribe((result: Boolean) => {
                if (result) {
                  // aca la logica despues de grabar y q salte la validaciones poner aca de nuevo la ruta correcta para q se grabe
                  let errorMessage = "CODIGO 25  /false/true/false/false/false/false" + "----" + "/false/" + this.sin_validar_empaques + "/" + this.sin_validar_negativos + "/" + this.sin_validar_monto_min_desc + "/" + this.sin_validar_monto_total + "/" + this.sin_validar_doc_ant_inv;

                  return this.api.create('/venta/transac/veremision/grabarNotaRemision/' + this.userConn + "/" + this.cod_id_tipo_modal + "/" + this.usuarioLogueado + "/" + this.desclinea_segun_solicitud + "/" +
                    this.codigo_proforma + "/" + this.id_proforma + "/" + this.nro_id_proforma + "/" + this.BD_storage + "/" + this.txtid_solurgente + "/" + this.txtnroid_solurgente +
                    "/false/" + this.sin_validar_empaques + "/" + this.sin_validar_negativos + "/" + this.sin_validar_monto_min_desc + "/" + this.sin_validar_monto_total + "/" + this.sin_validar_doc_ant_inv, submit_nota_remision)
                    .subscribe({
                      next: async (datav) => {
                        // this.tipoentrega = datav.mensaje;
                        
                        

                        //PRIMERO SE CAMBIAN LOS VALORES Y LUEGO SE LLAMA A LA RECURSIVA
                        this.sin_validar_empaques = true;

                        // aca se vuelve RECURSIVA, volviendo a llamar a la funcion pasandole el nuevo codigo_control recibido
                        this.submitDataNotaRemision(codigo_control);

                        
                        setTimeout(() => {
                          this.spinner.hide();
                        }, 1000);
                        return;
                      },

                      error: (err: any) => {
                        
                      },
                      complete: async () => {
                        // this.toastr.success("GUARDADO EXITOSAMENTE");
                        // const resultComplete25 = await this.openConfirmacionDialog("NOTA DE REMISION" + datav.codNotRemision + "-" + datav.nroIdRemision + "GRABADA EXITOSAMENTE", []);
                        // if (resultComplete25) {
                        //   this.mandarAImprimir(datav.codNotRemision);
                        // }
                      }
                    });
                } else {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'SE CANCELO' });
                }
              });
              break;
            case 65:
              const dialogRefEspeciales_sin_validar_monto_min_desc = this.dialog.open(PermisosEspecialesParametrosComponent, {
                width: 'auto',
                height: 'auto',
                data: {
                  dataA: this.cod_id_tipo_modal,
                  dataB: this.id_proforma_numero_id,
                  dataPermiso: "VENTA SIN CUMPLIR EL MONTO MINIMO DE LOS DESCUENTOS ESPECIALES",
                  dataCodigoPermiso: "65",
                },
              });

              dialogRefEspeciales_sin_validar_monto_min_desc.afterClosed().subscribe((result: Boolean) => {
                if (result) {
                  // aca la logica despues de grabar y q salte la validaciones poner aca de nuevo la ruta correcta para q se grabe
                  let errorMessage = "CODIGO 65  /false/true/true/true/false/false" + "/false/" + this.sin_validar_empaques + "/" + this.sin_validar_negativos + "/" + this.sin_validar_monto_min_desc + "/" + this.sin_validar_monto_total + "/" + this.sin_validar_doc_ant_inv;

                  return this.api.create('/venta/transac/veremision/grabarNotaRemision/' + this.userConn + "/" + this.cod_id_tipo_modal + "/" + this.usuarioLogueado
                    + "/" + this.desclinea_segun_solicitud + "/" + this.codigo_proforma + "/" + this.id_proforma + "/" + this.nro_id_proforma + "/" + this.BD_storage + "/"
                    + this.txtid_solurgente + "/" + this.txtnroid_solurgente +
                    "/false/" + this.sin_validar_empaques + "/" + this.sin_validar_negativos + "/" + this.sin_validar_monto_min_desc + "/" + this.sin_validar_monto_total + "/" + this.sin_validar_doc_ant_inv, submit_nota_remision)
                    .subscribe({
                      next: async (datav) => {
                        // this.tipoentrega = datav.mensaje;
                        

                        //PRIMERO SE CAMBIAN LOS VALORES Y LUEGO SE LLAMA A LA RECURSIVA
                        this.sin_validar_empaques = true;
                        this.sin_validar_negativos = true;
                        this.sin_validar_monto_min_desc = true;

                        // aca se vuelve RECURSIVA, volviendo a llamar a la funcion pasandole el nuevo codigo_control recibido
                        this.submitDataNotaRemision(codigo_control);

                        
                        setTimeout(() => {
                          this.spinner.hide();
                        }, 1000);
                        return;
                      },

                      error: (err: any) => {
                        
                      },
                      complete: async () => {
                        // this.toastr.success("GUARDADO EXITOSAMENTE");
                        // const resultComplete65 = await this.openConfirmacionDialog("NOTA DE REMISION" + datav.codNotRemision + "-" + datav.nroIdRemision + "GRABADA EXITOSAMENTE", []);
                        // if (resultComplete65) {
                        //   this.mandarAImprimir(datav.codNotRemision);
                        // }
                      }
                    });
                } else {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'SE CANCELO' });
                }
              });
              break;
            case 147:
              const dialogRefEspeciales_sin_validar_monto_total = this.dialog.open(PermisosEspecialesParametrosComponent, {
                width: 'auto',
                height: 'auto',
                data: {
                  dataA: this.cod_id_tipo_modal,
                  dataB: this.id_proforma_numero_id,
                  dataPermiso: "GENERAR REMISION CON MONTO TOTAL QUE NO IGUALA CON PROFORMA",
                  dataCodigoPermiso: "147",
                },
              });

              dialogRefEspeciales_sin_validar_monto_total.afterClosed().subscribe((result: Boolean) => {
                if (result) {
                  // aca la logica despues de grabar y q salte la validaciones poner aca de nuevo la ruta correcta para q se grabe
                  let errorMessage = "CODIGO 147  false/true/true/true/true/false" + + "/false/" + this.sin_validar_empaques + "/" + this.sin_validar_negativos + "/" + this.sin_validar_monto_min_desc + "/" + this.sin_validar_monto_total + "/" + this.sin_validar_doc_ant_inv;

                  return this.api.create('/venta/transac/veremision/grabarNotaRemision/' + this.userConn + "/" + this.cod_id_tipo_modal + "/" + this.usuarioLogueado
                    + "/" + this.desclinea_segun_solicitud + "/" + this.codigo_proforma + "/" + this.id_proforma + "/" + this.nro_id_proforma + "/" + this.BD_storage + "/"
                    + this.txtid_solurgente + "/" + this.txtnroid_solurgente
                    + "/false/" + this.sin_validar_empaques + "/" + this.sin_validar_negativos + "/" + this.sin_validar_monto_min_desc + "/" + this.sin_validar_monto_total + "/" + this.sin_validar_doc_ant_inv, submit_nota_remision)
                    .subscribe({
                      next: async (datav) => {
                        // this.tipoentrega = datav.mensaje;
                        

                        //PRIMERO SE CAMBIAN LOS VALORES Y LUEGO SE LLAMA A LA RECURSIVA
                        this.sin_validar_empaques = true;
                        this.sin_validar_negativos = true;
                        this.sin_validar_monto_min_desc = true;
                        this.sin_validar_monto_total = true;

                        // aca se vuelve RECURSIVA, volviendo a llamar a la funcion pasandole el nuevo codigo_control recibido
                        this.submitDataNotaRemision(codigo_control);

                        
                        setTimeout(() => {
                          this.spinner.hide();
                        }, 1000);
                        return;
                      },

                      error: (err: any) => {
                        
                      },
                      complete: async () => {
                        // this.toastr.success("GUARDADO EXITOSAMENTE");
                        // const resultComplete147 = await this.openConfirmacionDialog("NOTA DE REMISION" + datav.codNotRemision + "-" + datav.nroIdRemision + "GRABADA EXITOSAMENTE", []);
                        // if (resultComplete147) {
                        //   this.mandarAImprimir(datav.codNotRemision);
                        // }
                      }
                    });
                } else {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'SE CANCELO' });
                }
              });
              break;
            case 48:
              const dialogRefEspeciales_sin_validar_doc_ant_inv = this.dialog.open(PermisosEspecialesParametrosComponent, {
                width: 'auto',
                height: 'auto',
                data: {
                  dataA: this.cod_id_tipo_modal,
                  dataB: this.id_proforma_numero_id,
                  dataPermiso: "MODIFICACION ANTERIOR A INVENTARIO",
                  dataCodigoPermiso: "48",
                },
              });

              dialogRefEspeciales_sin_validar_doc_ant_inv.afterClosed().subscribe((result: Boolean) => {
                if (result) {
                  // aca la logica despues de grabar y q salte la validaciones poner aca de nuevo la ruta correcta para q se grabe
                  let errorMessage = "CODIGO 48  /false/true/true/true/true/true" + + "/false/" + this.sin_validar_empaques + "/" + this.sin_validar_negativos + "/" + this.sin_validar_monto_min_desc + "/" + this.sin_validar_monto_total + "/" + this.sin_validar_doc_ant_inv;
                  return this.api.create('/venta/transac/veremision/grabarNotaRemision/' + this.userConn + "/" + this.cod_id_tipo_modal + "/" + this.usuarioLogueado
                    + "/" + this.desclinea_segun_solicitud + "/" + this.codigo_proforma + "/" + this.id_proforma + "/" + this.nro_id_proforma + "/" + this.BD_storage + "/"
                    + this.txtid_solurgente + "/" + this.txtnroid_solurgente +
                    "/false/" + this.sin_validar_empaques + "/" + this.sin_validar_negativos + "/" + this.sin_validar_monto_min_desc + "/" + this.sin_validar_monto_total + "/" + this.sin_validar_doc_ant_inv, submit_nota_remision)
                    .subscribe({
                      next: async (datav) => {
                        // this.tipoentrega = datav.mensaje;
                        

                        //PRIMERO SE CAMBIAN LOS VALORES Y LUEGO SE LLAMA A LA RECURSIVA
                        this.sin_validar_empaques = true;
                        this.sin_validar_negativos = true;
                        this.sin_validar_monto_min_desc = true;
                        this.sin_validar_monto_total = true;
                        this.sin_validar_doc_ant_inv = true;

                        // aca se vuelve RECURSIVA, volviendo a llamar a la funcion pasandole el nuevo codigo_control recibido
                        this.submitDataNotaRemision(codigo_control);

                        setTimeout(() => {
                          this.spinner.hide();
                        }, 1000);
                        return;
                      },

                      error: (err: any) => {
                        
                      },
                      complete: async () => {
                        // this.toastr.success("GUARDADO EXITOSAMENTE");
                        // const resultComplete48 = await this.openConfirmacionDialog("NOTA DE REMISION" + datav.codNotRemision + "-" + datav.nroIdRemision + "GRABADA EXITOSAMENTE", []);
                        // if (resultComplete48) {
                        //   this.mandarAImprimir(datav.codNotRemision);
                        // }
                      }
                    });
                } else {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'SE CANCELO"' });
                }
              });
              break;

            default:
              break;
          }

          this.log_module.guardarLog(this.ventana, "CREAR" + datav.codproforma, "POST", this.cod_id_tipo_modal, this.id_proforma_numero_id);
          // this.toastr.success(datav.resp);
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err: any) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      });
  }

  // COMPONENTE
  totabilizarYGrabar() {
    // ACA RUTA 
    // BTN GRABAR DE MODAL
    let total_proforma_concat: any = [];

    //valor del check en el mat-tab complementar proforma
    if (this.complementopf === false || this.complementopf === undefined) { //valor del check en el mat-tab complementar proforma this.disableSelectComplemetarProforma.value 
      this.complementopf = 0;
    } else {
      this.complementopf = 1;
    }

    if (this.array_items_carrito_y_f4_catalogo.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO HAY ITEMS EN EL DETALLE DE PROFORMA' });
    };

    // si hay negativos no tiene q dejar grabar
    // if (this.validacion_post_negativos.length > 0) {
    //   this.toastr.warning("HAY ITEM'S NEGATIVOS VERIFIQUE, NO SE GRABO");
    // };

    if (this.habilitar_desct_sgn_solicitud === undefined) {
      this.habilitar_desct_sgn_solicitud = false;
    };

    let a = [this.FormularioData.value].map((element) => ({
      ...element,
      descuentos: this.des_extra,
      contra_entrega: this.contra_entrega,
      codproforma: this.codigo_proforma,
      tipo_docid: this.tipo_doc_cliente,
      venta: this.es_venta,
      codalmacen_saldo: this.almacn_parame_usuario_almacen,
      descarga: true,
      tipo_venta: 0,
    }));

    total_proforma_concat = {
      veproforma: a[0], //este es el valor de todo el formulario de proforma
      veproforma1_2: this.array_items_carrito_y_f4_catalogo, //este es el carrito con las items
      veproforma_valida: [],
      veproforma_anticipo: [],
      vedesextraprof: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados, //array de descuentos
      verecargoprof: [], //array de recargos
      veproforma_iva: [], //array de iva
      detalleAnticipos: this.tabla_anticipos === undefined ? [] : this.tabla_anticipos,
    };
    if (this.habilitar_desct_sgn_solicitud != undefined && this.complementopf != undefined) {
      
      this.spinner.show();
      let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/veproforma/totabilizarProf/";
      return this.api.create("/venta/transac/veproforma/totabilizarProf/" + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/" +
        "false" + "/" + this.tipo_complementopf_input + "/" + this.desct_nivel_actual + "/" + this.codcliente_real_para_parametro, total_proforma_concat).pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (datav) => {
            this.totabilizar_post = datav;
            
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! TOTALIZADO EXITOSAMENTE !' })
            this.log_module.guardarLog(this.ventana, "GRABAR" + datav.codNotRemision, "POST", this.cod_id_tipo_modal, this.id_proforma_numero_id);

            this.getNombreDeDescuentos(datav.totales.tablaDescuentos);
            
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
            this.total = this.totabilizar_post.totales?.total;
            this.subtotal = this.totabilizar_post.totales?.subtotal;
            this.recargos = this.totabilizar_post.totales?.recargo;
            this.des_extra = this.totabilizar_post.totales?.descuento;
            this.iva = this.totabilizar_post.totales?.iva;
            this.peso = Number(this.totabilizar_post.totales?.peso);

            this.totabilizar_post?.detalleProf.forEach((element, index) => {
              element.orden = index + 1;
            });

            this.array_items_carrito_y_f4_catalogo = this.totabilizar_post?.detalleProf;

            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
              if (this.total != 0) {
                const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
                  width: 'auto',
                  height: 'auto',
                  data: { mensaje_dialog: "¿ DESEA GRABAR LA NOTA DE REMISION SIN REALIZAR NINGUNA MODIFICACION ?" },
                  disableClose: true,
                });

                dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe((result: Boolean) => {
                  if (result) {
                    
                    this.submitDataNotaRemisiontotabilizarYGrabar();
                  } else {
                    
                  }
                });
              }
            }, 50);
          }
        })
    } else {
      this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'REVISE FORMULARIO' });
      
    }
  }

  //MODAL ACA
  submitDataNotaRemisiontotabilizarYGrabar() {
    console.time('Tiempo de la petición HTTP');

    let a = [this.FormularioData.value].map((element) => ({
      ...element,
      descuentos: this.des_extra,
      contra_entrega: this.contra_entrega,
      codproforma: this.codigo_proforma,
      tipo_docid: this.tipo_doc_cliente,
      venta: this.es_venta,
      codalmacen_saldo: this.almacn_parame_usuario_almacen,
      descarga: true,
      tipo_venta: 0,
      tipopago: this.tipopago,
    }));

    let submit_nota_remision = {
      veremision: a[0],
      veremision1: this.array_items_carrito_y_f4_catalogo,
      vedesextraremi: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados,
      verecargoremi: [],
      veremision_iva: this.tablaIva === undefined ? [] : this.tablaIva,
      veremision_chequerechazado: {}
    };

    if (this.txtid_solurgente === "" || this.txtid_solurgente === undefined) {
      this.txtid_solurgente = "0";
    }

    if (this.txtnroid_solurgente === "" || this.txtnroid_solurgente === undefined) {
      this.txtnroid_solurgente = "0";
    }

    
    this.spinner.show();
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veremision/grabarNotaRemision/"

    return this.api.create('/venta/transac/veremision/grabarNotaRemision/' + this.userConn + "/" + this.cod_id_tipo_modal + "/" + this.usuarioLogueado
      + "/" + this.desclinea_segun_solicitud + "/" + this.codigo_proforma + "/" + this.id_proforma + "/" + this.nro_id_proforma + "/" + this.BD_storage + "/"
      + this.txtid_solurgente + "/" + this.txtnroid_solurgente + "/true/false/false/false/false/false", submit_nota_remision)
      .subscribe({
        next: async (datav) => {
          
          //this.codigo_control = datav.codigo_control,
          this.dataSource_negativos = new MatTableDataSource(datav.dtnegativos_result);
          this.validacion_post_negativos = datav.dtnegativos_result;

          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: datav.resp });

          if (datav.resp === false) {
            const result = await this.openConfirmacionDialog(datav.msgsAlert, []);
            if (!result) {
              setTimeout(() => {
                this.spinner.hide();
              }, 500);
              return;
            }
          } else {
            const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
              width: '400px',
              height: 'auto',
              data: { mensaje_dialog: datav.resp + "¿ DESEA IMPRIMIR LA NOTA DE REMISION ?" },
              disableClose: true,
            });

            // Esperar a que el diálogo se cierre y capturar el resultado usando takeUntil
            dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe(async (dialogReConfirmImpresion) => {
              // Procesar la respuesta del diálogo
              if (!dialogReConfirmImpresion) {
                
                window.location.reload();
                return;
              } else {
                this.mandarAImprimir(datav.codNotRemision);
                

                setTimeout(() => {
                  this.spinner.hide();
                }, 500);
              }

              // Completar el observable para que no vuelva a abrir el diálogo
              this.unsubscribe$.next();
              this.unsubscribe$.complete();
            });
          }

          if (datav.mostrarVentanaModifPlanCuotas === true) {
            const result = await this.openConfirmacionDialog("", datav.planCuotas);
            if (!result) {
              setTimeout(() => {
                this.spinner.hide();
              }, 500);
              return;
            }
          };
          console.timeEnd('Tiempo de la petición HTTP');
          

          this.log_module.guardarLog(this.ventana, "GRABAR" + datav.codNotRemision, "POST", this.cod_id_tipo_modal, this.id_proforma_numero_id);
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        error: (err: any) => {
          
          console.timeEnd('Tiempo de la petición HTTP');
          
        },

        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      });
  }

  mandarAImprimir(cod_nota_remision) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veremision/impresionNotaRemision/"
    

    return this.api.getAll('/venta/transac/veremision/impresionNotaRemision/' + this.userConn + "/" + this.codcliente_real_para_parametro + "/" +
      this.BD_storage + "/" + this.codcliente_real_descripcion + "/" + this.preparacion + "/" + cod_nota_remision)
      .subscribe({
        next: (datav) => {
          

          this.log_module.guardarLog(this.ventana, "Impresion" + datav.codproforma, "POST", this.cod_id_tipo_modal, this.id_proforma_numero_id);
          
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'IMPRIMIENDO 🖨️' })
          // la data se guarda en la session storage para poder mandarlo a imprimir
          // pero creo q no sera necesario
          this.guardarDataImpresion(cod_nota_remision);
        },

        error: (err: any) => {
          
        },

        complete: () => {
          setTimeout(() => {
            window.location.reload();
          }, 500)
        }
      });
  }

  guardarDataImpresion(codigo_proforma_submitdata) {
    let data = [{
      codigo_proforma: codigo_proforma_submitdata,
      cod_cliente: this.codigo_cliente,
      cod_cliente_real: this.codigo_cliente_catalogo_real,
      cmbestado_contra_entrega: this.contra_entrega,
      estado_contra_entrega: this.estado_contra_entrega_input,
      codigo_vendedor: this.cod_vendedor_cliente
    }];

    sessionStorage.setItem('data_impresion', JSON.stringify(data));
  }

  getIDScomplementarProforma() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + 2)
      .subscribe({
        next: (datav) => {
          this.ids_complementar_proforma = datav;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  totabilizar() {
    let total_proforma_concat: any = [];

    if (this.array_items_carrito_y_f4_catalogo.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO HAY ITEMS EN EL DETALLE DE PROFORMA ' });
    };

    if (this.habilitar_desct_sgn_solicitud === undefined) {
      this.habilitar_desct_sgn_solicitud = false;
    };

    total_proforma_concat = {
      veproforma: this.FormularioData.value, //este es el valor de todo el formulario de proforma
      veproforma1_2: this.array_items_carrito_y_f4_catalogo, //este es el carrito con las items
      veproforma_valida: [],
      veproforma_anticipo: [],
      vedesextraprof: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados, //array de descuentos
      verecargoprof: [], //array de recargos
      veproforma_iva: [], //array de iva
      detalleAnticipos: this.tabla_anticipos === undefined ? [] : this.tabla_anticipos,
    };

    if (this.habilitar_desct_sgn_solicitud != undefined && this.complementopf != undefined) {
      
      this.spinner.show();
      let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/veproforma/totabilizarProf/";
      return this.api.create("/venta/transac/veproforma/totabilizarProf/" + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/" +
        "false" + "/" + this.tipo_complementopf_input + "/" + this.desct_nivel_actual + "/" + this.codcliente_real_para_parametro, total_proforma_concat)
        .subscribe({
          next: (datav) => {
            this.totabilizar_post = datav;
            
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! TOTALIZADO EXITOSAMENTE !' })
            

            this.getNombreDeDescuentos(datav.totales.tablaDescuentos);
            // this.array_de_descuentos_ya_agregados = ;
            setTimeout(() => {
              this.spinner.hide();
            }, 500);
          },

          error: (err) => {
            

            setTimeout(() => {
              this.spinner.hide();
            }, 500);
          },
          complete: () => {
            this.total = this.totabilizar_post.totales?.total;
            this.subtotal = this.totabilizar_post.totales?.subtotal;
            this.recargos = this.totabilizar_post.totales?.recargo;
            this.des_extra = this.totabilizar_post.totales?.descuento;
            this.iva = this.totabilizar_post.totales?.iva;
            this.peso = Number(this.totabilizar_post.totales?.peso);
            // this.tablaIva = this.totabilizar_post.totales?.tablaIva;
            const item_procesados_en_total = this.totabilizar_post?.detalleProf;

            // Agregar el número de orden a los objetos de datos
            this.totabilizar_post?.detalleProf.forEach((element, index) => {
              element.orden = index + 1;
            });

            this.array_items_carrito_y_f4_catalogo = this.totabilizar_post?.detalleProf.sort((a, b) => {
              if (a.coditem < b.coditem) {
                return -1;
              } else if (a.coditem > b.coditem) {
                return 1;
              } else {
                return 0;
              }
            });;
          }
        })
    } else {
      this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'REVISE FORMULARIO' });
      
    }
  }

  habilitarComplementarProforma() {
    
    // this.disableSelectComplemetarProforma = true;
  }

  buscadorIDComplementarProforma(complemento_id, complemento_numero_id) {
    
    let b = this.id_proforma_numero_id.toString();
    

    if (this.disableSelectComplemetarProforma === false) {
      this.complementopf = 0;
    } else {
      this.complementopf = 1;
    }

    this.valor_formulario = [this.FormularioData.value];

    this.valor_formulario.map((element: any) => {
      this.valor_formulario_copied_map_all_complementar = {
        ...element,
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString() || '',
        codcliente: element.codcliente?.toString() || '',
        nombcliente: element.nombcliente?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_doc_id?.toString() || '',
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
        contra_entrega: element.contra_entrega === true ? "SI" : "NO",
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
        estado_doc_vta: "NUEVO",
        codtarifadefecto: "1",
        desctoespecial: "0",
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
        totrecargos: 0,
        idFC_complementaria: "",
        nroidFC_complementaria: "",
        fechalimite_dosificacion: "2030-04-10",
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
      }, 150);
      return;
    }

    return this.api.create("/venta/transac/veproforma/recuperarPfComplemento/" + this.userConn + "/" + complemento_id + "/" +
      complemento_numero_id + "/" + this.tipo_complementopf_input + "/" + this.BD_storage, proforma_validar)
      .subscribe({
        next: (datav) => {
          
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

  formatNumberTotalSubTOTALES(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_2decimales.format(formattedNumber);
  }

  formatNumberTotalSub(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_5decimales.format(formattedNumber);
  }

  itemDataAll(codigo) {
    // this.getSaldoEmpaquePesoAlmacenLocal(codigo);
    this.getEmpaqueItem(codigo);
    this.getSaldoItemSeleccionadoDetalle(codigo);
    this.getAlmacenesSaldos();
    // this.getSaldoItem(codigo);
    this.getPorcentajeVentaItem(codigo);

    this.saldo_modal_total_1 = "";
    this.saldo_modal_total_2 = "";
    this.saldo_modal_total_3 = "";
    this.saldo_modal_total_4 = "";
    this.saldo_modal_total_5 = "";
  }

  getSaldoItemSeleccionadoDetalle(item) {
    this.item_seleccionados_catalogo_matriz_codigo = item;

    let agencia_concat = "AG" + this.agencia_logueado;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll
      ('/venta/transac/veproforma/getsaldosCompleto/' + this.userConn + "/" + agencia_concat + "/" + this.agencia_logueado + "/" + item + "/" + this.BD_storage + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.id_tipo = datav;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  // eventos de seleccion en la tabla
  onRowSelect(event: any) {
    
    this.updateSelectedProducts();
  }

  onRowSelectForDelete() {
    

    // Crear una copia del array original para evitar mutaciones directas
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((product: any) => {
      // Verificar si el producto está en la lista de productos seleccionados
      const selectedProduct = this.selectedProducts.find((selected: any) => selected.orden === product.orden);
      if (selectedProduct) {
        // Si está seleccionado, cambiar la cantidad a 0
        return { ...product, cantidad: 0 };
      } else {
        // Si no está seleccionado, devolver el producto sin cambios
        return product;
      }
    });

    // Aquí puedes añadir cualquier lógica adicional, como totabilizar después de cambiar la cantidad a 0
    this.totabilizar();
  }

  onRowUnselect(event: any) {
    
    this.updateSelectedProducts();
  }

  updateSelectedProducts() {
    
  }
  // fin eventos de seleccion en la tabla

  calcularTotalCantidadXPU(cantidad_pedida: number, cantidad: number, precioneto: number) {
    // todo despues del if ya que si no siempre esta escuchando los eventos
    if (cantidad_pedida !== undefined && precioneto !== undefined && cantidad !== undefined) {
      if (this.total_X_PU === true) {
        return this.formatNumberTotalSub(cantidad * precioneto);
      } else {
        // 
        // Realizar cálculos solo si los valores no son undefined
        
        return this.formatNumberTotalSub(cantidad * precioneto);
      }
    } else {
      return 0; // O algún otro valor predeterminado
    }
  }

  validarProformaSoloNegativos() {
    // 00060 - VALIDAR SALDOS NEGATIVOS
    // VACIO - TODOS LOS CONTROLES
    this.valor_formulario = [this.FormularioData.value];
    

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
        ...element,
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString() || '',
        codcliente: element.codcliente?.toString() || '',
        nombcliente: element.nombcliente?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        codcliente_real: element.codcliente_real?.toString() || '',
        nomcliente_real: element.nomcliente_real?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        subtotaldoc: element.subtotal,
        totaldoc: element.total,
        tipo_vta: element.tipopago?.toString() || '',
        tipo_doc_id: element.tipo_doc_id?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        preparacion: element.preparacion,
        contra_entrega: element.contra_entrega?.toString() === true ? "SI" : "NO",
        vta_cliente_en_oficina: element.venta_cliente_oficina,
        estado_contra_entrega: element.estado_contra_entrega === undefined ? "SI" : "NO",
        desclinea_segun_solicitud: element.desclinea_segun_solicitud === null ? false : true,
        pago_con_anticipo: element.pago_contado_anticipado,
        niveles_descuento: element.niveles_descuento,
        transporte: element.transporte,
        nombre_transporte: element.nombre_transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: element.tipoentrega,
        direccion: element.direccion,
        ubicacion: element.ubicacion === null ? "" : element.ubicacion,
        latitud: element.latitud_entrega,
        longitud: element.longitud_entrega,
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        tipo_complemento: tipo_complemento,
        fechadoc: element.fecha,
        idanticipo: element.idanticipo,
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
        estado_doc_vta: "NUEVO",
        codtarifadefecto: "1",
        desctoespecial: "0",
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
        totrecargos: 0,
        idpf_complemento: "",
        nroidpf_complemento: "",
        idFC_complementaria: "",
        nroidFC_complementaria: "",
        fechalimite_dosificacion: "2030-04-10T00:00:00.532Z",

        idpf_solurgente: this.id_proforma.toString(),
        noridpf_solurgente: this.nro_id_proforma.toString(),
      }
    });

    // boolean que verifica que el formulario este con sus data llenada
    this.submitted = true;
    if (this.FormularioData.valid) {
      this.spinner.show();
      
      // 

      this.valor_formulario_negativos = [this.valor_formulario_negativos].map((element) => ({
        ...element,
        id: this.id_proforma,
        numeroid: this.nro_id_proforma.toString(),
      }));

      let proforma_validar = {
        datosDocVta: this.valor_formulario_negativos[0],
        detalleAnticipos: [],
        detalleDescuentos: [],
        //detalleEtiqueta: [this.etiqueta_get_modal_etiqueta],
        detalleEtiqueta: [],
        detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
        detalleRecargos: [],
      }

      
      const url = `/venta/transac/veproforma/validarProforma/${this.userConn}/00060/proforma/grabar_aprobar/${this.BD_storage}/${this.usuarioLogueado}`;
      const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;

      this.api.create(url, proforma_validar).subscribe({
        next: (datav) => {
          this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'VALIDACION CORRECTA NEGATIVOS ✅' });
          if (datav.jsonResult) {
            this.validacion_post_negativos = datav.jsonResult[0].dtnegativos;
          }
          

          this.toggleTodosNegativos = true;
          this.toggleNegativos = false;
          this.togglePositivos = false;

          this.array_items_carrito_y_f4_catalogo = datav.itemDataMatriz;
          this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos);

          this.abrirTabPorLabel("Negativos");
          setTimeout(() => {
            this.spinner.hide();
          }, 500);

        },
        error: (err) => {
          
          setTimeout(() => {
            this.spinner.hide();
          }, 150);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      });
    } else {
      this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'REVISE FORMULARIO' })
      
    }
  }

  getNombreDeDescuentos(array_descuentos) {
    

    let errorMessage: string = "La Ruta presenta fallos al hacer peticion POST -/venta/transac/veproforma/getDescripDescExtra/";
    return this.api.create('/venta/transac/veproforma/getDescripDescExtra/' + this.userConn, array_descuentos)
      .subscribe({
        next: (datav) => {
          
          this.array_de_descuentos_ya_agregados = datav.tabladescuentos;
          this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados?.map((element) => ({
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

  abrirTabPorLabel(label: string) {
    //abre tab por el id de su etiqueta, muy buena funcion xD
    const tabs = this.tabGroup._tabs.toArray(); // Obtener todas las pestañas del mat-tab-group
    const index = tabs.findIndex(tab => tab.textLabel === label); // Encontrar el índice del mat-tab con el label dado
    if (index !== -1) {
      this.tabGroup.selectedIndex = index; // Establecer el índice seleccionado del mat-tab-group
    }
  }

  cantidadChangeMatrix(elemento: any, newValue: number) {
    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;

    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";

    this.total_desct_precio = false;
    this.total_X_PU = true;

    this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
      + this.usuarioLogueado + "/" + elemento.coditem + "/" + elemento.codtarifa + "/" + elemento.coddescuento + "/" + elemento.cantidad_pedida +
      "/" + elemento.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
      .subscribe({
        next: (datav) => {
          //this.almacenes_saldos = datav;
          
          // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
          elemento.coddescuento = Number(datav.coddescuento);
          elemento.preciolista = Number(datav.preciolista);
          elemento.preciodesc = Number(datav.preciodesc);
          elemento.precioneto = Number(datav.precioneto);
        },

        error: (err: any) => {
          
        },
        complete: () => {
        }
      });
  }

  getPorcentajeVentaItem(item) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/mant/inmatriz/infoItemRes/";
    return this.api.getAll('/inventario/mant/inmatriz/infoItemRes/' + this.userConn + "/" + this.agencia_logueado + "/" + item + "/" +
      this.cod_precio_venta_modal_codigo + "/" + this.cod_descuento_modal_codigo + "/" + this.codcliente_real_para_parametro)
      .subscribe({
        next: (datav) => {
          this.item_obtenido = datav;
          
          this.porcen_item = this.item_obtenido.porcen_maximo;
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  openConfirmacionDialog(message: string, array): Promise<boolean> {
    //btn aceptar
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: message, msj_array: array },
      disableClose: true,
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  tranferirNotasRemision() {
    this.dialog.open(ModalTransfeNotaRemisionComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalTipoID(): void {
    this.dialog.open(CatalogoNotasRemisionComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalPrecioVenta(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalDescuentoEspecial(): void {
    this.dialog.open(ModalDescuentosComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalMatrizProductos(): void {
    this.dialog.open(MatrizItemsComponent, {
      width: 'auto',
      height: '900px',
      disableClose: true,
    });
  }

  modalClientesInfo(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ModalClienteInfoComponent, {
      width: 'auto',
      height: '600px',
      disableClose: true,
      enterAnimationDuration,
      exitAnimationDuration,
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
        posicion_fija: posicion_fija
      },
    });
  }

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

  modalIva() {
    
    this.dialog.open(ModalIvaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { tablaIva: this.tablaIva },
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

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}