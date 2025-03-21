import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {

  @Output() disparadorDeEtiqueta: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
