import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { CustomersService, publicVariable } from '../../Export/invoce';
import { InvoicesService } from '../../service/invoices.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'app-view-pi-accounts-inbox',
    templateUrl: './view-pi-accounts-inbox.component.html',
    styleUrls: ['./view-pi-accounts-inbox.component.css']
})
export class ViewPiAccountsInboxComponent implements OnInit, OnDestroy {
    headerId?: number;
    data: any;
    FilePath: any;
    isApprove: boolean = false;
    publicVariable = new publicVariable();
    uploadedFiles: File[] = [];

    editorConfig: AngularEditorConfig = {

        editable: true,
        spellcheck: true,
        height: "10rem",
        minHeight: "5rem",
        placeholder: "Enter text here...",
        translate: "no",
        defaultParagraphSeparator: "p",
        defaultFontName: "Arial",
        sanitize: false,
    };


    constructor(private fb: FormBuilder,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
        private cd: ChangeDetectorRef,
        private API: InvoicesService,
        private route: ActivatedRoute,
        private CAPI: CustomersService,
    ) {
        this.initializeForm();
        this.initializeFormmailForm();
    }

    private initializeForm(): void {
        this.publicVariable.dataForm = this.fb.group({
            remarks: [''],
        })
    }

    private initializeFormmailForm(): void {
        this.publicVariable.mailForm = this.fb.group({
            emailTo: ['', [Validators.required]],
            subject: ['', [Validators.required]],
            body: ['', [Validators.required]],
            attachment: [''],
        })
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.headerId = +params['id'];
        });
     
        
        if (this.data = history.state.data) {
            this.patchFormData(this.data);
        }
        this.data = history.state.data;
        this.loadStateList();
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
                modifiedOn: file.imadModifiedOn
            }));

        } else {
            this.uploadedFiles = [];
            this.handleLoadingError()

        }


    }


    patchFormData(data: any): void {
        this.publicVariable.mailForm.patchValue({
            emailTo : data.impiHeaderCustomerEmailId,
            subject : data.impiHeaderInvoiceType
        });
    }

    ngOnDestroy(): void {
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
    onback() {
        this.isApprove = false;
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
                            if (action === true) {
                                this.isApprove = true;
                            }else{
                                this.router.navigate(['invoice/accounts']);
                                this.publicVariable.dataForm.reset();
                            }

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

        }

    }

    onSendEmail() {
        if (this.publicVariable.mailForm.valid) {
            const newData = this.publicVariable.mailForm.value;
            const formData = new FormData();
            formData.append('MailTo', newData.emailTo);
            // formData.append('MailCC', newData.emailTo);
            formData.append('MailSubject', newData.subject);
            formData.append('MailBody', newData.body);
            formData.append('LoginId', this.publicVariable.storedEmail);
            formData.append('ResourceType',this.data.impiHeaderInvoiceType);
            formData.append('ResourceId',this.data.headerId);
            formData.append('Attachments',newData.attachment);
            this.publicVariable.isProcess = true;
            // Submit the formData
            this.publicVariable.Subscription.add(
                this.API.sendEmail(formData).subscribe({
                    next: (res: any) => {
                        if (res.status === true) {
                            this.toastr.success(res.message, 'Success');
                            this.router.navigate(['invoice/accounts']);
                            this.publicVariable.dataForm.reset();
                        } else {
                            this.toastr.error(res.message, 'Error');
                            this.publicVariable.isProcess = false;
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
            this.markFormControlsAsTouchedemail();

        }


    }


    markFormControlsAsTouchedemail(): void {
        ['emailTo','subject','body'].forEach(controlName => {
            this.publicVariable.mailForm.controls[controlName].markAsTouched();
        });
    }

    shouldShowError(controlName: string, errorName: string): boolean {
        return this.publicVariable.mailForm.controls[controlName].touched &&  this.publicVariable.mailForm.controls[controlName].hasError(errorName);
    }
}

