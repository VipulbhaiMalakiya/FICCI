import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http"

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmationDialogModalComponent } from './Modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogModalComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(
      {
        progressBar: true,
        positionClass: 'toast-top-right',
        closeButton: true,
        timeOut: 3000,
        progressAnimation: 'increasing',
        preventDuplicates: true,

      }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
