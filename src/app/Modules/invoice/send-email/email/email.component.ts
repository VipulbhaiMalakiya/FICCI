import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, ConfirmationDialogModalComponent, CustomersService, FormBuilder, InvoicesService, NgbModal, Router, ToastrService, Validators, publicVariable } from '../../Export/invoce';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent {
    publicVariable = new publicVariable();
    data: any;
    uploadedFiles: File[] = [];
    FilePath: any;
    private _emailMaster: any | undefined;


    set isEmail(value: any) {
        this._emailMaster = value;
        this.data = value;
        if (this._emailMaster) {
            this.publicVariable.mailForm.patchValue({
                emailTo : this._emailMaster.impiHeaderCustomerEmailId,
                subject : this._emailMaster.impiHeaderInvoiceType
            });
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
            emailTo: ['', [Validators.required]],
            subject: ['', [Validators.required]],
            body: ['', [Validators.required]],
            attachment: [''],
        })
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
                this.publicVariable.isProcess = true;
                this.API.deleteFile(file.id).subscribe({
                    next: (res: any) => {
                        this.toastr.success(res.message, 'Success');
                        this.publicVariable.isProcess = false;
                        this.uploadedFiles.splice(index, 1);


                    },
                    error: (error) => {
                        this.publicVariable.isProcess = false;
                        this.toastr.error(error.error.message, 'Error');
                    }
                });

            }
        }).catch(() => { });

    }



    onSendEmail() {
        if (this.publicVariable.mailForm.valid) {
            this.activeModal.close(this.publicVariable.mailForm.value);
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
