import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Injectable({
    providedIn: 'root'
})
export class AppService {
    public user: any = null;

    constructor(private router: Router, private toastr: ToastrService) { }

    // async loginByAuth({email, password}) {
    //     try {
    //         const token = await Gatekeeper.loginByAuth(email, password);
    //         localStorage.setItem('token', token);
    //         await this.getProfile();
    //         this.router.navigate(['/']);
    //     } catch (error) {
    //         
    //     }
    // }

    async registerByAuth({ email, password }) {
        // try {
        //     const token = await Gatekeeper.registerByAuth(email, password);
        //     localStorage.setItem('token', token);
        //     await this.getProfile();
        //     this.router.navigate(['/']);
        //    
        // } catch (error) {
        //     
        // }
    }

    async loginByGoogle() {
        // try {
        //     const token = await Gatekeeper.loginByGoogle();
        //     localStorage.setItem('token', token);
        //     await this.getProfile();
        //     this.router.navigate(['/']);
        //   
        // } catch (error) {
        //     
        // }
    }

    async registerByGoogle() {
        // try {
        //     const token = await Gatekeeper.registerByGoogle();
        //     localStorage.setItem('token', token);
        //     await this.getProfile();
        //     this.router.navigate(['/']);
        //     
        // } catch (error) {
        //     
        // }
    }

    async loginByFacebook() {
        // try {
        //     const token = await Gatekeeper.loginByFacebook();
        //     localStorage.setItem('token', token);
        //     await this.getProfile();
        //     this.router.navigate(['/']);
        //    
        // } catch (error) {
        //    
        // }
    }

    async registerByFacebook() {
        // try {
        //     const token = await Gatekeeper.registerByFacebook();
        //     localStorage.setItem('token', token);
        //     await this.getProfile();
        //     this.router.navigate(['/']);
        //    
        // } catch (error) {
        //     
        // }
    }

    async getProfile() {
        // try {
        //     this.user = await Gatekeeper.getProfile();
        // } catch (error) {
        //     // this.logout();
        //     throw error;
        // }
    }

    // logout() {
    //     localStorage.removeItem('usuario_logueado');
    //     localStorage.removeItem('gatekeeper_token');  
    //     this.user = null;
    //     this.router.navigate(['/login']);
    // }
}
