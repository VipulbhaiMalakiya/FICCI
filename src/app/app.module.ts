
import {NgModule,BrowserModule,HttpClientModule,AppComponent,FormsModule,ReactiveFormsModule,BrowserAnimationsModule,ToastrModule,AppRoutingModule} from './import/app'
@NgModule({
  declarations: [
    AppComponent,
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
