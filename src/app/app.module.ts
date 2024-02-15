import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import {AppComponent,SidebarLayoutComponent,BrowserModule,AppRoutingModule,HttpClientModule,BrowserAnimationsModule } from './import/app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
@NgModule({
  declarations: [
    AppComponent,
    SidebarLayoutComponent,
    NotFoundComponent,
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
