// src/app/common/index.ts

import { FormGroup } from '@angular/forms';
import { Category } from '../interface/category';
import { Configuration } from '../interface/configuration';
import { Subscription } from 'rxjs';
export { Subscription } from 'rxjs';
// Export all commonly used imports from your project
export * from 'src/app/services/excel.service';
export * from '../service/configuration.service';
export * from '../interface/category';
export * from '../interface/configuration';
export { addUpdateConfiguration } from '../interface/configuration';
export * from 'ngx-toastr';
export * from '../Validation/alphanumericValidator';
export { alphanumericWithSpacesValidator } from '../Validation/alphanumericWithSpacesValidator ';
export * from 'src/app/Helper/toTitleCase';
export * from 'src/app/services/utility.service';
export * from '@angular/forms';
export * from '@ng-bootstrap/ng-bootstrap';
export * from 'src/app/Modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';

export const DEFAULT_CATEGORY_LIST: Category[] = [
    { id: 1, category_Name: 'CUSTOMER TYPE' },
    { id: 2, category_Name: 'USER ROLE' },
    { id: 3, category_Name: 'MAIL TEMPLATE' },
    { id: 4, category_Name: 'INVOICE TYPE' }
];


export class publicVariable {
    dataForm!: FormGroup;
    isEdit: boolean = false;
    categoryList: Category[] = [];
    data: Configuration[] = [];
    page: number = 1;
    isProcess: boolean = true;
    count: number = 0;
    tableSize: number = 10;
    tableSizes: number[] = [10, 20, 50, 100];
    searchText: string = '';
    configurationSubscription: Subscription = new Subscription();
}

