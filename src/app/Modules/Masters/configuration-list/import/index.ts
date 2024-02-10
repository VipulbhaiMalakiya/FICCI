// src/app/common/index.ts

import { Category } from '../interface/category';
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


