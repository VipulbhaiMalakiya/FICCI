import { Component } from '@angular/core';
import { ActivatedRoute, CustomersService, FormBuilder, InvoicesService, Router, ToastrService, Validators, publicVariable } from '../../Export/invoce';
import { environment } from 'src/environments/environment';
import { FileService } from '../../service/FileService';

@Component({
  selector: 'app-credit-memo-view',
  templateUrl: './credit-memo-view.component.html',
  styleUrls: ['./credit-memo-view.component.css']
})
export class CreditMemoViewComponent {
    headerId?: any;
    data: any;
    FilePath: any;
    publicVariable = new publicVariable();
    uploadedFiles: any[] = [];
    TaxInvoicedata?: any;
    TaxInvoiceinfo: any = {};
    InvoiceAttachment: any;
    InvNo: any;
    InvAttachment: any;

    constructor(private route: ActivatedRoute, private CAPI: CustomersService,
        private API: InvoicesService,
        private toastr: ToastrService,
        private router: Router,
        private fb: FormBuilder,
        private fileService: FileService
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

            let decrypted = params['id']
            this.headerId = atob(decrypted);
        });
        this.loadCOAMasterList();
        this.data = history.state.data;
        console.log( this.data);

        this.loadTaxInvoiceAttachment(this.data.postedCreditMemoNumber)

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
                modifiedOn: file.imadModifiedOn,
                doctype:file.doctype

            }));
        } else {
            this.uploadedFiles = [];
            this.handleLoadingError()

        }

    }

    loadTaxInvoiceAttachment(invoice: string) {
        try {
            this.publicVariable.isProcess = true;
            const subscription = this.API.GetSLLTaxInvoiceAttachment(invoice).subscribe({
                next: (response: any) => {

                    console.log(response);

                    if (response.data.length > 0) {
                        this.InvoiceAttachment = response.data[0];
                        this.InvNo = this.InvoiceAttachment.salesCrMemoNo;
                        this.InvAttachment = this.InvoiceAttachment.attachment;


                        console.log(this.InvoiceAttachment);

                        //alert(this.InvoiceAttachment.invoiceNo);
                        this.handleLoadingError();
                    }
                    this.handleLoadingError();
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            this.handleLoadingError();
        }
    }


    downalodInvFile(base64String: any, InvNo: any = 'Invoice') {

        const fileName = InvNo + '.pdf';
        const fileType = `application/pdf`;
        this.fileService.downloadFile(base64String, fileName, fileType);
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

    onSubmit() {
        if (this.publicVariable.dataForm.valid) {
            const newData = this.publicVariable.dataForm.value;
            const newConfig: any = {
                headerId: this.data.headerId,
                loginId: this.publicVariable.storedEmail,
                remarks: newData.remarks,
            }

            this.publicVariable.isProcess = true;
            this.publicVariable.Subscription.add(
                this.API.isCancelPI(newConfig).subscribe({
                    next: (res: any) => {
                        if (res.status === true) {
                            this.toastr.success(res.message, 'Success');
                            // this.router.navigate(['invoice/status']);
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
