import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { ConformationModelComponent } from './conformation-model/conformation-model.component';



@NgModule({
    declarations: [
        LoadingComponent,
        ConformationModelComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LoadingComponent
    ]
})
export class SharedModule { }
