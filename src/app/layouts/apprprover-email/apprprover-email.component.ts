import { Component } from '@angular/core';
import { ActivatedRoute, CustomersService, FormBuilder, InvoicesService, NgbModal, Router, ToastrService, Validators, publicVariable } from 'src/app/Modules/invoice/Export/invoce';
import { ConformationModelComponent } from 'src/app/Modules/shared/conformation-model/conformation-model.component';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-apprprover-email',
    templateUrl: './apprprover-email.component.html',
    styleUrls: ['./apprprover-email.component.css']
})
export class ApprproverEmailComponent {
    headerId: any;
    data: any = {};
    FilePath: any;
    publicVariable = new publicVariable();
    uploadedFiles: any[] = [];
    loginId: any;
    action?: string = '';
    newConfig: {} = {};


    constructor(private route: ActivatedRoute, private CAPI: CustomersService,
        private API: InvoicesService,
        private toastr: ToastrService,
        private router: Router,
        private fb: FormBuilder,
        private modalService: NgbModal,
    ) {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.publicVariable.dataForm = this.fb.group({
            remarks: ['', Validators.required],
        })
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            //this.headerId = +params['id'];
            // this.loginId = params['email'];
            this.headerId = atob(params['id']);
            this.loginId = atob(params['email']);
            this.action = params['action'];
        });



        // console.log('this.headerId ',this.headerId );
        // console.log('this.loginId ',this.loginId );
        // console.log('this.action ',this.action );


        if (this.action == 'a') {
            this.newConfig = {
                headerId: this.headerId,
                isApproved: true,
                loginId: this.loginId,
                statusId: 20,
                remarks: 'On Approve By TL',
            }
            this.actionPerformed(this.newConfig);
        }
        else if (this.action == 'r') {
            this.newConfig = {
                headerId: this.headerId,
                isApproved: false,
                loginId: this.loginId,
                statusId: 7,
                remarks: 'On Reject By TL',
            }

            this.actionPerformed(this.newConfig);
        }

        else if (this.action == 'ca') {
            this.newConfig = {
                headerId: this.headerId,
                isApproved: false,
                isCancel :true,
                loginId: this.loginId,
                statusId: 20,
                remarks: 'On Reject By TL',
            }

            this.actionPerformed(this.newConfig);
        }
        else if (this.action == 'cr') {
            this.newConfig = {
                headerId: this.headerId,
                isApproved: false,
                isCancel :false,
                loginId: this.loginId,
                statusId: 7,
                remarks: 'On Reject By TL',
            }

            this.actionPerformed(this.newConfig);
        }

        else if (this.action == 'v') {
            this.publicVariable.isProcess = false;
            this.loadInviceDetailList();
            this.loadCOAMasterList();
            this.loadStateList();
        } else {
            this.publicVariable.isProcess = false;
            this.router.navigate(['/unauthorized']);
        }

        // console.log(newConfig);
    }

    actionPerformed(data: any) {
        this.publicVariable.isProcess = true;
        this.publicVariable.Subscription.add(
            this.API.isApproverRemarksNew(data).subscribe({
                next: (res: any) => {
                    if (res.status === true) {
                        const modalRef = this.modalService.open(ConformationModelComponent, { size: "md", centered: true, backdrop: "static" });
                        var componentInstance = modalRef.componentInstance as ConformationModelComponent;
                        componentInstance.message = res.message;

                        modalRef.result.then((canDelete: boolean) => {
                            if (canDelete) {
                                //this.router.navigate(['/']);
                                window.open("about:blank", "_self")?.close();
                            }
                        }).catch(() => { });
                        // this.toastr.success(res.message, 'Success');
                        // alert(res.message)
                        //this.router.navigate(['invoice/status']);
                        this.publicVariable.dataForm.reset();
                        this.publicVariable.isProcess = false;

                    } else {
                        this.toastr.error(res.message, 'Error');
                        alert(res.message);
                        this.router.navigate(['/']);
                        this.publicVariable.isProcess = false;
                        this.publicVariable.dataForm.reset();

                    }
                },
                error: (error: any) => {
                    this.publicVariable.isProcess = false;
                    this.publicVariable.isProcess = false;
                    this.toastr.error(error.error.message || 'An error occurred. Please try again later.', 'Error');
                },
                complete: () => {

                    this.publicVariable.isProcess = false;
                    this.publicVariable.isProcess = false;
                }
            })
        );
    }

    loadInviceDetailList() {
        try {
            let data: any = {
                email: this.loginId,
                id: this.headerId
            }
            const subscription = this.API.GetApproverEmail(data).subscribe({
                next: (response: any) => {


                    if (!response.status) {
                        alert('data not found')
                        return
                    }
                    this.data = response.data;

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

    loadStateList() {
        try {
            const subscription = this.CAPI.getStateList().subscribe({
                next: (response: any) => {
                    this.publicVariable.stateList = response.data;
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


    getStateNameById(stateId: string) {
        const state = this.publicVariable.stateList.find(state => state.stateCode === stateId);
        return state ? state.stateName : null;
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
    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
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

    onSubmit(action: any) {
        if (this.publicVariable.dataForm.valid) {
            const newData = this.publicVariable.dataForm.value;
            const newConfig: any = {


                headerId: this.headerId,
                isApproved: action,
                loginId: this.loginId,
                statusId: this.data.headerStatusId,
                remarks: newData.remarks,
            }

            this.publicVariable.isProcess = true;
            this.publicVariable.Subscription.add(
                this.API.isApproverRemarks(newConfig).subscribe({
                    next: (res: any) => {
                        if (res.status === true) {
                            this.toastr.success(res.message, 'Success');
                            alert(res.message)
                            //this.router.navigate(['invoice/status']);
                            this.publicVariable.dataForm.reset();
                            window.location.reload();

                        } else {
                            this.toastr.error(res.message, 'Error');
                            alert(res.message);
                            this.publicVariable.dataForm.reset();

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
