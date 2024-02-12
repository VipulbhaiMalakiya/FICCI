import { FormGroup } from '@angular/forms';
import { Roles } from '../interface/role';
import { Subscription } from 'rxjs';
import { Employees, UserMaster } from '../interface/employee';
export { Employees, addUpdateEmployees } from '../interface/employee';

export  { FormBuilder, FormGroup, Validators } from '@angular/forms';
export  { NgbModal } from '@ng-bootstrap/ng-bootstrap';
export  { ToastrService } from 'ngx-toastr';
export  { UserService } from '../service/user.service';
export  { ConfirmationDialogModalComponent } from 'src/app/Modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
export  { Roles } from '../interface/role';
export { AppService } from 'src/app/services/excel.service';
export { Router } from '@angular/router';

export const DEFAULT_ROLE_LIST:Roles[]  = [
  { role_id: 1, roleName: 'Employee',isActive:"Yes" },
  { role_id: 2, roleName: 'Approver' ,isActive:"Yes" },
  { role_id: 3, roleName: 'Accounts',isActive:"Yes"  },
  { role_id: 4, roleName: 'Admin' ,isActive:"Yes" }
];



export class publicVariable {
  dataForm!: FormGroup;
  isEdit: boolean = false;
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  employeeList : Employees[] = []
  tableSizes: number[] = [10, 20, 50, 100];
  searchText: string = '';
  Subscription: Subscription = new Subscription();
  selectedEmployee: any;
 public roles: Roles[] = [];
  userlist:UserMaster[] = [];
  userData:any;
}
