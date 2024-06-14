import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, ConfirmationDialogModalComponent, CustomersService, FormBuilder, InvoicesService, NgbModal, Router, ToastrService, Validators, publicVariable } from '../../Export/invoce';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-credit-sales-email',
  templateUrl: './credit-sales-email.component.html',
  styleUrls: ['./credit-sales-email.component.css']
})
export class CreditSalesEmailComponent {
    publicVariable = new publicVariable();
    data: any;
    uploadedFiles: File[] = [];
    FilePath: any;
    private _emailMaster: any | undefined;


    set isEmail(value: any) {
        this._emailMaster = value;

        if (this._emailMaster) {
            this.publicVariable.mailForm.patchValue({
                emailTo: this._emailMaster.impiHeaderCustomerEmailId !== null ? this._emailMaster.impiHeaderCustomerEmailId : '',
                subject: this._emailMaster.impiHeaderInvoiceType,
                // body: this._emailMaster.data.immdMailBody
            });
        }

        this.uploadedFiles = this._emailMaster.impiHeaderAttachment;
        if (this._emailMaster.attachment !== null && this._emailMaster.impiHeaderAttachment !== undefined) {
            this.uploadedFiles = this._emailMaster.impiHeaderAttachment
            .map((file: any) => ({
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
            // Handle the case when data.impiHeaderAttachment is null or undefined
            // For example, you might want to set uploadedFiles to an empty array or handle it differently based on your application logic.
            this.uploadedFiles = [];
        }
    }

    editorConfig: AngularEditorConfig = {

        editable: true,
        spellcheck: true,
        height: "5em",
        minHeight: "3rem",
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
        private activeModal: NgbActiveModal,
    ) {
        this.initializeFormmailForm();
    }

    onCancel() {
        this.activeModal.dismiss();
    }

    private initializeFormmailForm(): void {
        this.publicVariable.mailForm = this.fb.group({
            emailTo: ['', [Validators.required, Validators.email, Validators.maxLength(80), this.emailValidator()]],
            subject: ['', [Validators.required]],
            body: ['', [Validators.required]],
            attachment: [''],
        })

    }
    emailValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const email = control.value;
            if (email && email.length >= 2 && email.length <= 80) {
                const atIndex = email.indexOf('@');
                const dotIndex = email.indexOf('.', atIndex);
                if (atIndex > 1 && dotIndex !== -1 && dotIndex - atIndex <= 20 && dotIndex - atIndex >= 3) {
                    return null; // Valid email format
                }
            }
            return { 'invalidEmailFormat': { value: control.value } };
        };
    }





    ngOnInit() {
        this.data = history.state.data;
    }


    onFilesSelected(event: any) {
        const selectedFiles: FileList = event.target.files;
        const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            'application/msword', // .doc
            'text/csv', // .csv
            'application/pdf']; // .pdf
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];

            if (!allowedTypes.includes(file.type)) {
                alert('Only .doc, .csv, .xlsx, and .pdf files are allowed.');
                // Clear the file input
                event.target.value = null;
                return;
            }

            if (file.size > maxSize) {
                alert('File size exceeds 5MB limit.');
                // Clear the file input
                event.target.value = null;
                return;
            }
            this.uploadedFiles.push(file);
        }
          // Clear the file input after successful file selection
          event.target.value = null;
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

    deleteFile(index: number, file: any) {
        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
        var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
        componentInstance.message = "Do you really want to delete these records? This process cannot be undone ?";
        modalRef.result.then((canDelete: boolean) => {
            if (canDelete) {
                this.uploadedFiles.splice(index, 1);
                if (file.id) {
                    this.API.deleteFile(file.id).subscribe({
                        next: (res: any) => {
                            this.toastr.success(res.message, 'Success');
                            this.publicVariable.isProcess = false;
                        },
                        error: (error) => {
                            this.publicVariable.isProcess = false;
                            this.toastr.error(error.error.message, 'Error');
                        }
                    });
                }
            }
        }).catch(() => { });

    }

    onSendEmail() {
        if (this.publicVariable.mailForm.valid) {
            const newData = this.publicVariable.mailForm.value;
            const newConfig: any = {
                emailTo: newData.emailTo,
                subject: newData.subject,
                body: newData.body,
                attachment: this.uploadedFiles,
            }
            this.activeModal.close(newConfig);
        } else {
            this.markFormControlsAsTouchedemail();

        }

    }


    markFormControlsAsTouchedemail(): void {
        ['emailTo', 'subject', 'body'].forEach(controlName => {
            this.publicVariable.mailForm.controls[controlName].markAsTouched();
        });
    }

    shouldShowError(controlName: string, errorName: string): boolean {
        return this.publicVariable.mailForm.controls[controlName].touched && this.publicVariable.mailForm.controls[controlName].hasError(errorName);
    }
}
