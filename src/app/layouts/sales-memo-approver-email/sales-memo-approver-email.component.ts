import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, CustomersService, FormBuilder, InvoicesService, NgbModal, Router, ToastrService, publicVariable } from 'src/app/Modules/invoice/Export/invoce';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-sales-memo-approver-email',
    templateUrl: './sales-memo-approver-email.component.html',
    styleUrls: ['./sales-memo-approver-email.component.css']
})
export class SalesMemoApproverEmailComponent {
    headerId?: any;
    loginId?: any;
    data?: any = {};
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
            this.headerId = atob(params['id']);
            this.loginId = atob(params['email']);
        });
        // this.data = history.state.data;
        this.loadInviceDetailList();
        this.loadStateList();
        this.loadCOAMasterList();


    }

    loadInviceDetailList() {
        try {
            let data: any = {
                email: this.loginId,
                id: this.headerId
            }
            // const subscription = this.API.GetCreditMemoApproverEmail(data).subscribe({

            const subscription = this.API.getApproveSalesInvoice().subscribe({
                next: (response: any) => {

                    // console.log(response);

                    if (!response.status) {
                        alert('data not found')
                        return
                    }



                    let filteredData = response.data.find((item: any) => item.headerId == this.headerId);



                    // this.data = response.data;
                    this.data = filteredData;


                    this.uploadedFiles = this.data.impiHeaderAttachment;

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
                            doctype: file.doctype
                        }));

                    } else {
                        this.uploadedFiles = [];
                        this.handleLoadingError()

                    }
                    this.handleLoadingError()
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
                creditId: this.data.headerId,
                isApproved: action,
                loginId: this.loginId,
                statusId: this.data.headerStatusId,
                remarks: newData.remarks,
            }
            this.publicVariable.isProcess = true;
            this.publicVariable.Subscription.add(
                this.API.isSalesApproverRemarks(newConfig).subscribe({
                    next: (res: any) => {
                        if (res.status === true) {
                            this.toastr.success(res.message, 'Success');
                            this.router.navigate(['invoice/sales-approval']);
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
