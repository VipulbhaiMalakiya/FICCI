import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, AppService, ConfirmationDialogModalComponent, CustomersService, FormBuilder, InvoicesService, NgbModal, Router, ToastrService, Validators, alphanumericWithSpacesValidator, gstValidator, panValidator, publicVariable } from '../../Export/invoce';
import { FormArray, FormGroup } from '@angular/forms';
import { finalize, timeout } from 'rxjs';


@Component({
    selector: 'app-new-purchase-invoice',
    templateUrl: './new-purchase-invoice.component.html',
    styleUrls: ['./new-purchase-invoice.component.css']
})
export class NewPurchaseInvoiceComponent implements OnInit {

    publicVariable = new publicVariable();
    ImpiHeaderAttachment: any;
    Id?: number;
    data: any;
    public isEditing: boolean = false;
    uploadedFiles: File[] = [];


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
        this.createExpenseForm();
    }

    private initializeForm(): void {
        this.publicVariable.dataForm = this.fb.group({
            headerid: [''],
            ImpiHeaderInvoiceType: ['Proforma Invoice', Validators.required],
            ImpiHeaderProjectCode: [null, [Validators.required]],
            Project: [{ value: '', disabled: true }, [Validators.required]],
            ImpiHeaderDepartment: [{ value: '', disabled: true }, [Validators.required]],
            ImpiHeaderDivison: [{ value: '', disabled: true }, [Validators.required]],
            ImpiHeaderPanNo: ['', [Validators.required, panValidator()]],
            ImpiHeaderGstNo: ['', [Validators.required, gstValidator()]],
            PINO: [''], //api missing
            ImpiHeaderCustomerName: [null, [Validators.required]],
            ImpiHeaderCustomerCode: [''], //new filed
            ImpiHeaderCustomerAddress: ['', [Validators.required]],
            ImpiHeaderCustomerState: [null, [Validators.required]],
            ImpiHeaderCustomerCity: [null, [Validators.required]],
            ImpiHeaderCustomerPinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
            ImpiHeaderCustomerGstNo: ['', [Validators.required, gstValidator()]],
            ImpiHeaderCustomerContactPerson: ['', [Validators.required, alphanumericWithSpacesValidator()]],
            ImpiHeaderCustomerEmailId: ['', [Validators.required, Validators.email]],
            ImpiHeaderCustomerPhoneNo: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
            ImpiHeaderCreatedBy: [''],
            ImpiHeaderTotalInvoiceAmount: [''],//api new filed
            items: this.fb.array([]),
            ImpiHeaderPaymentTerms: [''],
            ImpiHeaderRemarks: [''],
            IsDraft: [false]
        });
    }

    private createExpenseForm(): void {
        this.publicVariable.expenseForm = this.fb.group({
            natureOfExpense: [null, Validators.required],
            quantity: ['', Validators.required],
            gstGroupCode: [null, Validators.required],
            hsnCode: [null, Validators.required],
            unitCost: ['', Validators.required],
        })
    }


    ngOnInit(): void {
        this.loadProjectList();
        this.route.params.subscribe(params => {
            this.Id = +params['id'];
        });
        if (this.data = history.state.data) {
            this.patchFormData(this.data);
        }
        this.loadCOAMasterList();
        this.loadGetGSTGroupList();
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

    loadGetGSTGroupList(): void {
        try {
            const subscription = this.API.GetGSTGroupList().subscribe({
                next: (response: any) => {
                    this.publicVariable.GSTGroupList = response.data;
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

    onGSTGroupChange(gstCode: any) {
        try {

            const subscription = this.API.GetHSNSACLIist(gstCode.code).subscribe({
                next: (response: any) => {
                    this.publicVariable.HSNSACList = response.data;
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

    customSearchFn(term: string, item: any) {
        const concatenatedString = `${item.code} ${item.name}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }
    customerSearchFn(term: string, item: any) {
        const concatenatedString = `${item.custNo} ${item.custName} ${item.custName2} ${item.panNo} ${item.gstregistrationNo}`.toLowerCase();
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
            Project: data.Project
            // items: this.fb.array([]),
        });
        const lineItemsArray = this.publicVariable.dataForm.get('items') as FormArray;
        lineItemsArray.clear(); // Clear existing items before patching

        // data.lineItem_Requests.forEach((item: any) => {
        //     lineItemsArray.push(this.fb.group({
        //         impiLineDescription: [item.impiLineDescription],
        //         impiLineQuantity: [item.impiLineQuantity],
        //         impiLineDiscount: [item.impiLineDiscount],
        //         impiLineUnitPrice: [item.impiLineUnitPrice],
        //     }));
        // });
    }

    loadProjectList(): void {
        try {
            const subscription = this.API.getProjects().subscribe({
                next: (response: any) => {
                    this.publicVariable.projectList = response.data;
                    this.loadCustomerStatusList();

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
        const subscription = this.API.GetCustomerList().pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                this.publicVariable.GetCustomerList = response.data;
                this.loadStateList();
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

    loadStateList() {
        try {
            const subscription = this.CAPI.getStateList().subscribe({
                next: (response: any) => {
                    this.publicVariable.stateList = response.data;
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

    stateSearchFn(term: string, item: any) {
        const concatenatedString = `${item.stateCode} ${item.stateName}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }


    onSelectCustomer(): void {
        const selectedId = this.publicVariable.dataForm.get('ImpiHeaderCustomerName')?.value;

        if (selectedId) {
            this.publicVariable.selectCustomer = this.publicVariable.GetCustomerList.find(customer => customer.custName == selectedId);
            if (this.publicVariable.selectCustomer) {
                this.publicVariable.dataForm.patchValue({
                    ImpiHeaderCustomerAddress: this.publicVariable.selectCustomer.custAddress,
                    ImpiHeaderCustomerPinCode: this.publicVariable.selectCustomer.pinCode,
                    ImpiHeaderCustomerGstNo: this.publicVariable.selectCustomer.gstregistrationNo,
                    ImpiHeaderCustomerContactPerson: this.publicVariable.selectCustomer.contact,
                    ImpiHeaderCustomerEmailId: this.publicVariable.selectCustomer.email,
                    ImpiHeaderCustomerPhoneNo: this.publicVariable.selectCustomer.primaryContactNo,
                    ImpiHeaderCustomerState: this.publicVariable.selectCustomer.stateCode,
                    ImpiHeaderCustomerCity: this.publicVariable.selectCustomer.city,
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

    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
    }
    onSelectProject() {
        const selectedId = this.publicVariable.dataForm.get('ImpiHeaderProjectCode')?.value;
        if (selectedId) {
            this.publicVariable.selectedProjet = this.publicVariable.projectList.find(project => project.code == selectedId);
            if (this.publicVariable.selectedProjet) {
                this.publicVariable.dataForm.patchValue({
                    ImpiHeaderDepartment: this.publicVariable.selectedProjet.departmentName,
                    ImpiHeaderDivison: this.publicVariable.selectedProjet.divisionName,
                    Project: this.publicVariable.selectedProjet.name

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

    deleteFile(index: number) {
        this.uploadedFiles.splice(index, 1);
    }

    onAddLine() {
        if (this.publicVariable.expenseForm.valid) {
            if (this.isEditing) {
                // Updating an existing record
                this.publicVariable.expenses[this.publicVariable.editingIndex] = this.publicVariable.expenseForm.value;
                this.publicVariable.editingIndex = -1;
                this.toastr.success('Expense updated successfully', 'Success');
            } else {
                // Adding a new record
                this.publicVariable.expenses.push(this.publicVariable.expenseForm.value);
                this.toastr.success('Expense added successfully', 'Success');
            }
            this.publicVariable.expenseForm.reset();
            this.isEditing = false;
        } else {
            this.markexpenseFormControlsAsTouched();
            this.toastr.error('Please fill out all required fields', 'Error');
        }


    }


    editExpense(data: any, index: number) {
        this.publicVariable.expenseForm.patchValue({
            gstGroupCode: data.gstGroupCode,
            hsnCode: data.hsnCode,
            natureOfExpense: data.natureOfExpense,
            quantity: data.quantity,
            unitCost: data.unitCost,
        });
        this.publicVariable.editingIndex = index;
        this.isEditing = true;
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
            this.publicVariable.selectedProjet = this.publicVariable.projectList.find(project => project.code == newData.ImpiHeaderProjectCode);
            this.publicVariable.selectCustomer = this.publicVariable.GetCustomerList.find(customer => customer.custName == newData.ImpiHeaderCustomerName);
            formData.append('ImpiHeaderAttachment', this.ImpiHeaderAttachment);

            formData.append('ImpiHeaderInvoiceType', newData.ImpiHeaderInvoiceType);
            formData.append('ImpiHeaderProjectCode', this.publicVariable.selectedProjet.code);
            formData.append('ImpiHeaderPanNo', newData.ImpiHeaderPanNo);
            formData.append('ImpiHeaderGstNo', newData.ImpiHeaderGstNo);
            formData.append('ImpiHeaderCustomerName', newData.ImpiHeaderCustomerName);
            formData.append('impiHeaderCustomerCode', this.publicVariable.selectCustomer.custNo);
            formData.append('ImpiHeaderCustomerAddress', newData.ImpiHeaderCustomerAddress);
            formData.append('ImpiHeaderCustomerCity', newData.ImpiHeaderCustomerCity);
            formData.append('ImpiHeaderCustomerState', newData.ImpiHeaderCustomerState);
            formData.append('ImpiHeaderCustomerPinCode', newData.ImpiHeaderCustomerPinCode);
            formData.append('ImpiHeaderCustomerGstNo', newData.ImpiHeaderCustomerGstNo);
            formData.append('ImpiHeaderCustomerContactPerson', newData.ImpiHeaderCustomerContactPerson);
            formData.append('ImpiHeaderCustomerEmailId', newData.ImpiHeaderCustomerEmailId);
            formData.append('ImpiHeaderCustomerPhoneNo', newData.ImpiHeaderCustomerPhoneNo);
            formData.append('impiHeaderCreatedBy', this.publicVariable.storedEmail)

            //TEST CODE
            formData.append('impiHeaderTotalInvoiceAmount', '123')
            formData.append('ImpiHeaderPaymentTerms', newData.ImpiHeaderPaymentTerms);
            formData.append('ImpiHeaderRemarks', newData.ImpiHeaderRemarks);
            formData.append('IsDraft', action.toString());
            formData.append('LoginId', this.publicVariable.storedEmail);
            // Check if ImpiHeaderInvoiceType is Tax Invoice, then include PINO
            if (newData.ImpiHeaderInvoiceType === 'Tax Invoice') {
                formData.append('ImpiHeaderPiNo', newData.PINO);
            }
            formData.append('ImpiHeaderTlApprover', 'amit.jha@teamcomputers.com');
            formData.append('ImpiHeaderClusterApprover', 'debananda.panda@teamcomputers.com ');
            formData.append('ImpiHeaderFinanceApprover', 'gautam.v@teamcomputers.com');
            formData.append('ImpiHeaderProjectName', this.publicVariable.selectedProjet.name);
            formData.append('ImpiHeaderProjectDivisionCode', this.publicVariable.selectedProjet.divisionCode);
            formData.append('ImpiHeaderProjectDivisionName', this.publicVariable.selectedProjet.divisionName);
            formData.append('ImpiHeaderProjectDepartmentCode', this.publicVariable.selectedProjet.departmentCode);
            formData.append('ImpiHeaderProjectDepartmentName', this.publicVariable.selectedProjet.departmentName);
            formData.append('RoleName', this.publicVariable.storedRole);
            formData.append('ImpiHeaderSupportApprover', this.publicVariable.selectedProjet.supportApprover);
            formData.append('RoleName', this.publicVariable.storedRole);

            formData.append('ImpiHeaderTotalInvoiceAmount', '00');

            for (let i = 0; i < this.publicVariable.expenses.length; i++) {
                const item = this.publicVariable.expenses[i];
                console.log("Appending data for item:", item);
                formData.append(`lineItem_Requests[${i}].ImpiNetTotal`, '0');
                formData.append(`lineItem_Requests[${i}].ImpiLocationCode`, 'FICCI-DL');
                formData.append(`lineItem_Requests[${i}].ImpiQuantity`, item.quantity);
                formData.append(`lineItem_Requests[${i}].ImpiUnitPrice`, item.unitCost);

                formData.append(`lineItem_Requests[${i}].ImpiGstgroupCode`, item.gstGroupCode);
                formData.append(`lineItem_Requests[${i}].ImpiGstgroupType`, 'GOODS');
                formData.append(`lineItem_Requests[${i}].ImpiLineNo`, '10000');
                formData.append(`lineItem_Requests[${i}].ImpiHsnsaccode`, item.hsnCode);
                formData.append(`lineItem_Requests[${i}].documentType`, item.natureOfExpense);


                // Calculate the amount here
                const quantity = parseFloat(item.quantity);
                const unitPrice = parseFloat(item.unitCost);
                const calculateAmount = quantity * unitPrice;

                // Append the calculated amount to the FormData object
                formData.append(`lineItem_Requests[${i}].ImpiLineAmount`, calculateAmount.toString());

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
            'ImpiHeaderCustomerGstNo', 'ImpiHeaderCustomerContactPerson', 'ImpiHeaderCustomerPhoneNo', 'items'
        ].forEach(controlName => {
            this.publicVariable.dataForm.controls[controlName].markAsTouched();
        });
    }

    shouldShowError(controlName: string, errorName: string): boolean {
        return this.publicVariable.dataForm.controls[controlName].touched && this.publicVariable.dataForm.controls[controlName].hasError(errorName);
    }





    deleteExpense(index: number) {
        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
        var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
        componentInstance.message = "Do you really want to delete these records? This process cannot be undone ?";
        modalRef.result.then((canDelete: boolean) => {
            if (canDelete) {
                this.publicVariable.expenses.splice(index, 1);
                this.toastr.success('Expense deleted successfully!', 'Success');
            }
        }).catch(() => { });
    }

    calculateGSTBaseAmount(e: any): number {
        // change gstPercentage in gst
        const gstPercentage = 5;
        return (e.quantity * e.unitCost) * (1 + gstPercentage / 100);
    }

    calculateGSTAmount(e: any): number {
        const gstBaseAmount = this.calculateGSTBaseAmount(e);
        return gstBaseAmount - (e.quantity * e.unitCost);
    }


    calculateTotalBaseAmount(): number {
        return this.publicVariable.expenses.reduce((total, expense) => total + (expense.quantity * expense.unitCost), 0);
    }

    calculateTotalGSTAmount(): number {
        return this.publicVariable.expenses.reduce((total, expense) => total + this.calculateGSTAmount(expense), 0);
    }

    calculateNetTotal(): number {
        return this.calculateTotalBaseAmount() + this.calculateTotalGSTAmount();
    }

    onCalculateClick(): void {
        this.calculateTotalBaseAmount();
        this.calculateTotalGSTAmount();
        this.calculateNetTotal();
    }

    markexpenseFormControlsAsTouched(): void {
        ['natureOfExpense', 'quantity', 'gstGroupCode', 'hsnCode', 'unitCost'].forEach(controlName => {
            this.publicVariable.expenseForm.controls[controlName].markAsTouched();
        });
    }
    shouldShowExpenseError(controlName: string, errorName: string): boolean {
        return this.publicVariable.expenseForm.controls[controlName].touched && this.publicVariable.expenseForm.controls[controlName].hasError(errorName);
    }
}
