import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { invoiceApproveModule, invoiceStatusModule, projectModel } from "../interface/invoice";
import { CityList, CountryList, StateList, customerStatusListModel } from "../../customers/interface/customers";

export { FormBuilder, Validators } from '@angular/forms';
export { NgbModal } from '@ng-bootstrap/ng-bootstrap';
export { ToastrService } from 'ngx-toastr';
export { Router } from '@angular/router';
export { AppService } from 'src/app/services/excel.service';
export { ConfirmationDialogModalComponent } from 'src/app/Modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
export { InvoicesService } from '../service/invoices.service';
export { CustomersService } from 'src/app/Modules/customers/Export/new-customer';
export { formatDate } from '@angular/common';
export { ActivatedRoute } from 'src/app/Modules/customers/Export/new-customer';
export { panValidator } from '../Validation/panValidator';
export { alphanumericWithSpacesValidator } from '../Validation/alphanumericWithSpacesValidator';
export { gstValidator } from '../Validation/gstValidator';

export class publicVariable {
    dataForm!: FormGroup;
    mailForm!:FormGroup;
    isEdit: boolean = false;
    page: number = 1;
    roleId: any;
    count: number = 0;
    isProcess: boolean = true;
    tableSize: number = 10;
    tableSizes: number[] = [10, 20, 50, 100];
    searchText: string = '';
    Subscription: Subscription = new Subscription();
    selectedProjet: any;
    selectCustomer: any;
    userData: any;
    projectList: projectModel[] = [];
    invoiceStatuslistData: invoiceStatusModule[] = [];
    invoiceApprovelistData: invoiceApproveModule[] = [];

    customerStatusList: customerStatusListModel[] = [];
    countryList: CountryList[] = [];
    stateList: StateList[] = [];
    cityList: CityList[] = [];
    storedEmail:string =  localStorage.getItem('userEmail') ?? '';
    storedRole: string = localStorage.getItem('userRole') ?? '';;

}
