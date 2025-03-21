import { Component, HostListener, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { veNumeracion } from '@services/modelos/objetos';
import { TipoidService } from '../serviciotipoid/tipoid.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-modal-idtipo',
  templateUrl: './modal-idtipo.component.html',
  styleUrls: ['./modal-idtipo.component.scss']
})
export class ModalIdtipoComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler() {
    

    this.mandarTipoId();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarTipoId();
  };

  id_tipo!: veNumeracion[];
  seletedid_tipo: veNumeracion[];
  searchValue: string;

  public codigo: string = '';
  public tipo_view: any = [];
  public numero_id: string;

  userConn: any;
  user: any;

  private debounceTimer: any;

  @ViewChild('dt1') dt1: Table;
  @ViewChildren('para') paras: QueryList<ElementRef>;

  constructor(public dialogRef: MatDialogRef<ModalIdtipoComponent>, private api: ApiService,
    public servicioTipoID: TipoidService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.user = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
  }

  ngOnInit() {
    this.getIdTipo();
  }

  getIdTipo() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/venumeracion/catalogoNumProfxUsuario/' + this.userConn + "/" + this.user)
      .subscribe({
        next: (datav) => {
          this.id_tipo = datav;

          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getIdTipoView(element) {
    
    this.tipo_view = element.data;
  }

  onSearchChange(searchValue: string) {
    

    // Debounce logic
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.dt1.filterGlobal(searchValue, 'contains');

      // Focus logic
      const elements = this.paras.toArray();
      let focused = false;
      for (const element of elements) {
        if (element.nativeElement.textContent.includes(searchValue)) {
          element.nativeElement.focus();
          focused = true;
          break;
        }
      }

      if (!focused) {
      }
    }, 750); // 750 ms de retardo
  }

  mandarTipoId() {
    this.servicioTipoID.disparadorDeIDTipo.emit({
      id_tipo: this.tipo_view,
      // numero_id:
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
