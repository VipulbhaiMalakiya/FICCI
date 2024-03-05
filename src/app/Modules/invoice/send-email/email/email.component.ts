import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, CustomersService, FormBuilder, InvoicesService, NgbModal, Router, ToastrService, Validators, publicVariable } from '../../Export/invoce';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent {
    publicVariable = new publicVariable();
    uploadedFiles: File[] = [];
    data: any;

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
        this.initializeFormmailForm();
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


        this.data = history.state.data;

        if (this.data = history.state.data) {
            this.patchFormData(this.data);
        }
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

        }


    }
    patchFormData(data: any): void {
        this.publicVariable.mailForm.patchValue({
            emailTo : data.impiHeaderCustomerEmailId,
            subject : data.impiHeaderInvoiceType
        });
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
