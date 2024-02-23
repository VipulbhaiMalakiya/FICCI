import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, AppService, CustomersService, FormBuilder, InvoicesService, NgbModal, Router, ToastrService, Validators, alphanumericWithSpacesValidator, gstValidator, panValidator, publicVariable } from '../../Export/invoce';
import { FormArray } from '@angular/forms';
import { finalize, timeout } from 'rxjs';


@Component({
    selector: 'app-new-purchase-invoice',
    templateUrl: './new-purchase-invoice.component.html',
    styleUrls: ['./new-purchase-invoice.component.css']
})
export class NewPurchaseInvoiceComponent implements OnInit {

    publicVariable = new publicVariable();
    items: any[] = [
        { impiLineDescription: '', impiLineQuantity: '', impiLineDiscount: '', impiLineUnitPrice: '', calculateAmount: '' }
    ];
    ImpiHeaderAttachment: any;
    Id?: number;
    data: any;

    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private API: InvoicesService,
        private CAPI: CustomersService,
        private route: ActivatedRoute

    ) {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.publicVariable.dataForm = this.fb.group({
            headerid: [''],
            ImpiHeaderInvoiceType: ['Proforma Invoice', Validators.required],
            ImpiHeaderProjectCode: [null, [Validators.required]],
            ImpiHeaderDepartment: [{ value: '', disabled: true }, [Validators.required]],
            ImpiHeaderDivison: [{ value: '', disabled: true }, [Validators.required]],
            ImpiHeaderPanNo: ['', [Validators.required, panValidator()]], // Use the custom validator function
            ImpiHeaderGstNo: ['', [Validators.required, gstValidator()]],
            PINO: [''], //api missing
            ImpiHeaderCustomerName: [null, [Validators.required]],
            ImpiHeaderCustomerCode: [''], //new filed
            ImpiHeaderCustomerAddress: ['', [Validators.required]],
            ImpiHeaderCustomerState: [null, [Validators.required]],
            ImpiHeaderCustomerCity: [null, [Validators.required]],
            ImpiHeaderCustomerPinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
            ImpiHeaderCustomerGstNo: ['', [Validators.required, gstValidator()]],
            ImpiHeaderCustomerContactPerson: ['', [Validators.required,alphanumericWithSpacesValidator()]],
            ImpiHeaderCustomerEmailId: ['', [Validators.required, Validators.email]],
            ImpiHeaderCustomerPhoneNo: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
            ImpiHeaderCreatedBy: [''],
            ImpiHeaderTotalInvoiceAmount: [''],//api new filed
            items: this.fb.array([]),
            ImpiHeaderPaymentTerms: [''],
            ImpiHeaderRemarks: [''],
            IsDraft: [false]
        });
        // Initialize items form array
        this.items.forEach(item => this.addItem(item));
    }



    ngOnInit(): void {
        this.loadProjectList();
        this.loadCustomerStatusList();

        this.route.params.subscribe(params => {
            this.Id = +params['id'];
        });
        if (this.data = history.state.data) {
            this.patchFormData(this.data);
        }

    }

    customSearchFn(term: string, item: any) {
        const concatenatedString = `${item.projectCode} ${item.projectName}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }
    customerSearchFn(term: string, item: any){
        const concatenatedString = `${item.customerName} ${item.pan} ${item.gstNumber}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }

    patchFormData(data: any): void {

        this.publicVariable.dataForm.patchValue({
            headerid: data.headerId,
            ImpiHeaderInvoiceType: data.impiHeaderInvoiceType,
            ImpiHeaderProjectCode: data.impiHeaderProjectCode,
            ImpiHeaderDepartment: data.impiHeaderDepartment,
            ImpiHeaderDivison: data.impiHeaderDivison,
            ImpiHeaderPanNo: data.impiHeaderPanNo,
            ImpiHeaderGstNo: data.impiHeaderGstNo,
            PINO: [''], //api missing
            ImpiHeaderCustomerName: data.impiHeaderCustomerName,
            ImpiHeaderCustomerCode: data.impiHeaderCustomerCode,
            ImpiHeaderCustomerAddress: data.impiHeaderCustomerAddress,
            ImpiHeaderCustomerState: data.impiHeaderCustomerState,
            ImpiHeaderCustomerCity: data.impiHeaderCustomerCity,
            ImpiHeaderCustomerPinCode: data.impiHeaderCustomerPinCode,
            ImpiHeaderCustomerGstNo: data.impiHeaderCustomerGstNo,
            ImpiHeaderCustomerContactPerson: data.impiHeaderCustomerContactPerson,
            ImpiHeaderCustomerEmailId: data.impiHeaderCustomerEmailId,
            ImpiHeaderCustomerPhoneNo: data.impiHeaderCustomerPhoneNo,
            ImpiHeaderCreatedBy: data.impiHeaderCreatedBy,
            ImpiHeaderTotalInvoiceAmount: data.impiHeaderTotalInvoiceAmount,
            ImpiHeaderPaymentTerms: data.impiHeaderPaymentTerms,
            ImpiHeaderRemarks: data.impiHeaderRemarks,
            IsDraft: data.isDraft,
            // items: this.fb.array([]),
        });
        const lineItemsArray = this.publicVariable.dataForm.get('items') as FormArray;
        lineItemsArray.clear(); // Clear existing items before patching

        data.lineItem_Requests.forEach((item: any) => {
            lineItemsArray.push(this.fb.group({
                impiLineDescription: [item.impiLineDescription],
                impiLineQuantity: [item.impiLineQuantity],
                impiLineDiscount: [item.impiLineDiscount],
                impiLineUnitPrice: [item.impiLineUnitPrice],
            }));
        });
    }

    loadProjectList(): void {
        try {
            const subscription = this.API.getProjects().subscribe({
                next: (response: any) => {
                    this.publicVariable.projectList = response.data;
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

    loadCustomerStatusList(): void {
        const subscription = this.API.getCustomerStatusNew().pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                this.publicVariable.customerStatusList = response.data;
            },
            error: (error: any) => {
                if (error.name === 'TimeoutError') {
                    this.toastr.error('Operation timed out after 40 seconds', error.name);
                } else {
                    this.toastr.error('Error loading user list', error.name);
                }
            }
        });

        this.publicVariable.Subscription.add(subscription);
    }
    onSelectCustomer(): void {
        const selectedId = this.publicVariable.dataForm.get('ImpiHeaderCustomerName')?.value;
        if (selectedId) {
            this.publicVariable.selectCustomer = this.publicVariable.customerStatusList.find(customer => customer.customerName == selectedId);
            // this.onSelectState(this.publicVariable.selectCustomer.country);
            // this.onSelectCity(this.publicVariable.selectCustomer.state);

            if (this.publicVariable.selectCustomer) {
                this.publicVariable.dataForm.patchValue({
                    ImpiHeaderCustomerAddress: this.publicVariable.selectCustomer.address,
                    ImpiHeaderCustomerPinCode: this.publicVariable.selectCustomer.pincode,
                    ImpiHeaderCustomerGstNo: this.publicVariable.selectCustomer.gstNumber,
                    ImpiHeaderCustomerContactPerson: this.publicVariable.selectCustomer.contact,
                    ImpiHeaderCustomerEmailId: this.publicVariable.selectCustomer.email,
                    ImpiHeaderCustomerPhoneNo: this.publicVariable.selectCustomer.phoneNumber,
                    ImpiHeaderCustomerState: this.publicVariable.selectCustomer.stateCode,
                    ImpiHeaderCustomerCity: this.publicVariable.selectCustomer.cityCode,
                });
            }
        } else {
            this.publicVariable.dataForm.patchValue({
                ImpiHeaderCustomerAddress: null,
                ImpiHeaderCustomerPinCode: null,
                ImpiHeaderCustomerGstNo: null,
                ImpiHeaderCustomerContactPerson: null,
                ImpiHeaderCustomerEmailId: null,
                ImpiHeaderCustomerPhoneNo: null,
                ImpiHeaderCustomerState: null,
                ImpiHeaderCustomerCity: null

            });
        }
    }

    // onSelectState(event: any) {
    //     const selectedCountry = event;
    //     const countryId = selectedCountry ? selectedCountry.countryId : null;
    //     try {
    //         const subscription = this.CAPI.getStateList(countryId).subscribe({
    //             next: (response: any) => {
    //                 this.publicVariable.stateList = response.data;
    //             },
    //             error: (error) => {
    //                 console.error('Error loading project list:', error);
    //             }
    //         });

    //         this.publicVariable.Subscription.add(subscription);
    //     } catch (error) {
    //         console.error('Error loading project list:', error);
    //     }


    // }
    // onSelectCity(event: any) {
    //     const selectedState = event;
    //     const stateId = selectedState ? selectedState.stateId : null;
    //     try {
    //         const subscription = this.CAPI.getCityList(stateId).subscribe({
    //             next: (response: any) => {
    //                 this.publicVariable.cityList = response.data;
    //             },
    //             error: (error) => {
    //                 console.error('Error loading project list:', error);
    //             }
    //         });

    //         this.publicVariable.Subscription.add(subscription);
    //     } catch (error) {
    //         console.error('Error loading project list:', error);
    //     }


    // }
    onSelectProject() {
        const selectedId = this.publicVariable.dataForm.get('ImpiHeaderProjectCode')?.value;
        if (selectedId) {
            this.publicVariable.selectedProjet = this.publicVariable.projectList.find(project => project.projectCode == selectedId);
            if (this.publicVariable.selectedProjet) {
                this.publicVariable.dataForm.patchValue({
                    ImpiHeaderDepartment: this.publicVariable.selectedProjet.department,
                    ImpiHeaderDivison: this.publicVariable.selectedProjet.divison,
                });
            }
        } else {
            this.publicVariable.dataForm.patchValue({
                ImpiHeaderDepartment: null,
                ImpiHeaderDivison: null,
            });
        }
    }

    onInputChange(event: any) {
        const inputValue = event.target.value; event.target.value = inputValue.replace(/[^0-9]/g, ''); // Allow only numeric input
    }
    onDiscountInput(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value; let numericValue = inputValue.replace(/[^0-9.]/g, ''); // Allow only numeric input and '.'
        const decimalParts = numericValue.split('.');
        if (decimalParts.length > 1 && decimalParts[1].length > 2) {
            numericValue = decimalParts[0] + '.' + decimalParts[1].substring(0, 2);
        }
        if (decimalParts[0].length > 2) {
            numericValue = numericValue.substring(0, 2) + '.' + numericValue.substring(2);
        }
        (event.target as HTMLInputElement).value = numericValue;

    }
    priceValidator(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        let numericValue = inputValue.replace(/[^0-9.]/g, '');
        const decimalParts = numericValue.split('.');
        if (decimalParts.length > 1) {
            const integerPart = decimalParts[0];
            const decimalPart = decimalParts[1].slice(0, 2);
            numericValue = integerPart + '.' + decimalPart;
        }

        (event.target as HTMLInputElement).value = numericValue;
    }

    get itemsFormArray(): FormArray {
        return this.publicVariable.dataForm.get('items') as FormArray;
    }
    addItem(item?: any): void {
        item = item || { impiLineDescription: '', impiLineQuantity: '', impiLineDiscount: '', impiLineUnitPrice: '', calculateAmount: '' };
        this.itemsFormArray.push(this.fb.group({
            impiLineDescription: [item.impiLineDescription, Validators.required],
            impiLineQuantity: [item.impiLineQuantity, Validators.required],
            impiLineDiscount: [item.impiLineDiscount, [Validators.required, Validators.min(0), Validators.max(100)]],
            impiLineUnitPrice: [item.impiLineUnitPrice, Validators.required],
            calculateAmount: [this.calculateAmount(item), Validators.required]
        }));
    }

    removeItem(index: number): void {
        this.itemsFormArray.removeAt(index);
    }

    calculateAmount(item: any): number {
        const impiLineQuantity = parseFloat(item.impiLineQuantity) || 0;
        const impiLineDiscount = parseFloat(item.impiLineDiscount) || 0;
        const impiLineUnitPrice = parseFloat(item.impiLineUnitPrice) || 0;
        const amount = impiLineQuantity * impiLineUnitPrice * (1 - impiLineDiscount / 100);
        return isNaN(amount) ? 0 : amount;
    }

    calculateTotalAmount(): number {
        let total = 0;
        this.itemsFormArray.controls.forEach(control => {
            total += this.calculateAmount(control.value);
        });
        return total;
    }


    onFileSelected(event: any) {
        const selectedFile = event.target.files[0];
        const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            'application/msword', // .doc
            'text/csv', // .csv
            'application/pdf']; // .pdf
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes

        if (!selectedFile) {
            // No file selected
            return;
        }

        if (!allowedTypes.includes(selectedFile.type)) {
            alert('Only .doc, .csv, .xlsx, and .pdf files are allowed.');
            // Clear the file input
            event.target.value = null;
            return;
        }

        if (selectedFile.size > maxSize) {
            alert('File size exceeds the maximum limit of 5MB.');
            // Clear the file input
            event.target.value = null;
            return;
        }
        this.ImpiHeaderAttachment = selectedFile;

    }


    onSubmit(action: boolean): void {

        if (this.publicVariable.dataForm.valid) {
            const newData = this.publicVariable.dataForm.value;
            const isUpdate = !!newData.headerid;
            const formData = new FormData();

            if (isUpdate) {
                formData.append('headerid', isUpdate ? newData.headerid : undefined);
            }
            formData.append('isupdate', String(isUpdate));
            this.publicVariable.selectedProjet = this.publicVariable.projectList.find(project => project.projectCode == newData.ImpiHeaderProjectCode);
            formData.append('ImpiHeaderAttachment', this.ImpiHeaderAttachment);
            formData.append('ImpiHeaderInvoiceType', newData.ImpiHeaderInvoiceType);
            formData.append('ImpiHeaderProjectCode', newData.ImpiHeaderProjectCode);
            formData.append('ImpiHeaderDepartment', this.publicVariable.selectedProjet.department);
            formData.append('ImpiHeaderDivison', this.publicVariable.selectedProjet.divison);
            formData.append('ImpiHeaderPanNo', newData.ImpiHeaderPanNo);
            formData.append('ImpiHeaderGstNo', newData.ImpiHeaderGstNo);
            formData.append('PINO', newData.PINO);
            formData.append('ImpiHeaderCustomerName', newData.ImpiHeaderCustomerName);
            formData.append('ImpiHeaderCustomerAddress', newData.ImpiHeaderCustomerAddress);
            formData.append('ImpiHeaderCustomerState', newData.ImpiHeaderCustomerState);
            formData.append('ImpiHeaderCustomerCity', newData.ImpiHeaderCustomerCity);
            formData.append('ImpiHeaderCustomerPinCode', newData.ImpiHeaderCustomerPinCode);
            formData.append('ImpiHeaderCustomerGstNo', newData.ImpiHeaderCustomerGstNo);
            formData.append('ImpiHeaderCustomerContactPerson', newData.ImpiHeaderCustomerContactPerson);
            formData.append('ImpiHeaderCustomerEmailId', newData.ImpiHeaderCustomerEmailId);
            formData.append('ImpiHeaderCustomerPhoneNo', newData.ImpiHeaderCustomerPhoneNo);
            formData.append('ImpiHeaderPaymentTerms', newData.ImpiHeaderPaymentTerms);
            formData.append('ImpiHeaderRemarks', newData.ImpiHeaderRemarks);
            formData.append('IsDraft', action.toString());
            formData.append('LoginId',   this.publicVariable.storedEmail);
            formData.append('ImpiHeaderTotalInvoiceAmount', String(this.calculateTotalAmount()));
            formData.append('ImpiHeaderCustomerCode', 'dummy');
            formData.append('ImpiHeaderCreatedBy', 'dummy');
            for (let i = 0; i < newData.items.length; i++) {
                const item = newData.items[i];
                formData.append(`lineItem_Requests[${i}].impiLineDescription`, item.impiLineDescription);
                formData.append(`lineItem_Requests[${i}].impiLineQuantity`, item.impiLineQuantity);
                formData.append(`lineItem_Requests[${i}].impiLineDiscount`, item.impiLineDiscount);
                formData.append(`lineItem_Requests[${i}].impiLineUnitPrice`, item.impiLineUnitPrice);
                // Calculate the amount here
                const quantity = parseFloat(item.impiLineQuantity);
                const unitPrice = parseFloat(item.impiLineUnitPrice);
                const discount = parseFloat(item.impiLineDiscount);
                const calculateAmount = quantity * unitPrice * (1 - (discount / 100));
                // Append the calculated amount to the FormData object
                formData.append(`lineItem_Requests[${i}].impiLineAmount`, calculateAmount.toString());
            }


            // Check if ImpiHeaderInvoiceType is Tax Invoice, then include PINO
            if (newData.ImpiHeaderInvoiceType === 'Tax Invoice') {
                formData.append('PINO', newData.PINO);
            }
            this.publicVariable.isProcess = true;
            // Submit the formData
            this.publicVariable.Subscription.add(
                this.API.create(formData).subscribe({
                    next: (res: any) => {
                        if (res.status === true) {
                            this.toastr.success(res.message, 'Success');
                            this.router.navigate(['invoice/status']);
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
            this.markFormControlsAsTouched();
        }
    }

    markFormControlsAsTouched(): void {
        ['ImpiHeaderInvoiceType', 'ImpiHeaderProjectCode', 'ImpiHeaderDepartment', 'ImpiHeaderDivison', 'ImpiHeaderPanNo', 'ImpiHeaderGstNo',
            'ImpiHeaderCustomerName', 'ImpiHeaderCustomerAddress', 'ImpiHeaderCustomerState', 'ImpiHeaderCustomerCity', 'ImpiHeaderCustomerPinCode', 'ImpiHeaderCustomerEmailId',
            'ImpiHeaderCustomerGstNo', 'ImpiHeaderCustomerContactPerson', 'ImpiHeaderCustomerPhoneNo', 'items'].forEach(controlName => {
                this.publicVariable.dataForm.controls[controlName].markAsTouched();
            });
    }

    shouldShowError(controlName: string, errorName: string): boolean {
        return this.publicVariable.dataForm.controls[controlName].touched && this.publicVariable.dataForm.controls[controlName].hasError(errorName);
    }
}
