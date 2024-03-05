import { Component } from '@angular/core';
import { ActivatedRoute, CustomersService, FormBuilder, InvoicesService, Router, ToastrService, Validators, publicVariable } from '../../Export/invoce';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-invoice-status',
  templateUrl: './view-invoice-status.component.html',
  styleUrls: ['./view-invoice-status.component.css']
})
export class ViewInvoiceStatusComponent {
    headerId?: number;
    data: any;
    FilePath:any;
    publicVariable = new publicVariable();
    uploadedFiles: File[] = [];

    constructor(private route: ActivatedRoute,private CAPI: CustomersService,
         private API: InvoicesService,
         private toastr: ToastrService,
         private router: Router,
         private fb: FormBuilder,
         ) {
            this.initializeForm();
         }

         private initializeForm(): void {
            this.publicVariable.dataForm = this.fb.group({
                remarks:['', Validators.required],
            })
        }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.headerId = +params['id'];
        });
        this.loadCOAMasterList();
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
                modifiedOn: file.imadModifiedOn,

            }));
        } else {
            this.uploadedFiles = [];
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


    getStateNameById(stateId:string) {
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
                statusId: this.data.headerStatusId,
                remarks: newData.remarks,
            }

            console.log(newConfig);

            // this.publicVariable.isProcess = true;
            // this.publicVariable.Subscription.add(
            //     this.API.isApproverRemarks(newConfig).subscribe({
            //         next: (res: any) => {
            //             if (res.status === true) {
            //                 this.toastr.success(res.message, 'Success');
            //                 this.router.navigate(['invoice/status']);
            //                 this.publicVariable.dataForm.reset();
            //             } else {
            //                 this.toastr.error(res.message, 'Error');
            //             }
            //         },
            //         error: (error: any) => {
            //             this.publicVariable.isProcess = false;
            //             this.toastr.error(error.error.message || 'An error occurred. Please try again later.', 'Error');
            //         },
            //         complete: () => {
            //             this.publicVariable.isProcess = false;
            //         }
            //     })
            // );

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
