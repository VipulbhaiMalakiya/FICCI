import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, CustomersService, FormBuilder, NgbModal, Router, ToastrService, Validators, publicVariable } from '../../Export/new-customer';

@Component({
  selector: 'app-accounts-remarks',
  templateUrl: './accounts-remarks.component.html',
  styleUrls: ['./accounts-remarks.component.css']
})
export class AccountsRemarksComponent {
    customerId?: number;
    data: any;
    publicVariable = new publicVariable();


    constructor(private fb: FormBuilder,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
        private cd: ChangeDetectorRef,
        private API: CustomersService,
        private route: ActivatedRoute
    ) {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.publicVariable.dataForm = this.fb.group({
            remarks: ['', [Validators.required]],
        })
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.customerId = +params['id'];
        });
        this.data = history.state.data;
        this.publicVariable.isProcess = false;

    }

    onSubmit(action: boolean) {
        if (this.publicVariable.dataForm.valid) {
            const newData = this.publicVariable.dataForm.value;
            let statusId: number = !action ? this.data.customerStatusId : this.data.customerStatusId;            
            const newConfig: any = {
                customerId: this.data.customerId,
                isApproved: action,
                loginId: this.publicVariable.storedEmail,
                statusId: statusId,
                remarks: newData.remarks,
            }
            this.publicVariable.isProcess = true;
            this.publicVariable.Subscription.add(
                this.API.isApproverRemarks(newConfig).subscribe({
                    next: (res: any) => {
                        if (res.status === true) {
                            this.toastr.success(res.message, 'Success');
                            this.router.navigate(['customer/accounts']);
                            this.publicVariable.dataForm.reset();
                        } else {
                            this.toastr.error(res.message, 'Error');
                        }
                    },
                    error: (error: any) => {
                        this.publicVariable.isProcess = false;
                        this.toastr.error(error.error.message || 'An error occurred. Please try again later.', 'Error');
                    },
                    complete: () => {
                        this.publicVariable.isProcess = false;
                    }
                })
            );

        } else {
            this.markFormControlsAsTouched();

        }

    }

    markFormControlsAsTouched(): void {
        ['remarks'].forEach(controlName => {
            this.publicVariable.dataForm.controls[controlName].markAsTouched();
        });
    }

    shouldShowError(controlName: string, errorName: string): boolean {
        return this.publicVariable.dataForm.controls[controlName].touched && this.publicVariable.dataForm.controls[controlName].hasError(errorName);
    }
}
