import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { ModalPrecioVentaComponent } from '../../modal-precio-venta/modal-precio-venta.component';
import { ModalDescuentosComponent } from '../../descuentos-especiales/modal-descuentos/modal-descuentos.component';
import { DescuentoService } from '../../serviciodescuento/descuento.service';
import { ServicioprecioventaService } from '../../servicioprecioventa/servicioprecioventa.service';
import { ItemServiceService } from '../../serviciosItem/item-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-item-seleccion-cantidad',
  templateUrl: './item-seleccion-cantidad.component.html',
  styleUrls: ['./item-seleccion-cantidad.component.scss']
})
export class ItemSeleccionCantidadComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler() {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      

      switch (elementTagName) {
        case "cantInput":
          this.agregarItems();
          break;
        case "precio_input":
          this.agregarItems();
          break;
        case "descuento_input":
          this.agregarItems();
          break;
        case "empaques_input":
          this.agregarItems();
          break;
      }
    }
  };

  @ViewChild("cant_input") myInputField: ElementRef;
  @ViewChild("empaques_input") myInputField1: ElementRef;

  cod_precio_venta_modal_codigo: number;
  cod_descuento_modal_codigo: number;
  num_hoja: number;
  cantidad_input: number;
  empaques_input: number;

  tarifa_get_unico: any = [];
  descuentos_get: any = [];
  descuentos_get_copied: any = [];
  first_descuentos_get: any = [];

  tarifa_get_unico_copied: any = [];
  cod_precio_venta_modal_first: any = [];
  dataItemSeleccionados_get: any = [];
  cod_descuento_modal: any = [];
  cod_precio_venta_modal: any = [];
  array_items_completo: any = [];

  isCheckedCantidad: boolean = true;
  isCheckedEmpaque: boolean = false;
  isCheckedEmpaques: boolean = false;
  permiso_para_vista: boolean;

  userConn: any;
  usuarioLogueado: any;
  BD_storage: any;

  items_post: any = [];

  tarifa_get: any;
  descuento_get: any;
  codcliente_get: any;
  codalmacen_get: any;
  desc_linea_seg_solicitud_get: any;
  fecha_get: any;
  codmoneda_get: any;
  desct_nivel_get: any;
  precio_venta_get: any;
  items_get_carrito: [];
  tamanio_carrito_viene_de_matriz: any;

  precio: any = false;
  desct: any = false;
  code_desct: any;

  constructor(public dialog: MatDialog, private api: ApiService, public dialogRef: MatDialogRef<ItemSeleccionCantidadComponent>,
    public itemservice: ItemServiceService, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public dataItemSeleccionados: any, public servicioPrecioVenta: ServicioprecioventaService,
    @Inject(MAT_DIALOG_DATA) public tarifa: any, @Inject(MAT_DIALOG_DATA) public descuento: any,
    @Inject(MAT_DIALOG_DATA) public codcliente: any, @Inject(MAT_DIALOG_DATA) public codalmacen: any,
    @Inject(MAT_DIALOG_DATA) public desc_linea_seg_solicitud: any, @Inject(MAT_DIALOG_DATA) public fecha: any,
    @Inject(MAT_DIALOG_DATA) public codmoneda: any, public servicioDesctEspecial: DescuentoService,
    @Inject(MAT_DIALOG_DATA) public desct_nivel: any, @Inject(MAT_DIALOG_DATA) public items: any,
    @Inject(MAT_DIALOG_DATA) public precio_venta: any, @Inject(MAT_DIALOG_DATA) public tamanio_carrito_compras: any) {

    this.dataItemSeleccionados_get = dataItemSeleccionados.dataItemSeleccionados;
    

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;


    this.tarifa_get = tarifa.tarifa;
    this.descuento_get = descuento.descuento;
    this.codcliente_get = codcliente.codcliente;
    this.codalmacen_get = codalmacen.codalmacen;
    this.desc_linea_seg_solicitud_get = desc_linea_seg_solicitud.desc_linea_seg_solicitud;
    this.fecha_get = fecha.fecha;
    this.codmoneda_get = codmoneda.codmoneda;
    this.items_get_carrito = items.items;
    this.desct_nivel_get = desct_nivel.desct_nivel;
    this.precio_venta_get = precio_venta.precio_venta;
    this.tamanio_carrito_viene_de_matriz = tamanio_carrito_compras.tamanio_carrito_compras
    //this.tamanio_carrito = this.items_get_carrito.length

    
  }

  ngOnInit() {
    this.getPermisosBtnPorRol();
    // descuentos
    this.servicioDesctEspecial.disparadorDeDescuentosMatrizCantidad.subscribe(dataDescuento => {
      
      
      this.code_desct = dataDescuento.descuento;

      this.cod_precio_venta_modal_codigo = dataDescuento.precio_sugerido;
    });
    // findescuentos

    // precio_venta
    this.servicioPrecioVenta.disparadorDePrecioVenta.subscribe(data => {
      
      this.cod_precio_venta_modal = data.precio_venta;
      this.cod_precio_venta_modal_codigo = data.precio_venta.codigo;
      this.cod_descuento_modal_codigo = data.precio_sugerido;
    });
    // fin_precio_venta

    this.getTarifa();
    this.getDescuentos();

  }

  getTarifa() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET /inventario/mant/intarifa/catalogo/";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.tarifa_get_unico = datav;
          
        },
        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  getDescuentos() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/mant/vedescuento";

    return this.api.getAll('/venta/mant/vedescuento/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.descuentos_get = datav;
          
        },
        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  empaqueHabilitar() {
    

    this.isCheckedCantidad = false;
    this.isCheckedEmpaques = false;
  }

  empaquesHabilitar() {
    

    this.isCheckedCantidad = false;
    this.isCheckedEmpaque = false;

    this.precio = true;
  }

  cantidadHabilitar() {
    

    this.isCheckedEmpaque = false;
    this.isCheckedEmpaques = false
  }

  onLeavePrecioVenta(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.tarifa_get_unico.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      
    } else {
      event.target.value = entero;
    }
  }

  onLeaveDesctEspecial(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    const encontrado = this.descuentos_get.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      event.target.value = '';
    } else {
      event.target.value = entero;
    }
  }

  agregarItems() {
    //let j = this.tamanio_carrito_viene_de_matriz + 1;
    let j = this.tamanio_carrito_viene_de_matriz + 1;
    let a: any;
    var d_tipo_precio_desct: string;
    let i = this.tamanio_carrito_viene_de_matriz + 1;
    

    const errorMessage1 = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta: /venta/transac/veproforma/getCantfromEmpaque/";
    const errorMessage2 = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta: /venta/transac/veproforma/getItemMatriz_AnadirbyGroup/";

    if (this.precio === true) {
      d_tipo_precio_desct = "Precio";
    } else {
      d_tipo_precio_desct = "Descuento"
    }

    if (this.isCheckedEmpaque === true) {
      //si el toggle de empaque minimo esta en true se envia la info de los inputs a los valores tarifa y descuento
      let nuevosItems = this.dataItemSeleccionados_get.map((elemento) => {
        const item = {
          coditem: elemento,
          tarifa: this.cod_precio_venta_modal_codigo,
          descuento: this.code_desct,
          cantidad_pedida: this.cantidad_input === null ? 0 : this.cantidad_input,
          cantidad: this.cantidad_input === null ? 0 : this.cantidad_input,
          codcliente: this.codcliente_get,
          opcion_nivel: this.desct_nivel_get?.toString(),
          codalmacen: this.codalmacen_get,
          desc_linea_seg_solicitud: this.desc_linea_seg_solicitud_get === "" ? "0" : this.desc_linea_seg_solicitud_get,
          codmoneda: this.codmoneda_get,
          fecha: this.fecha_get,
          empaque: this.empaques_input,
          // cod_precio_venta_modal_codigo
          orden_pedido: j,
          nroitem: j,
        };
        j++; // Incrementamos j para el próximo elemento
        return item;
      });
      
      switch (true) {
        case this.isCheckedCantidad:
          
          this.api.create("/venta/transac/veproforma/getItemMatriz_AnadirbyGroup/" + this.userConn + "/" + this.BD_storage + "/" + this.usuarioLogueado, nuevosItems)
            .subscribe({
              next: (datav) => {
                if (this.items_get_carrito.length > 0) {
                  
                  a = this.items_post.concat(datav, this.items_get_carrito);

                } else {
                  
                  a = this.items_post = datav;
                }
                

                this.spinner.show();
                setTimeout(() => {
                  this.spinner.hide();
                }, 1500);
              },
              error: (err) => {
                
              },
              complete: () => {
                this.enviarItemsAlServicio(a);
                this.dialogRef.close();
                console.clear();
              }
            });
          break;

        case this.isCheckedEmpaque:
          
          this.api.create("/venta/transac/veproforma/getCantfromEmpaque/" + this.userConn, nuevosItems)
            .subscribe({
              next: (datav) => {
                if (this.items_get_carrito.length > 0) {
                  
                  a = this.items_post.concat(datav, this.items_get_carrito);
                } else {
                  
                  a = this.items_post = datav;
                }
                

                this.spinner.show();
                setTimeout(() => {
                  this.spinner.hide();
                }, 1500);
              },
              error: (err) => {
                
              },
              complete: () => {
                this.enviarItemsAlServicio(a);
                this.dialogRef.close();
                console.clear();
              }
            });
          break;

        case this.isCheckedEmpaques:
          
          // Assuming similar API call and logic for empaques
          this.api.create("/venta/transac/veproforma/getCantItemsbyEmpinGroup/" + this.userConn + "/" + d_tipo_precio_desct + "/" + this.empaques_input, nuevosItems)
            .subscribe({
              next: (datav) => {
                if (this.items_get_carrito.length > 0) {
                  
                  a = this.items_post.concat(datav, this.items_get_carrito);
                } else {
                  
                  a = this.items_post = datav;
                }
                

                this.spinner.show();
                setTimeout(() => {
                  this.spinner.hide();
                }, 1500);
              },
              error: (err) => {
                
              },
              complete: () => {
                const updatedItems = a.map(item => {
                  const { empaque, ...rest } = item;
                  return { ...rest, cantidad_empaque: empaque };
                });
                this.enviarItemsAlServicio(updatedItems);
                this.dialogRef.close();
                console.clear();
              }
            });
          break;

        default:
          
          break;
      }
    } else {
      let nuevosItems = this.dataItemSeleccionados_get.map((elemento) => {
        const item = {
          coditem: elemento,
          tarifa: this.precio_venta_get,
          descuento: this.cod_descuento_modal_codigo === undefined ? 0 : this.cod_descuento_modal_codigo,
          cantidad_pedida: this.cantidad_input === null ? 0 : this.cantidad_input,
          cantidad: this.cantidad_input === null ? 0 : this.cantidad_input,
          codcliente: this.codcliente_get,
          opcion_nivel: this.desct_nivel_get?.toString(),
          codalmacen: this.codalmacen_get,
          desc_linea_seg_solicitud: this.desc_linea_seg_solicitud_get === "" ? "0" : this.desc_linea_seg_solicitud_get,
          codmoneda: this.codmoneda_get,
          fecha: this.fecha_get,
          empaque: this.empaques_input,
          // empaque: this.empaques_input === undefined ? 0 : this.empaques_input,
          // cod_precio_venta_modal_codigo
          orden_pedido: j,
          nroitem: j,
        };
        j++; // Incrementamos j para el próximo elemento
        return item;
      });
      

      switch (true) {
        case this.isCheckedCantidad:
          
          this.api.create("/venta/transac/veproforma/getItemMatriz_AnadirbyGroup/" + this.userConn + "/" + this.BD_storage + "/" + this.usuarioLogueado, nuevosItems)
            .subscribe({
              next: (datav) => {
                if (this.items_get_carrito.length > 0) {
                  
                  a = this.items_post.concat(datav, this.items_get_carrito);

                } else {
                  
                  a = this.items_post = datav;
                }
                

                this.spinner.show();
                setTimeout(() => {
                  this.spinner.hide();
                }, 1500);
              },
              error: (err) => {
                
              },
              complete: () => {
                this.enviarItemsAlServicio(a);
                this.dialogRef.close();
                console.clear();
              }
            });
          break;

        // case this.isCheckedEmpaque:
        //   
        //   this.api.create("/venta/transac/veproforma/getCantfromEmpaque/" + this.userConn, nuevosItems)
        //     .subscribe({
        //       next: (datav) => {
        //         if (this.items_get_carrito.length > 0) {
        //           
        //           a = this.items_post.concat(datav, this.items_get_carrito);
        //         } else {
        //           
        //           a = this.items_post = datav;
        //         }
        //         

        //         this.spinner.show();
        //         setTimeout(() => {
        //           this.spinner.hide();
        //         }, 1500);
        //       },
        //       error: (err) => {
        //         
        //       },
        //       complete: () => {
        //         this.enviarItemsAlServicio(a);
        //         this.dialogRef.close();
        //       }
        //     });
        //   break;

        case this.isCheckedEmpaques:
          
          // Assuming similar API call and logic for empaques
          this.api.create("/venta/transac/veproforma/getCantItemsbyEmpinGroup/" + this.userConn + "/" + d_tipo_precio_desct + "/" + this.empaques_input, nuevosItems)
            .subscribe({
              next: (datav) => {
                if (this.items_get_carrito.length > 0) {
                  
                  a = this.items_post.concat(datav, this.items_get_carrito);
                } else {
                  
                  a = this.items_post = datav;
                }
                

                this.spinner.show();
                setTimeout(() => {
                  this.spinner.hide();
                }, 1500);
              },
              error: (err) => {
                
              },
              complete: () => {
                const updatedItems = a.map(item => {
                  const { empaque, ...rest } = item;
                  return { ...rest, cantidad_empaque: empaque };
                });
                this.enviarItemsAlServicio(updatedItems);
                this.dialogRef.close();
                console.clear();
              }
            });
          break;

        default:
          
          break;
      }
    }
    // switch (true) {
    //   case this.isCheckedCantidad:
    //     
    //     this.api.create("/venta/transac/veproforma/getItemMatriz_AnadirbyGroup/" + this.userConn + "/" + this.BD_storage + "/" + this.usuarioLogueado, nuevosItems)
    //       .subscribe({
    //         next: (datav) => {
    //           if (this.items_get_carrito.length > 0) {
    //             
    //             a = this.items_post.concat(datav, this.items_get_carrito);

    //           } else {
    //             
    //             a = this.items_post = datav;
    //           }
    //           

    //           this.spinner.show();
    //           setTimeout(() => {
    //             this.spinner.hide();
    //           }, 1500);
    //         },
    //         error: (err) => {
    //           
    //         },
    //         complete: () => {
    //           this.enviarItemsAlServicio(a);
    //           this.dialogRef.close();
    //         }
    //       });
    //     break;

    //   case this.isCheckedEmpaque:
    //     
    //     this.api.create("/venta/transac/veproforma/getCantfromEmpaque/" + this.userConn, nuevosItems)
    //       .subscribe({
    //         next: (datav) => {
    //           if (this.items_get_carrito.length > 0) {
    //             
    //             a = this.items_post.concat(datav, this.items_get_carrito);
    //           } else {
    //             
    //             a = this.items_post = datav;
    //           }
    //           

    //           this.spinner.show();
    //           setTimeout(() => {
    //             this.spinner.hide();
    //           }, 1500);
    //         },
    //         error: (err) => {
    //           
    //         },
    //         complete: () => {
    //           this.enviarItemsAlServicio(a);
    //           this.dialogRef.close();
    //         }
    //       });
    //     break;

    //   case this.isCheckedEmpaques:
    //     
    //     // Assuming similar API call and logic for empaques
    //     this.api.create("/venta/transac/veproforma/getCantItemsbyEmpinGroup/" + this.userConn + "/" + d_tipo_precio_desct + "/" + this.empaques_input, nuevosItems)
    //       .subscribe({
    //         next: (datav) => {
    //           if (this.items_get_carrito.length > 0) {
    //             
    //             a = this.items_post.concat(datav, this.items_get_carrito);
    //           } else {
    //             
    //             a = this.items_post = datav;
    //           }
    //           

    //           this.spinner.show();
    //           setTimeout(() => {
    //             this.spinner.hide();
    //           }, 1500);
    //         },
    //         error: (err) => {
    //           
    //         },
    //         complete: () => {
    //           const updatedItems = a.map(item => {
    //             const { empaque, ...rest } = item;
    //             return { ...rest, cantidad_empaque: empaque };
    //           });
    //           this.enviarItemsAlServicio(updatedItems);
    //           this.dialogRef.close();
    //         }
    //       });
    //     break;

    //   default:
    //     
    //     break;
    // }
  }

  getPermisosBtnPorRol() {
    // esta funcion devuelve un booleano para verificar que tiene permiso para ver el input y la funcional de empaques
    // esta funcion mas que todo es para Don Percy ya que la matriz se personaliza para su uso exclusivo de el.
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veproforma/verColEmpbyUser/";
    return this.api.getAll('/venta/transac/veproforma/verColEmpbyUser/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.permiso_para_vista = datav.veEmpaques;
          
        },

        error: (err: any) => {
          
        },
        complete: () => { }
      })
  }

  enviarItemsAlServicio(items: any[]) {
    this.itemservice.enviarItemsDeSeleccionAMatriz(items);
    console.clear();
  }

  togglePrecio() {
    if (this.precio) {
      this.precio = false;
    } else {
      this.precio = true;
      this.desct = false; // Asegura que desct sea false cuando precio es true
    }
  }

  toggleDescuento() {
    if (this.desct) {
      this.desct = false;
    } else {
      this.desct = true;
      this.precio = false; // Asegura que precio sea false cuando desct es true
    }
  }

  modalPrecioVenta(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
      data: { detalle: false }
    });
  }

  modalDescuentoEspecial(): void {
    this.dialog.open(ModalDescuentosComponent, {
      width: 'auto',
      height: 'auto',
      data: { detalle: false }
    });
  }

  close() {
    this.dialogRef.close();
  }
}