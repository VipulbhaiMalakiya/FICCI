import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";

export class publicVariable {
  dataForm!: FormGroup;
  isEdit: boolean = false;
  page: number = 1;
  roleId:any;
  count: number = 0;
  isProcess:boolean = true;
  tableSize: number = 10;
  tableSizes: number[] = [10, 20, 50, 100];
  searchText: string = '';
  Subscription: Subscription = new Subscription();
  selectedEmployee: any;
  userData:any;
}
