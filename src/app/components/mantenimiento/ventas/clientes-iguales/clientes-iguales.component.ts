import { AfterContentInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { veClientesIguales } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ClientesIgulesService } from './servicio-clientes-iguales/clientes-igules.service';
import { CatalogoClientesIgualesComponent } from './catalogo-clientes-iguales/catalogo-clientes-iguales.component';
import { ServicioalmacenService } from '../../inventario/almacen/servicioalmacen/servicioalmacen.service';
import { DatePipe } from '@angular/common';
import { Interceptor } from '@services/interceptor';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-clientes-iguales',
  templateUrl: './clientes-iguales.component.html',
  styleUrls: ['./clientes-iguales.component.scss']
})

export class ClientesIgualesComponent implements OnInit, AfterContentInit {

  @HostListener("document:keydown.F4", []) unloadHandler(event: KeyboardEvent) {
    
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      

      switch (elementTagName) {
        case "clienteA":
          this.modalClientes();
          break;
        case "clienteB":
          this.modalClientesB();
          break;
        case "almacen":
          this.modalAlmacen();
          break;
      }
    }
  };

  FormularioData: FormGroup;
  dataform: any = '';

  userConn: any;
  usuarioLogueado: any;
  codigo_cliente_catalogo_nombreA: any;
  codigo_cliente_catalogo_nombreB: any;
  almacen_id: any;
  almacen_descripcion: string;

  clientesIguales: any = [];
  data: [];
  codigo_cliente_catalogo: any = [];
  codigo_cliente_catalogo_2: any = [];
  cod_almacen_cliente: any = [];
  area_clientes_iguales: any = [];
  cliente: any = [];
  agencia_get: any = [];
  cliente_id: any = [];

  er: string;
  displayedColumns = ['codcliente_a', 'razonsocial_a', 'codcliente_b', 'razonsocial_b', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | veClientesIguales>('');
  options: veClientesIguales[] = [];
  filteredOptions: Observable<veClientesIguales[]>;

  nombre_ventana: string = "abmveclientesiguales.vb";
  public ventana = "Clientes Iguales"
  public detalle = "clientes-iguales";
  public tipo = "clientes-iguales-CREATE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService,  private messageService: MessageService, public nombre_ventana_service: NombreVentanaService,
    public servicioCliente: ClientesIgulesService, public almacenservice: ServicioalmacenService,
    private _formBuilder: FormBuilder, private datePipe: DatePipe, public interc: Interceptor) {

    this.er = this.interc.err;

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.api.getRolUserParaVentana(this.nombre_ventana);

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
    this.mandarNombre();
    this.getClientesIguales();
  }

  ngAfterContentInit(): void {
    this.getAlmacen();

    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.servicioCliente.disparadorDeClienteA.subscribe(data => {
      
      this.codigo_cliente_catalogo = data.cliente;
      this.codigo_cliente_catalogo_nombreA = data.cliente.nombre;
      
    });

    this.almacenservice.disparadorDeAlmacenes.subscribe(data => {
      
      this.cod_almacen_cliente = data.almacen;
      this.almacen_descripcion = this.cod_almacen_cliente.descripcion
    });

    this.servicioCliente.disparadorDeClienteB.subscribe(data2 => {
      
      this.codigo_cliente_catalogo_2 = data2.cliente;
      this.codigo_cliente_catalogo_nombreB = data2.cliente.nombre;
    });
  }

  private _filter(name: string): veClientesIguales[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codcliente_a.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: veClientesIguales): string {
    return user && user.codcliente_a ? user.codcliente_a : '';
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      codcliente_a: [this.dataform.codcliente_a, Validators.compose([Validators.required])],
      codcliente_b: [this.dataform.codcliente_b, Validators.compose([Validators.required])],
      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /venta/mant/veclientesiguales/";

    return this.api.create("/venta/mant/veclientesiguales/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.area_clientes_iguales = datav;

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.spinner.show();
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'Guardado con Exito! 🎉' })
          this.getClientesIguales();
        },

        error: (err) => {
        },
        complete: () => { }
      })
  }

  getClientesIguales() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/veclientesiguales/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.clientesIguales = datav;
          

          this.dataSource = new MatTableDataSource(this.clientesIguales);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  eliminar(element) {
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:--  seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/venta/mant/veclientesiguales/' + this.userConn + "/" + element.codcliente_a + "/" + element.codcliente_b)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
              this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! ELIMINADO EXITOSAMENTE !' })
              location.reload();
            },
            error: (err: any) => {
              
            },
            complete: () => { }
          })
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '! CANCELADO !' });
      }
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  modalClientes(): void {
    this.dialog.open(CatalogoClientesIgualesComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataCatalogo: 'A' }
    });
  }

  modalClientesB(): void {
    this.dialog.open(CatalogoClientesIgualesComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataCatalogo: 'B' }
    });
  }

  getClienteCatalogo() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/vecliente/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.cliente = datav;
          

        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getClienteId(id: string, id_input) {
    let nombre_comercial;
    let razonsocial;
    return this.api.getAll('/venta/mant/vecliente/' + this.userConn + "/" + id)
      .subscribe({
        next: (datav) => {
          this.cliente_id = datav;
          

          if (id_input === "clienteA") {
            this.cliente_id.cliente.nombre_comercial;

            nombre_comercial = this.cliente_id.cliente.nombre_comercial;
            razonsocial = this.cliente_id.cliente.razonsocial;

            this.codigo_cliente_catalogo_nombreA = nombre_comercial + razonsocial;

          } if (id_input === "clienteB") {
            this.cliente_id.cliente.nombre_comercial;

            nombre_comercial = this.cliente_id.cliente.nombre_comercial;
            razonsocial = this.cliente_id.cliente.razonsocial;

            this.codigo_cliente_catalogo_nombreB = nombre_comercial + razonsocial;
          }
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getAlmacen() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/mant/inalmacen/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.agencia_get = datav;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getAlmacenId(id: any) {
    return this.api.getAll('/inventario/mant/inalmacen/consultaAlm/' + this.userConn + "/" + id)
      .subscribe({
        next: (datav) => {
          this.almacen_id = datav;
          

          this.almacen_descripcion = this.almacen_id.descripcion;
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      data: { almacen: "almacen" }
    });
  }

  onLeave(event: any, id_input: any) {
    const inputValue = event.target.value;

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.clientesIguales.some(objeto => objeto.codcliente_a === inputValue);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      
    } else {
      if (id_input === "clienteA") {
        this.getClienteId(inputValue, 'clienteA');
      } else {
        this.getClienteId(inputValue, 'clienteB');
      }
    }

    // Puedes realizar otras acciones según tus necesidades
    
  }

  onLeaveAlmacen(event: any) {
    const inputValue = event.target.value;

    let miNumero = parseInt(inputValue, 10);
    
    const encontrado = this.agencia_get.some(objeto => objeto.codigo === miNumero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      
    } else {
      this.getAlmacenId(inputValue);
    }

    // Puedes realizar otras acciones según tus necesidades
    
  }
}
