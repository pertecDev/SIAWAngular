import { Component, OnInit, ViewChild } from '@angular/core';
import { ConceptosmovimientosmercaderiaCreateComponent } from './conceptosmovimientosmercaderia-create/conceptosmovimientosmercaderia-create.component';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { inConcepto } from '@services/modelos/objetos';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { ConceptosmovimientosmercaderiaEditComponent } from './conceptosmovimientosmercaderia-edit/conceptosmovimientosmercaderia-edit.component';

@Component({
  selector: 'app-conceptosmovimientosmercaderia',
  templateUrl: './conceptosmovimientosmercaderia.component.html',
  styleUrls: ['./conceptosmovimientosmercaderia.component.scss']
})
export class ConceptosmovimientosmercaderiaComponent implements OnInit {

  concepto: any = [];
  data: any = [];
  userConn: any;

  displayedColumns = ['codigo', 'descripcion', 'factor', 'traspaso', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  myControl = new FormControl<string | inConcepto>('');
  filteredOptions: Observable<inConcepto[]>;

  nombre_ventana: string = "abminconcepto.vb";
  public ventana = "Numeración de Concepto de Notas de Movimiento de Mercaderia"
  public detalle = "numConceptoNotasMovimiento-create";
  public tipo = "Numeración de Concepto de Notas de Movimiento de Mercaderia-CREATE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public log_module: LogService,
    public _snackBar: MatSnackBar, public nombre_ventana_service: NombreVentanaService, private toastr: ToastrService,) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
    this.getAllConcepto();
    this.mandarNombre();
  }

  ngOnInit() {
  }

  getAllConcepto() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inconcepto/";
    return this.api.getAll('/inventario/mant/inconcepto/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.concepto = datav;
          

          this.dataSource = new MatTableDataSource(this.concepto);
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

  openDialog() {
    this.dialog.open(ConceptosmovimientosmercaderiaCreateComponent, {
      width: 'auto',
      height: 'auto'
    });
  }

  editar(item) {
    this.dialog.open(ConceptosmovimientosmercaderiaEditComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        nota_moviento: item,
      }
    });
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  fondos/mant/fntiporetiro/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/inventario/mant/inconcepto/' + this.userConn + "/" + element.codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");

              this.toastr.success('!ELIMINADO EXITOSAMENTE!');
              location.reload();
            },
            error: (err: any) => {
              
              this.toastr.error('! NO ELIMINADO !');
            },
            complete: () => { }
          })
      } else {
        this.toastr.error('! CANCELADO !');
      }
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
