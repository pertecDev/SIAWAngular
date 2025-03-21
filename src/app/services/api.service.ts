import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RefreshPasswordComponent } from '@modules/refresh-password/refresh-password.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { PeriodoSistemaService } from './periodoSistema/periodo-sistema.service';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public ventana_estado: any = [{
    ventana: "",
    url: "",
    estado: "",
  }];

  data: any = [];
  rol: any;
  code_error: number;

  @Output() newItemEvent = new EventEmitter<string>();

  public dato_local_storage;
  public dato_local_session;
  public token;
  public agencia;
  public usuario_logueado: any;
  public session: any;

  public userConn: any;
  public token_alone: any;
  public BD_storage: any;
  public usuarioLogueado: any;

  public monedaBase: any;
  public usuario_storage;
  public agencia_storage;
  public periodo_abierto;
  public statusInternet: boolean = true;

  private readonly API_URL = 'http://192.168.31.240/API_SIAW/api'; // MAQUINA RODRI
  // private readonly API_URL = 'http://192.168.40.5/API_SIAW/api'; // LA PAZ
  // private readonly API_URL = 'http://192.168.30.5/API_SIAW/api'; // CBBA
  // private readonly API_URL = 'http://192.168.80.5/API_SIAW/api'; // STCZ

  // TIENDAS
  // private readonly API_URL = 'http://192.168.33.99/API_SIAW/api'; // CBBA QUILLACOLLO

  constructor(private http: HttpClient, private router: Router, private spinner: NgxSpinnerService,
    public _snackBar: MatSnackBar, public dialog: MatDialog, private toastr: ToastrService, private datePipe: DatePipe,
    public periodoSistemaService: PeriodoSistemaService) {

    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.token = sessionStorage.getItem("token") !== undefined ? JSON.parse(sessionStorage.getItem("token")) : null;
    this.token_alone = this.token;

    this.verificarInternet();
    // 
  }

  login(url: string, data): Observable<any> {
    return this.http.post(this.API_URL + url, data).pipe(
      catchError((err) => {
        
        return throwError(() => new Error());
      })
    )
  }

  getAll(url: string): Observable<any> {
    return this.http.get<object[]>(this.API_URL + url).pipe(
      catchError((err) => {
        
        return throwError(() => new Error());
      })
    )
  }

  getSimple(url: string): Observable<any> {
    return this.http.get<object[]>(url).pipe(
      catchError((err) => {
        
        return throwError(() => new Error());
      })
    )
  }

  createAllWithOutToken(url: string, obj): Observable<any> {
    return this.http.post(this.API_URL + url, obj).pipe(
      catchError((err) => {
        
        return throwError(() => new Error());
      })
    )
  }

  create(url: string, obj): Observable<any> {
    // 
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": "bearer" + " " + this.token,
      })
    };

    return this.http.post(this.API_URL + url, obj, httpOptions).pipe(
      catchError((err) => {
        
        return throwError(() => new Error());
      })
    )
  }

  update(url: string, obj): Observable<any> {
    // 

    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": "bearer" + " " + this.token,
      })
    };

    return this.http.put(this.API_URL + url, obj, httpOptions).pipe(
      catchError((err) => {
        
        return throwError(() => new Error());
      })
    )
  }

  delete(id: string) {
    // 
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": "bearer" + " " + this.token,
      })
    };

    return this.http.delete(this.API_URL + id, httpOptions).pipe(
      catchError((err) => {
        
        return throwError(() => new Error());
      })
    )
  }

  getById(id: string): Observable<any> {
    return this.http.get(this.API_URL + id).pipe(//Aumentar el ID al momento de traer
      catchError((err) => {
        
        return throwError(() => new Error());
      })
    )
  }

  obtenerUsuarioLogueado() {
    this.dato_local_storage = localStorage.getItem('usuario_logueado');
    this.dato_local_session = sessionStorage.getItem('usuario_logueado');
  }

  obtenerUsuarioStorage() {
    this.usuario_storage = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    return this.usuario_storage;
  }

  obtenerAgenciaStorage() {
    this.agencia_storage = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
    return this.agencia_storage;
  }

  obtenerToken() {
    return this.token = sessionStorage.getItem('token');
  }

  obtenerAgencia() {
    return this.agencia = sessionStorage.getItem('agencia_logueado');
  }

  verificarToken() {
    let token = sessionStorage.getItem('token');

    return this.delete('/seg_adm/login/eliminaToken/' + token)
      .subscribe({
        next: (datav) => {
          
        },
        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getRolUserParaVentana(ventana) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET, en la ruta -/seg_adm/mant/adusuario/";
    return this.getAll('/seg_adm/mant/adusuario/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.rol = datav.codrol;
          // 
        },
        error: (err: any) => {
          
        },
        complete: () => {
          this.verificarAccesoVentanaGlobal(this.rol, ventana);
        }
      })
  }

  //Funcion que verifica la accesibilidad de las ventanas
  //cod_rol, seprograma
  verificarAccesoVentanaGlobal(cod_rol, nombre_venta) {
    let data: any = { "codrol": cod_rol, "programa": nombre_venta };
    let errorMessage = "La Ruta presenta fallos al hacer peticion POST --/seg_adm/oper/verificaserolprogs/";

    return this.create('/seg_adm/oper/prgaccesosrol/verificaserolprogs/' + this.userConn, data)
      .subscribe({
        next: (datav) => {
          
          if (datav == true) {
            setTimeout(() => {
              this.spinner.hide();
            }, 50);
          }
        },
        error: (err: any) => {
          
          this.toastr.error('SIN Acceso a la Ventana! 😢',);
          this.router.navigate(['/']);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      })
  }

  refrescarContrasenia(): void {
    // Esta funcion abre un modal en el cual coloca una nueva contrasenia si la actual ya vencio
    const dialogRef = this.dialog.open(RefreshPasswordComponent, {
      width: 'auto',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  getVerificarPeriodoAbierto(fecha, modulo) {
    

    let date_pipe;
    // retorna un true/false
    /* 'detalle de modulos
        '1 : administracion
        '2 : inventario
        '3 : ventas
        '4 : cuentas por cobrar
        '5 : contabilidad
        '6 : activos fijos
        '7 : costo y costeo
        '8 : compras y ctas por pagar
        '9 : personal y planillas
        '10: seguridad
        '11: compras menores
        '12: fondos
    */

    date_pipe = this.datePipe.transform(fecha, "yyyy-MM-dd")
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET, en la ruta /seg_adm/mant/abmadapertura/verificaPeriodoAbierto/ --Vista LOG/Angular";
    this.getAll('/seg_adm/mant/abmadapertura/verifPeriodoAbierto/' + this.userConn + "/" + date_pipe + "/" + modulo)
      .subscribe({
        next: (datav) => {
          this.periodo_abierto = datav;
          

          if (this.periodo_abierto == true) {
            this.toastr.success('! PERIODO ABIERTO !');
            this.periodoSistemaService.disparadorDeBooleanoPeriodoSistema.emit({
              periodo: true,
            });
          } else {
            this.toastr.warning('! PERIODO CERRADO !');
            this.periodoSistemaService.disparadorDeBooleanoPeriodoSistema.emit({
              periodo: false,
            });
          }
          return this.periodo_abierto;
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  ventanaAbiertaCerrada(nombre_ventana, ruta, estado) {
    this.ventana_estado.push({ ventana: nombre_ventana, ruta: ruta, estado: estado });

    

    if (!this.ventana_estado.find(elemento => elemento.nombre_ventana === this.ventana_estado.ventana)) {
      this.ventana_estado.push({ ventana: nombre_ventana, ruta: ruta, estado: estado });
    } else {
      
    }
  }

  cargarArchivo(url: string, formData: FormData): Observable<any> {
    return this.http.post(this.API_URL + url, formData);
  }

  descargarArchivo(url: string, options: any): Observable<ArrayBuffer> {
    return this.http.get(this.API_URL + url, { ...options, responseType: 'arraybuffer' as 'json' });
  }

  verificarInternet() {
    if (navigator.onLine === true) {
      this.statusInternet = true;
      // 
    } else {
      this.statusInternet = false;
      // 
    }

    setTimeout(() => {
      this.spinner.hide();

    }, 1000);
  }

  async logout() {
    this.eliminarToken();

    // localStorage.removeItem("usuario_logueado");
    sessionStorage.removeItem("usuario_logueado");

    // localStorage.removeItem("agencia_logueado");
    sessionStorage.removeItem("agencia_logueado");

    // localStorage.removeItem("bd_logueado");
    sessionStorage.removeItem("bd_logueado");

    // localStorage.removeItem("user_conn");
    sessionStorage.removeItem("user_conn");

    // localStorage.removeItem("contrasenia");
    sessionStorage.removeItem("contrasenia");

    // localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    sessionStorage.removeItem("data_impresion");

    localStorage.removeItem("data_impresion");
    return this.router.navigate(['/login']);
  }

  eliminarToken() {
    return this.delete('/seg_adm/login/logout/' + this.userConn + "/" + this.token)
      .subscribe({
        next: (datav) => {
          
        },
        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }
}
