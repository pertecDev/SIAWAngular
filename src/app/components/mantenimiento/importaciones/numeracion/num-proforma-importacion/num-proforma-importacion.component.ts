import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { cpidproforma } from '@services/modelos/objetos';
import { NumProformaImportacionCreateComponent } from './num-proforma-importacion-create/num-proforma-importacion-create.component';
import { NumProformaImportacionEditComponent } from './num-proforma-importacion-edit/num-proforma-importacion-edit.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
  selector: 'app-num-proforma-importacion',
  templateUrl: './num-proforma-importacion.component.html',
  styleUrls: ['./num-proforma-importacion.component.scss']
})
export class NumProformaImportacionComponent implements OnInit {

  numProfor: any = [];
  data: [];
  datanumProforEdit_copied: any = [];

  displayedColumns = ['id', 'descripcion', 'nroactual', 'horareg', 'fechareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | cpidproforma>('');
  options: cpidproforma[] = [];
  filteredOptions: Observable<cpidproforma[]>;
  userConn: any;

  nombre_ventana: string = "abmcpidproforma.vb";
  public ventana = "numProformas"
  public detalle = "numProformas-delete";
  public tipo = "numProformas-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.getAllnumProfor(this.userConn);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllnumProfor(userConn) {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET /importaciones/mant/cpidproforma/";
    return this.api.getAll('/importaciones/mant/cpidproforma/' + userConn)
      .subscribe({
        next: (datav) => {
          this.numProfor = datav;

          this.dataSource = new MatTableDataSource(this.numProfor);
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
    this.dialog.open(NumProformaImportacionCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  private _filter(name: string): cpidproforma[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: cpidproforma): string {
    return user && user.id ? user.id : '';
  }

  editar(datanumProforEdit) {
    this.datanumProforEdit_copied = { ...datanumProforEdit };
    

    this.data = datanumProforEdit;
    this.dialog.open(NumProformaImportacionEditComponent, {
      data: { datanumProforEdit: this.datanumProforEdit_copied },
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  importaciones/mant/cpidproforma/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/importaciones/mant/cpidproforma/' + this.userConn + "/" + element.id)
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
