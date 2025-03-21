/* eslint-disable @typescript-eslint/no-unused-vars */
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { MenuSidebarComponent } from './menu-sidebar.component';

describe('MenuSidbarComponent', () => {
    let component: MenuSidebarComponent;
    let fixture: ComponentFixture<MenuSidebarComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [StoreModule.forRoot({})],
                declarations: [MenuSidebarComponent],
                providers: [
                    DatePipe,
                    provideHttpClient(),
                    provideHttpClientTesting(),
                    { provide: MatSnackBar, useValue: { open: () => { } } },
                    { provide: MatDialog, useValue: { open: () => { } } },
                    { provide: MatDialogRef, useValue: {} },
                    { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
                    { provide: MAT_DIALOG_DATA, useValue: {} }
                ]

            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(MenuSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
