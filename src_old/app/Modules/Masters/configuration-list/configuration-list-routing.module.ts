import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationListComponent } from './pages/configuration-list/configuration-list.component';

const routes: Routes = [{ path: '', component: ConfigurationListComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfigurationListRoutingModule { }
