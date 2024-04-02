import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CustomersService } from '../../Export/invoce';
import { InvoicesService } from '../../service/invoices.service';
import { publicVariable } from './../../../customers/Export/new-customer';

@Component({
  selector: 'app-validation-popup',
  templateUrl: './validation-popup.component.html',
  styleUrls: ['./validation-popup.component.css']
})
export class ValidationPopupComponent {
    private _emailMaster: any | undefined;
    data:any [] = [];
    publicVariable = new publicVariable();
    set isEmail(value: any) {
        this._emailMaster = value;
        this.data = this._emailMaster;
        
    }

    constructor(private fb: FormBuilder,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
        private cd: ChangeDetectorRef,
        private API: InvoicesService,
        private route: ActivatedRoute,
        private CAPI: CustomersService,
        private activeModal: NgbActiveModal,
    ) {
    }

    onCancel() {
        this.activeModal.dismiss();
    }

    onContinue(){
        this.activeModal.dismiss();
    }
}
