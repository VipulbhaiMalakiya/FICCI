import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";

export class publicVariable {
    dataForm!: FormGroup;
    isEdit: boolean = false;
    isProcess:boolean = true;
    configurationSubscription: Subscription = new Subscription();
  }
  