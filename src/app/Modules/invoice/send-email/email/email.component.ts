import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, CustomersService, FormBuilder, InvoicesService, NgbModal, Router, ToastrService, Validators, publicVariable } from '../../Export/invoce';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent {
    publicVariable = new publicVariable();
    uploadedFiles: File[] = [];
    data: any;
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
