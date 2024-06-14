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
    headerId?: any;
    data: any;
    FilePath: any;
    publicVariable = new publicVariable();
    uploadedFiles: any[] = [];


    constructor(private fb: FormBuilder,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
        private cd: ChangeDetectorRef,
        private API: InvoicesService,
        private route: ActivatedRoute,
        private CAPI: CustomersService
    ) {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.publicVariable.dataForm = this.fb.group({
            remarks: [''],
        })
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            let decrypted = params['id']
            this.headerId = atob(decrypted);
        });
        this.data = history.state.data;
        console.log(this.data);

        this.loadStateList();
        this.loadCOAMasterList();
        this.uploadedFiles = this.data.impiHeaderAttachment
        if (this.data.impiHeaderAttachment) {

            this.uploadedFiles = this.data.impiHeaderAttachment.map((file: any) => ({

                id: file.imadId,
                recordNo: file.imadRecordNo,
                screenName: file.imadScreenName,
                name: file.imadFileName,
                type: file.imadFileType,
                fileSize: file.imadFileSize,
                fileUrl: file.imadFileUrl,
                active: file.imadActive,
                createdBy: file.imadCreatedBy,
                createdOn: file.imadCreatedOn,
                modifiedBy: file.imadModifiedBy,
                modifiedOn: file.imadModifiedOn,
                doctype:file.doctype
            }));

        } else {
            this.uploadedFiles = [];
            this.handleLoadingError()

        }
    }

    loadCOAMasterList(): void {
        try {
            const subscription = this.API.GetCOAMasterList().subscribe({
                next: (response: any) => {
                    this.publicVariable.COAMasterList = response.data;
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                }
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
        }
    }
    getNameById(impiGlNo: any): string {
        const item = this.publicVariable.COAMasterList.find((item: any) => item.no === impiGlNo);
        return item ? item.name : '';
      }


    loadStateList() {
        try {
            const subscription = this.CAPI.getStateList().subscribe({
                next: (response: any) => {
                    this.publicVariable.stateList = response.data;
                    this.handleLoadingError();
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    this.handleLoadingError()
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            this.handleLoadingError()
        }
    }



    getStateNameById(stateId: string) {
        const state = this.publicVariable.stateList.find(state => state.stateCode === stateId);
        return state ? state.stateName : null;
    }


    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
    }

    getFileType(type: string): string {
        // Convert file type to readable format
        switch (type) {
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return '.xlsx';
            case 'application/vnd.ms-excel':
                return '.xls';
            case 'application/msword':
                return '.doc';
            case 'text/csv':
                return '.csv';
            case 'application/pdf':
                return '.pdf';
            default:
                return 'Unknown';
        }
    }

    downalodFile(fileUrl: any) {

        this.FilePath = `${environment.fileURL}${fileUrl.fileUrl}`;
        window.open(this.FilePath, '_blank');

    }
    onSubmit(action: boolean) {
        if (this.publicVariable.dataForm.valid) {
            const newData = this.publicVariable.dataForm.value;


            if (!action && !newData.remarks) {
                // Show JavaScript alert if action is false and remarks field is empty
                window.alert('Remarks are required.');
                return;
            }

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
                            // this.router.navigate(['invoice/approval']);
                            this.router.navigate(['dashboard']);
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
