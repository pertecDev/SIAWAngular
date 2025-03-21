import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '@services/app.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
    providedIn: 'root'
})
export class AuthGuard  {
    constructor(private router: Router, private appService: AppService, private toastr: ToastrService) { }
    
    bd_logueado: any;
    usuario: any;
    userConn: any;    

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        
        this.bd_logueado = sessionStorage.getItem("bd_logueado");
        this.userConn = sessionStorage.getItem("user_conn");
        this.usuario = sessionStorage.getItem("usuario_logueado");

        if (this.bd_logueado === null && this.usuario === null && this.userConn === null && sessionStorage.length == 0) {
            this.router.navigate(['/login']);
            this.toastr.info('Tiene que Iniciar Sesion, AuthGuard Activo 🛡️');
            return false;
        } else {
            return true;
        }

        // if(sessionStorage.length == 0){
        //     this.router.navigate(['/login']);
        //     this.toastr.info('Tiene que Iniciar Sesion, AuthGuard Activo 🛡️');
        //     
        //     return false; 
        // }else{
        //     return true;
        // }
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.canActivate(next, state);
    }
}
