import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import {AppComponent,SidebarLayoutComponent,BrowserModule,AppRoutingModule,HttpClientModule,BrowserAnimationsModule } from './import/app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    SidebarLayoutComponent,
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
