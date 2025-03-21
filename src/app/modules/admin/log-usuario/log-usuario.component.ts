import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-log-usuario',
  templateUrl: './log-usuario.component.html',
  styleUrls: ['./log-usuario.component.scss']
})
export class LogUsuarioComponent implements OnInit, AfterViewInit {

  private log = [];
  private errorMessage = '';
  public fecha_actual = new Date();

  dataform: any = '';
  userConn: any = '';
  data = '';
  usuarioLogueado: string;

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['usuario', 'fecha', 'hora', 'entidad', 'ventana', 'detalle', 'tipo', 'codigo', 'id_doc', 'numeroid_doc'];
  dataSource = new MatTableDataSource();

  FormularioData: FormGroup;

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    private datePipe: DatePipe, private _formBuilder: FormBuilder) {
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    //this.api.getRolUserParaVentana('/logs');

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
    this.getAllLogAtTheMomentForDate();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      fecha: [this.datePipe.transform(this.dataform.fecha, "yyyy-MM-dd")],
    });
  }

  getAllLogAtTheMomentForDate() {
    let dateTransform = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET, en la ruta /seg_adm/logs/selog/getselogfecha/  --Vista LOG/Angular";
    return this.api.getAll('/seg_adm/logs/selog/getseloguserfecha/' + this.userConn + "/" + this.usuarioLogueado + "/" + dateTransform)
      .subscribe({
        next: (datav) => {
          this.log = datav;
          
          this.spinner.show();

          this.dataSource = new MatTableDataSource(this.log.sort((a, b) => a.id - b.id));

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  buscadorFechaLog() {
    this.data = this.FormularioData.value.fecha;
    let dateTransform = this.datePipe.transform(this.FormularioData.value.fecha, "yyyy-MM-dd")

    this.errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/logs/selog/getselogfecha/";
    return this.api.getAll('/seg_adm/logs/selog/getseloguserfecha/' + this.userConn + "/" + this.usuarioLogueado + "/" + dateTransform)
      .subscribe({
        next: (datav) => {
          this.log = datav;
          // 

          this.spinner.show();
          this.dataSource = new MatTableDataSource(this.log);

          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }
}
