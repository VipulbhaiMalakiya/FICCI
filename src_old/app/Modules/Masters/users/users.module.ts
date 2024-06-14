import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './pages/users/users.component';
import { AddComponent } from './components/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { SearchFilterPipe } from './pipe/searchFilter';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
    declarations: [
        UsersComponent,
        AddComponent,
        SearchFilterPipe
    ],
    imports: [
        CommonModule,
        UsersRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule,
        NgxPaginationModule,
        NgSelectModule
    ]
})
export class UsersModule { }
