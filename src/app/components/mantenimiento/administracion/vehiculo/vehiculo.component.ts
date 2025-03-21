import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { Vehiculo } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { VehiculoCreateComponent } from './vehiculo-create/vehiculo-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { VehiculoEditComponent } from './vehiculo-edit/vehiculo-edit.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.scss']
})
export class VehiculoComponent implements OnInit {

  vehiculo: any = [];
  data: [];

  displayedColumns = ['placa', 'descripcion', 'activo', 'horareg', 'fechareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | Vehiculo>('');
  options: Vehiculo[] = [];
  filteredOptions: Observable<Vehiculo[]>;
  userConn: any;

  nombre_ventana: string = "abmadvehiculo.vb";
  public ventana = "Vehiculo"
  public detalle = "vehiculo-delete";
  public tipo = "vehiculo-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public log_module: LogService,
    private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.mandarNombre();
    this.getAllVehiculos();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.placa;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllVehiculos() {
    let errorMessage: string;
    errorMessage = "La Ruta presenta fallos al hacer peticion GET /seg_adm/mant/advehiculo/";
    return this.api.getAll('/seg_adm/mant/advehiculo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.vehiculo = datav;

          this.dataSource = new MatTableDataSource(this.vehiculo);
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
    this.dialog.open(VehiculoCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  private _filter(name: string): Vehiculo[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.placa.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: Vehiculo): string {
    return user && user.placa ? user.placa : '';
  }

  editar(dataVehiculoEdit) {
    this.data = dataVehiculoEdit;
    this.dialog.open(VehiculoEditComponent, {
      data: { dataVehiculoEdit: dataVehiculoEdit },
      width: 'auto',
      height: 'auto'
    });
  }

  eliminar(element): void {
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /seg_adm/mant/advehiculo/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/seg_adm/mant/advehiculo/' + this.userConn + "/" + element.placa)
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
