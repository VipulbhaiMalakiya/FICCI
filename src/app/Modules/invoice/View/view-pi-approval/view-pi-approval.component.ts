import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CustomersService, FormBuilder, InvoicesService, NgbModal, ToastrService, Validators, publicVariable } from '../../Export/invoce';

@Component({
  selector: 'app-view-pi-approval',
  templateUrl: './view-pi-approval.component.html',
  styleUrls: ['./view-pi-approval.component.css']
})
export class ViewPiApprovalComponent {
    headerId?: number;
    data: any;
    FilePath:any;
    publicVariable = new publicVariable();

    constructor(private fb: FormBuilder,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
        private cd: ChangeDetectorRef,
        private API: InvoicesService,
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
            this.headerId = +params['id'];
        });
        this.data = history.state.data;
        this.FilePath = `${environment.fileURL}${ this.data.impiHeaderAttachment}`;
        console.log( this.FilePath);

    }

    onSubmit(action: boolean) {
        if (this.publicVariable.dataForm.valid) {
            const newData = this.publicVariable.dataForm.value;

            const newConfig: any = {
                headerId: this.data.headerId,
                isApproved: action,
                loginId: this.publicVariable.storedEmail,
                statusId: this.data.headerStatusId,
                remarks: newData.remarks,
            }
            this.publicVariable.isProcess = true;
            this.publicVariable.Subscription.add(
                this.API.isApproverRemarks(newConfig).subscribe({
                    next: (res: any) => {
                        if (res.status === true) {
                            this.toastr.success(res.message, 'Success');
                            this.router.navigate(['invoice/approval']);
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
