import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { ApproveCustomerList, CityList, CountryList, GstCustomerTypeList, PostCodeList, StateList, customerStatusListModel } from "../interface/customers";

export { FormBuilder, Validators } from '@angular/forms';
export { NgbModal } from '@ng-bootstrap/ng-bootstrap';
export { ToastrService } from 'ngx-toastr';
export { Router } from '@angular/router';
export { panValidator } from '../Validation/panValidator';
export { alphanumericWithSpacesValidator } from '../Validation/alphanumericWithSpacesValidator';
export { gstValidator } from '../Validation/gstValidator';
export { AppService } from 'src/app/services/excel.service';
export { ConfirmationDialogModalComponent } from 'src/app/Modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
export { CustomersService } from '../service/customers.service';
export { customerStatusListModel } from '../interface/customers';
export { ActivatedRoute } from '@angular/router';
export { formatDate } from '@angular/common';

export class publicVariable {
    dataForm!: FormGroup;
    isEdit: boolean = false;
    page: number = 1;
    roleId: any;
    count: number = 0;
    isProcess: boolean = true;
    tableSize: number = 10;
    tableSizes: number[] = [10, 20, 50, 100];
    searchText: string = '';
    approvalsearchText:string = '';
    Subscription: Subscription = new Subscription();
    selectedEmployee: any;
    userData: any;
    countryList: CountryList[] = [];
    ApproveCustomerList:ApproveCustomerList[] = [];
    stateList: StateList[] = [];
    cityList: CityList[] = [];
    postCodeList: PostCodeList[] = [];
    customerTypeList: GstCustomerTypeList[] = [];
    customerStatusList: customerStatusListModel[] = [];
    storedEmail:string =  localStorage.getItem('userEmail') ?? '';
    storedRole: string = localStorage.getItem('userRole') ?? '';;


}
