import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { cpidodc } from '@services/modelos/objetos';
import { NumOrdCompraCreateComponent } from './num-ord-compra-create/num-ord-compra-create.component';
import { NumOrdCompraEditComponent } from './num-ord-compra-edit/num-ord-compra-edit.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-num-ord-compra',
  templateUrl: './num-ord-compra.component.html',
  styleUrls: ['./num-ord-compra.component.scss']
})
export class NumOrdCompraComponent implements OnInit {

  numOrdCmp: any = [];
  data: [];
  datanumOrdCmpEdit_copied: any = [];

  displayedColumns = ['id', 'descripcion', 'nroactual', 'horareg', 'fechareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | cpidodc>('');
  options: cpidodc[] = [];
  filteredOptions: Observable<cpidodc[]>;
  userConn: any;

  nombre_ventana: string = "abmcpidodc.vb";
  public ventana = "numOrdendeCompras"
  public detalle = "numOrdendeCompras-delete";
  public tipo = "numOrdendeCompras-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.getAllnumOrdCmp();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllnumOrdCmp() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/importaciones/mant/cpidodc/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.numOrdCmp = datav;

          this.dataSource = new MatTableDataSource(this.numOrdCmp);
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

  openDialog(): void {
    this.dialog.open(NumOrdCompraCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  private _filter(name: string): cpidodc[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: cpidodc): string {
    return user && user.id ? user.id : '';
  }

  editar(datanumOrdCmpEdit) {
    this.datanumOrdCmpEdit_copied = { ...datanumOrdCmpEdit };
    

    this.data = datanumOrdCmpEdit;
    this.dialog.open(NumOrdCompraEditComponent, {
      data: { datanumOrdCmpEdit: this.datanumOrdCmpEdit_copied },
      width: 'auto',
      height: 'auto',
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  importaciones/mant/cpidodc/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/importaciones/mant/cpidodc/' + this.userConn + "/" + element.id)
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

}
