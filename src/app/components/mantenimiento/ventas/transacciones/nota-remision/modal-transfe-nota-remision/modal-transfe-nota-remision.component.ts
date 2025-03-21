import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServicioTransfeNotaRemisionService } from './servicio-tranfe-a-nota-remision/servicio-transfe-nota-remision.service';
import { ServicioCatalogoProformasService } from '../../proforma/sevicio-catalogo-proformas/servicio-catalogo-proformas.service';
import { CatalogoProformasComponent } from '../../proforma/catalogo-proformas/catalogo-proformas.component';
import { ServicioTransfeAProformaService } from '../../proforma/modal-transfe-proforma/servicio-transfe-a-proforma/servicio-transfe-a-proforma.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-modal-transfe-nota-remision',
  templateUrl: './modal-transfe-nota-remision.component.html',
  styleUrls: ['./modal-transfe-nota-remision.component.scss']
})
export class ModalTransfeNotaRemisionComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler1() {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      

      switch (elementTagName) {
        case "inputCatalogoCliente":
          this.validarNotaRemisionParaTransferir();
          break;
      }
    }
  };

  transferir_get: any = [];
  id_numero_id_proforma: any = [];
  cotizaciones: any = [];

  proforma_get: any = [];
  cotizaciones_get: any = [];

  id_proformas: any;
  numero_id_proformas: any;
  id_cotizaciones: any;
  numero_id_cotizaciones: any;
  BD_storage: any;
  userConn: any;

  isCheckedProformas: boolean = true;
  isCheckedCotizaciones: boolean = false;

  constructor(public dialog: MatDialog, private api: ApiService, public servicioTransANotasRemision: ServicioTransfeNotaRemisionService,
    public dialogRef: MatDialogRef<ModalTransfeNotaRemisionComponent>, public servicioTransfeProformaCotizacion: ServicioTransfeAProformaService,
    private spinner: NgxSpinnerService, private messageService: MessageService,
    public servicioCatalogoProformas: ServicioCatalogoProformasService) {

    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
  }

  ngOnInit() {
    //CatalogoProforma
    this.servicioCatalogoProformas.disparadorDeIDProforma.subscribe(data => {
      
      this.id_numero_id_proforma = data;
      this.id_proformas = data.proforma.id;
    });
    //

    //CatalogoCotizacion
    this.servicioCatalogoProformas.disparadorDeIDCotizacion.subscribe(data => {
      
      this.cotizaciones = data;
      this.id_cotizaciones = data.cotizacion.id;
    });
    //

    this.getProforma();
    // this.getCotizaciones();
  }

  getProforma() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET - /venta/mant/venumeracion/catalogo/2";
    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + "2")
      .subscribe({
        next: (datav) => {
          this.proforma_get = datav;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  validarNotaRemisionParaTransferir() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veremision/validaTranferencia/";
    return this.api.getAll('/venta/transac/veremision/validaTranferencia/' + this.userConn + "/" + this.id_proformas + "/" + this.numero_id_proformas)
      .subscribe({
        next: (datav) => {
          // this.transferir_get = datav;
          
          if (datav.resp === "Transfiriendo Proforma") {
            this.transferirANotaRemision(datav.codProforma);
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp.toUpperCase() });
  
          } else {
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'Proforma No Transferida' });
  
          }
        },
        error: (err: any) => {
          
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'TRANSFERENCIA FALLO ! ❌' });
        },
        complete: () => {
          this.close();
        }
      })
  }

  transferirANotaRemision(cod_proforma) {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/transfDatosProforma/";
    return this.api.getAll('/venta/transac/veremision/transferirProforma/' + this.userConn + "/" + this.id_proformas + "/" + this.numero_id_proformas + "/" + cod_proforma)
      .subscribe({
        next: (datav) => {
          this.transferir_get = datav;
          
          this.transferirProformaANotaRemision(this.transferir_get);
        },
        error: (err: any) => {
          
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! TRANSFERENCIA FALLO ! ❌' });
  
        },
        complete: () => {
          this.close();
        }
      })
  }

  proformaHabilitar() {
    
    if (!this.isCheckedCotizaciones) {
      this.isCheckedProformas = true;
    } else {
      this.isCheckedProformas = false;
      this.id_proformas = "";
    }
  }

  cotizacionHabilitar() {
    

    if (!this.isCheckedProformas) {
      this.isCheckedCotizaciones = true;
    } else {
      this.isCheckedCotizaciones = false;
      this.id_cotizaciones = "";
    }
  }

  transferirProformaANotaRemision(proforma_get) {
    this.servicioTransfeProformaCotizacion.disparadorDeProformaTransferir.emit({
      proforma_transferir: proforma_get,
    });
  }

  onLeaveIDProformas(event: any) {
    
    const inputValue = event.target.value;

    let cadena = inputValue.toString();
    
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.proforma_get.some(objeto => objeto.id === cadena.toUpperCase());

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      
    } else {
      event.target.value = cadena;
    }
  }

  modalCatalogoProformas(): void {
    this.dialog.open(CatalogoProformasComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  close() {
    this.dialogRef.close();
  }


  // getCotizaciones() {
  //   let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/venumeracion/catalogo/  6";
  //   return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + "6")
  //     .subscribe({
  //       next: (datav) => {
  //         this.cotizaciones_get = datav;
  //         
  //       },

  //       error: (err: any) => {
  //         
  //       },
  //       complete: () => { }
  //     })
  // }

  // transferirCotizaciones() {
  //   let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/transfDatosCotizacion/";

  //   return this.api.getAll('/venta/transac/veproforma/transfDatosCotizacion/' + this.userConn + "/" + this.id_cotizaciones + "/" + this.numero_id_cotizaciones + "/" + this.BD_storage)
  //     .subscribe({
  //       next: (datav) => {
  //         this.transferir_get = datav;
  //         
  //         this.toastr.success('! TRANSFERENCIA EN PROGESO ! ✅');
  //         this.transferirACotizacion(this.transferir_get);
  //         this.spinner.show();
  //         setTimeout(() => {
  //           this.spinner.hide();
  //         }, 1500);
  //         this.close();
  //       },
  //       error: (err: any) => {
  //         
  //         this.toastr.error('! TRANSFERENCIA FALLO ! ❌');
  //       },
  //       complete: () => { }
  //     })
  // }

  // transferirACotizacion(cotizacion_get) {
  //   this.servicioTransfeProformaCotizacion.disparadorDeCotizacionTransferir.emit({
  //     cotizacion_transferir: cotizacion_get,
  //   });
  // }

  // onLeaveIDCotizaciones(event: any) {
  //   
  //   const inputValue = event.target.value;

  //   let cadena = inputValue.toString();
  //   
  //   // Verificar si el valor ingresado está presente en los objetos del array
  //   const encontrado = this.cotizaciones_get.some(objeto => objeto.id === cadena.toUpperCase());

  //   if (!encontrado) {
  //     // Si el valor no está en el array, dejar el campo vacío
  //     event.target.value = '';
  //     
  //   } else {
  //     event.target.value = cadena;
  //   }
  // }

  // modalCatalogoCotizaciones(): void {
  //   this.dialog.open(CatalogoCotizacionComponent, {
  //     width: 'auto',
  //     height: 'auto',
  //   });
  // }
}
