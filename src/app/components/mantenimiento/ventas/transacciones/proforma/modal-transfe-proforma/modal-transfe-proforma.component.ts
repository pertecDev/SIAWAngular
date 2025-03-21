import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServicioTransfeAProformaService } from './servicio-transfe-a-proforma/servicio-transfe-a-proforma.service';
import { ServicioCatalogoProformasService } from '../sevicio-catalogo-proformas/servicio-catalogo-proformas.service';
import { CatalogoProformasComponent } from '../catalogo-proformas/catalogo-proformas.component';
import { CatalogoCotizacionComponent } from '../../cotizacion/catalogo-cotizacion/catalogo-cotizacion.component';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-modal-transfe-proforma',
  templateUrl: './modal-transfe-proforma.component.html',
  styleUrls: ['./modal-transfe-proforma.component.scss']
})
export class ModalTransfeProformaComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler5(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      

      switch (elementTagName) {
        case "input_num_id_proformas":
          // this.getClientByID(this.codigo_cliente);
          this.transferirProforma();
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


  input_num_id_proformas

  constructor(public dialog: MatDialog, private api: ApiService,
    public dialogRef: MatDialogRef<ModalTransfeProformaComponent>,
    private spinner: NgxSpinnerService, private messageService: MessageService,
    public servicioCatalogoProformas: ServicioCatalogoProformasService,
    public servicioTransfeProformaCotizacion: ServicioTransfeAProformaService) {

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
    this.getCotizaciones();
  }

  transferirProforma() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/transfDatosProforma/";

    return this.api.getAll(`/venta/transac/veproforma/transfDatosProforma/${this.userConn}/${this.id_proformas}/${this.numero_id_proformas}/${this.BD_storage}`)
      .subscribe({
        next: (datav) => {
          this.transferir_get = datav;
          
          const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
            width: 'auto',
            height: 'auto',
            data: { mensaje_dialog: "¿ Esta Seguro de Transferir a la Proforma Actual ?, Se reemplazara el contenido de la proforma actual!" },
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe((result: Boolean) => {
            if (result) {
              this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! TRANSFERENCIA EN PROGESO ! ✅ ' });
              this.transferirProformaAProforma(this.transferir_get);
              this.spinner.show();
              setTimeout(() => {
                this.spinner.hide();
              }, 500);
              this.close();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: '! CANCELADO ! ❌' });
            }
          });
        },
        error: (err: any) => {
          
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! TRANSFERENCIA FALLO ! ❌' });
        },
        complete: () => {
          this.close();
        }
      })
  }

  transferirCotizaciones() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/transfDatosCotizacion/";

    return this.api.getAll(`/venta/transac/veproforma/transfDatosCotizacion/${this.userConn}/${this.id_cotizaciones}/${this.numero_id_cotizaciones}/${this.BD_storage}`)
      .subscribe({
        next: (datav) => {
          this.transferir_get = datav;
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! TRANSFERENCIA EN PROGESO ! ✅' });
          this.transferirACotizacion(this.transferir_get);
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
          this.close();
        },
        error: (err: any) => {
          
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! TRANSFERENCIA FALLO ! ❌ ' });
        },
        complete: () => { }
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

  transferirProformaAProforma(proforma_get) {
    this.servicioTransfeProformaCotizacion.disparadorDeProformaTransferir.emit({
      proforma_transferir: proforma_get,
    });
  }

  transferirACotizacion(cotizacion_get) {
    this.servicioTransfeProformaCotizacion.disparadorDeCotizacionTransferir.emit({
      cotizacion_transferir: cotizacion_get,
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

  getProforma() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET - /venta/mant/venumeracion/catalogo/2";
    return this.api.getAll(`/venta/mant/venumeracion/catalogo/${this.userConn}/2`)
      .subscribe({
        next: (datav) => {
          this.proforma_get = datav;
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getCotizaciones() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/venumeracion/catalogo/6";

    return this.api.getAll(`/venta/mant/venumeracion/catalogo/${this.userConn}/6`)
      .subscribe({
        next: (datav) => {
          this.cotizaciones_get = datav;
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  onLeaveIDCotizaciones(event: any) {
    
    const inputValue = event.target.value;

    let cadena = inputValue.toString();
    
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.cotizaciones_get.some(objeto => objeto.id === cadena.toUpperCase());

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

  modalCatalogoCotizaciones(): void {
    this.dialog.open(CatalogoCotizacionComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  close() {
    this.dialogRef.close();
  }
}
