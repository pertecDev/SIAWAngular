import {
    AfterViewInit,
    Component,
    HostBinding,
    OnDestroy,
    OnInit,
    Renderer2
} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AppService} from '@services/app.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnDestroy, OnInit {
    @HostBinding('class') class = 'login-box';
    public forgotPasswordForm: UntypedFormGroup;
    public isAuthLoading = false;

    constructor(
        private renderer: Renderer2,
        private toastr: ToastrService,
        private appService: AppService ) {
        
    }

    ngOnInit(): void {
        this.forgotPasswordForm = new UntypedFormGroup({
            email: new UntypedFormControl(null, Validators.required)
        });
      
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
            this.renderer.addClass(appRoot, 'login-page');
        } else {
     
        }

        this.forgotPasswordForm = new UntypedFormGroup({
            email: new UntypedFormControl(null, Validators.required)
        });
    }

    forgotPassword() {
        if (this.forgotPasswordForm.valid) {
        } else {
            this.toastr.error('Hello world!', 'Toastr fun!');
        }
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
    }
}
