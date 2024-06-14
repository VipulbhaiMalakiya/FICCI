import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { publicVariable, CustomersService, ConfirmationDialogModalComponent } from '../../Export/invoce';
import { FileService } from '../../service/FileService';
import { InvoicesService } from '../../service/invoices.service';

@Component({
  selector: 'app-pi-email',
  templateUrl: './pi-email.component.html',
  styleUrls: ['./pi-email.component.css']
})
export class PIEmailComponent {

  publicVariable = new publicVariable();
    data: any;
    uploadedFiles: any[] = [];
    FilePath: any;
    private _emailMaster: any | undefined;
    InvoiceAttachment: any;
    InvNo: any;
    InvAttachment: any;

    set isEmail(value: any) {
        this._emailMaster = value;
        if (this._emailMaster) {
            this.publicVariable.mailForm.patchValue({
                emailTo: this._emailMaster.createdByUser,
                // subject: this._emailMaster.createdByUser,
                // body: this._emailMaster.data.immdMailBody
            });
        }

        const subscription = this.API.GetPITaxInvoiceAttachment(this._emailMaster.no).subscribe({
            next: (response: any) => {
                this.InvoiceAttachment = response.data[0];
                console.log(this.InvoiceAttachment);

                this.InvNo = this.InvoiceAttachment.invoiceNo;
                this.InvAttachment = this.InvoiceAttachment.attachment;

                console.log(response.data);

                // this.uploadedFiles = this.InvoiceAttachment
                //     .map((file: any) => ({
                //         name: file.fileName,
                //         type: file.fileExtension,
                //         fileExtension: file.fileExtension,
                //         attachment: file.attachment
                //     }));
                this.publicVariable.isProcess = false;
            },
            error: (error) => {
                console.error('Error loading project list:', error);
            },
        });
        this.publicVariable.Subscription.add(subscription);

        // console.log(this.InvoiceAttachment);


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
        private fileService: FileService
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
            MailCC: ['', [Validators.required, Validators.email, Validators.maxLength(80), this.emailValidator()]],
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
        const allowedTypes = [
            // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            // 'application/vnd.ms-excel', // .xls
            // 'application/msword', // .doc
            // 'text/csv', // .csv
            'application/pdf']; // .pdf
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];

            if (!allowedTypes.includes(file.type)) {
                alert('Only .pdf files are allowed.');
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
            this.publicVariable.isProcess = false;
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




    downalodInvFile(base64String: any, InvNo: any = 'Invoice') {

        const fileName = InvNo + '.pdf';
        const fileType = `application/pdf`;
        this.fileService.downloadFile(base64String, fileName, fileType);
    }

    downalodFile(fileUrl: any) {

        const base64String = fileUrl.attachment;
        //  const fileName = fileUrl.name;
        //  const fileType = `application/${fileUrl.type}`;

        const fileName = fileUrl.name;
        const fileType = `application/pdf`;
        this.fileService.downloadFile(base64String, fileName, fileType);
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
                MailCC: newData.MailCC,
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
        ['emailTo', 'MailCC', 'subject', 'body'].forEach(controlName => {
            this.publicVariable.mailForm.controls[controlName].markAsTouched();
        });
    }

    shouldShowError(controlName: string, errorName: string): boolean {
        return this.publicVariable.mailForm.controls[controlName].touched && this.publicVariable.mailForm.controls[controlName].hasError(errorName);
    }

}
