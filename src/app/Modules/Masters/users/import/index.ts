import { FormGroup } from '@angular/forms';
import { Roles } from '../interface/role';
import { Subscription } from 'rxjs';

export  { FormBuilder, FormGroup, Validators } from '@angular/forms';
export  { NgbModal } from '@ng-bootstrap/ng-bootstrap';
export  { ToastrService } from 'ngx-toastr';
export  { UserService } from '../service/user.service';
export  { ConfirmationDialogModalComponent } from 'src/app/Modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
export  { Roles } from '../interface/role';
export { AppService } from 'src/app/services/excel.service';
export { Router } from '@angular/router';

export const DEFAULT_ROLE_LIST:Roles[]  = [
  { id: 1, role_Name: 'Employee' },
  { id: 2, role_Name: 'Approver' },
  { id: 3, role_Name: 'Accounts' },
  { id: 4, role_Name: 'Admin' }
];


export class publicVariable {
  dataForm!: FormGroup;
  isEdit: boolean = false;
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: number[] = [10, 20, 50, 100];
  searchText: string = '';
  configurationSubscription: Subscription = new Subscription();
}
