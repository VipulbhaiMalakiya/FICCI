import { NgModule, isDevMode } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent, SidebarLayoutComponent, BrowserModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule } from './import/app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
import { ForbiddenComponent } from './layouts/forbidden/forbidden.component';
import { LoginComponent } from './layouts/login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth-interceptor.interceptor';
import { SharedModule } from "./Modules/shared/shared.module";
import { StoreModule } from '@ngrx/store';
import { appReducer } from './shared/store/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
@NgModule({
    declarations: [
        AppComponent,
        SidebarLayoutComponent,
        NotFoundComponent,
        ForbiddenComponent,
        LoginComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            progressBar: true,
            positionClass: 'toast-top-right',
            closeButton: true,
            timeOut: 3000,
            progressAnimation: 'increasing',
            preventDuplicates: true,
        }),
        SharedModule,
        StoreModule.forRoot({ appState: appReducer }),
        EffectsModule.forRoot([]),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })

    ]
})
export class AppModule { }
