import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, AppService, ConfirmationDialogModalComponent, CustomersService, FormBuilder, InvoicesService, NgbModal, Router, ToastrService, Validators, alphanumericWithSpacesValidator, gstValidator, panValidator, publicVariable } from '../../Export/invoce';
import { AbstractControl, FormArray, FormGroup, ValidatorFn } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ValidationPopupComponent } from '../../View/validation-popup/validation-popup.component';
import { noSpecialCharactersValidator } from '../../Pipe/noSpecialCharactersValidator';


@Component({
    selector: 'app-new-purchase-invoice',
    templateUrl: './new-purchase-invoice.component.html',
    styleUrls: ['./new-purchase-invoice.component.css']
})
export class NewPurchaseInvoiceComponent implements OnInit {

    publicVariable = new publicVariable();
    Id?: any;
    data: any;
    public isEditing: boolean = false;
    uploadedFiles: any[] = [];
    inseetdFiles: any[] = [];
    FilePath: any;
    CustomerGSTNo: any;
    gstExists: boolean = false;
    panExists: boolean = false;
    gstHeaderExists: boolean = false;
    GetCustomerGSTList: any[] = [];
    GetCustomerGSTListAll: any[] = [];
    GstRegistrationDetail: any[] = [];
    isCalculate: boolean = false;
    projectCode?: any;
    customerCode?: any;
    GetDetails: any[] = [];
    navDepartment: any;
    navDepartmentArray: any;
    selectedDept: any;
    isButtonShow: boolean = false;
    selectCustomerNo?:any;
    selectCustomerCode?:any;

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
            ImpiHeaderdept: [null, [Validators.required]],
            ImpiHeaderInvoiceType: ['Proforma Invoice', Validators.required],
            ImpiHeaderProjectCode: [null, [Validators.required]],
            Project: [{ value: '', disabled: true }, [Validators.required]],
            ImpiHeaderDepartment: [{ value: '', disabled: true }, [Validators.required]],
            ImpiHeaderDivison: [{ value: '', disabled: true }, [Validators.required]],
            ImpiHeaderPanNo: [{ value: 'AAACF1282E', disabled: true }, [Validators.required]],
            ImpiHeaderGstNo: [{ value: '07AAACF1282E1Z1', disabled: true }, [Validators.required]],
            PINO: [''], //api missing
            ImpiHeaderCustomerName: [null, [Validators.required]],
            ImpiHeaderCustomerCode: [''], //new filed
            ImpiHeaderCustomerAddress: ['', [Validators.required, Validators.maxLength(100)]],
            ImpiHeaderCustomerAddress2: ['', [Validators.required, Validators.maxLength(100)]],

            ImpiHeaderCustomerState: ['', [Validators.required]],
            ImpiHeaderCustomerCity: ['', [Validators.required]],
            ImpiHeaderCustomerPinCode: ['', [Validators.required]],

            ImpiHeaderCustomerGstNo: ['', [gstValidator()]],
            ImpiHeaderCustomerContactPerson: ['', [Validators.required, alphanumericWithSpacesValidator()]],
            ImpiHeaderCustomerEmailId: ['', [Validators.required, Validators.email, this.emailValidator()]],
            ImpiHeaderCustomerPhoneNo: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
            ImpiHeaderCreatedBy: [''],
            ImpiHeaderTotalInvoiceAmount: [''],//api new filed
            items: this.fb.array([]),
            ImpiHeaderPaymentTerms: [''],
            ImpiHeaderRemarks: [''],
            IsDraft: [false],
            startDate: [{ value: '', disabled: true }, [Validators.required]],
            endDate: [{ value: '', disabled: true }, [Validators.required]],
            TypeofAttachment: ['']
        });
    }

    private createExpenseForm(): void {
        this.publicVariable.expenseForm = this.fb.group({
            impiGlNo: [null, Validators.required],
            impiQuantity: ['', Validators.required],
            impiGstgroupCode: [null, Validators.required],
            impiHsnsaccode: [null],
            impiUnitPrice: ['', Validators.required],
            impiDescription: ['', [Validators.required, noSpecialCharactersValidator()]],
        })
    }

    addressValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const forbidden = /[^a-zA-Z0-9\s.,\-]/.test(control.value);
            return forbidden ? { 'forbiddenCharacters': { value: control.value } } : null;
        };
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

    ngOnInit(): void {

        this.publicVariable.isProcess = false;
        this.loadProjectList();
        this.loadCustomerStatusList();
        this.navDepartment = sessionStorage.getItem('navDepartment')
        this.navDepartmentArray = this.navDepartment.split('|');

        // this.route.params.subscribe(params => {
        //     let decrypted = params['id']
        //     this.Id = atob(decrypted);
        // });

        this.route.params.subscribe(params => {
            // Check if 'id' parameter exists
            if (params && params['id']) {
                let decrypted = params['id'];
                this.Id = atob(decrypted);
                //console.log("Decrypted ID:", this.Id); // Log the decrypted ID
            } else {
               // console.error("ID parameter does not exist.");
            }
        });

        if (this.data = history.state.data) {
            this.patchFormData(this.data);
        }
        this.loadCOAMasterList();
        this.loadGetGSTGroupList();
        // this.loadgetGstRegistrationNoAll();
    }



    onSelectdept(event: any) {
        this.selectedDept = event;


        this.publicVariable.dataForm.patchValue({
            ImpiHeaderDepartment: null,
            ImpiHeaderProjectCode: null,
            ImpiHeaderDivison: null,
            Project: null,
            startDate: null,
            endDate: null
        });
        try {
            const subscription = this.API.getnavProjects(this.selectedDept).subscribe({
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

                    console.log(response.data);
                    this.publicVariable.HSNSACList = response.data;
                    // alert(gstCode.code);
                    // this.publicVariable.expenseForm.controls["impiHsnsaccode"].setValue('');
                    if (gstCode.code == "SER-05") {
                        this.publicVariable.expenseForm.controls["impiHsnsaccode"].setValue('998363');
                    }

                    if (gstCode.code == "SER-18") {
                        this.publicVariable.expenseForm.controls["impiHsnsaccode"].setValue('998596');
                    }



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
        // const concatenatedString = `${item.custNo} ${item.custName} ${item.custName2} ${item.panNo} ${item.gstregistrationNo}`.toLowerCase();
        // return concatenatedString.includes(term.toLowerCase());
        const concatenatedString = ` ${item.gstNumber}${item.code}${item.customerName}
        ${item.address}${item.address2}${item.city}${item.panNo}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }

    customerGSTSearchFn(term: string, item: any) {
        const concatenatedString = ` ${item.gstNumber}${item.code}${item.customerName}
        ${item.address}${item.address2}${item.city}${item.pincode}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }





    loadProjectList(): void {
        try {
            const subscription = this.API.getProjects().subscribe({
                next: (response: any) => {
                    this.publicVariable.projectList = response.data;
                    // this.loadCustomerStatusList();

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
                this.isButtonShow = true;
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
                    this.loadCityList();
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

    loadCityList() {
        try {
            const subscription = this.CAPI.getCityList().subscribe({
                next: (response: any) => {
                    this.publicVariable.cityList = response.data;
                },
                error: (error) => {
                    console.error('Error loading city list:', error);
                    console.error('Failed to load city list. Please try again later.');
                    this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading city list:', error);
            console.error('An unexpected error occurred. Please try again later.');
            this.handleLoadingError();
        }
    }

    stateSearchFn(term: string, item: any) {
        const concatenatedString = `${item.stateCode} ${item.stateName}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }


    onSelectCustomer(): void {

        debugger;
        const selectedId = this.publicVariable.dataForm.get('ImpiHeaderCustomerName')?.value;
        this.setFormFieldsToNull();
        if (selectedId) {
            this.publicVariable.selectCustomer = this.publicVariable.GetCustomerList.find(customer => customer.custName == selectedId);
            if (this.publicVariable.selectCustomer) {
                // this.publicVariable.dataForm.patchValue({
                //     ImpiHeaderCustomerGstNo: this.publicVariable.selectCustomer.gstregistrationNo,
                // });
                this.getErpDetailCustNo(this.publicVariable.selectCustomer.custNo);
            } else {

                this.setFormFieldsToNull(); // Call function to set form fields to null
            }
        } else {
            this.setFormFieldsToNull(); // Call function to set form fields to null
        }
    }

    onSelectStateCustomer(): void {

        this.publicVariable.dataForm.patchValue({
            ImpiHeaderCustomerPinCode: null,
            ImpiHeaderCustomerCity: null,
        });
    }

    loadgetGstRegistrationNoAll(): void {
        try {
            const subscription = this.API.GstRegistrationNoAll().subscribe({
                next: (response: any) => {
                    this.GetCustomerGSTListAll = response.data;
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



    getErpDetailCustNo(data: any) {
        try {
            const subscription = this.API.getErpDetailCustNo(data).subscribe({
                next: (response: any) => {
                    this.GetCustomerGSTList = response.data;
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    this.handleLoadingError();
                    this.setFormFieldsToNull(); // Call function to set form fields to null
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading  list:', error);
            this.handleLoadingError();
            this.setFormFieldsToNull();
        }
    }

    // Function to set form fields to null
    private setFormFieldsToNull() {
        this.publicVariable.dataForm.patchValue({
            ImpiHeaderCustomerAddress: null,
            ImpiHeaderCustomerAddress2: null,
            ImpiHeaderCustomerPinCode: null,
            ImpiHeaderCustomerGstNo: null,
            ImpiHeaderCustomerContactPerson: null,
            ImpiHeaderCustomerEmailId: null,
            ImpiHeaderCustomerPhoneNo: null,
            ImpiHeaderCustomerState: null,
            ImpiHeaderCustomerCity: null,
        });
    }



    CustomerCode :string='';




    loadgetGetDetails(): void {
        try {
            let data: any = {
                projectCode: this.projectCode,
                customerCode: this.customerCode,
                //customerCode: 'C00002'
            }

            const subscription = this.API.getGetDetails(data).subscribe({
                next: (response: any) => {
                    this.GetDetails = response.data;

                    if (response.status === true) {
                        const modalRef = this.modalService.open(ValidationPopupComponent, { size: "xl" });
                        var componentInstance = modalRef.componentInstance as ValidationPopupComponent;
                        componentInstance.isEmail = this.GetDetails;
                        modalRef.result.then((data: any) => {

                            if (data == true) {
                                this.publicVariable.dataForm.reset();
                            }

                        })
                    }

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


    // onSelectGSTCustomer(): void {

    //     const selectedId = this.publicVariable.dataForm.get('ImpiHeaderCustomerGstNo')?.value;

    //     try {

    //         const subscription = this.API.getGstRegistrationNo(selectedId).subscribe({
    //             next: (response: any) => {
    //                 this.GstRegistrationDetail = response.data;

    //                 if (this.GstRegistrationDetail) {
    //                     this.publicVariable.selectCustomer = this.GstRegistrationDetail.find(customer => customer.gstNumber == selectedId);
    //                     if (this.publicVariable.selectCustomer) {
    //                         this.publicVariable.dataForm.patchValue({
    //                             ImpiHeaderCustomerAddress: this.publicVariable.selectCustomer.address,
    //                             ImpiHeaderCustomerPinCode: this.publicVariable.selectCustomer.pinCode,
    //                             ImpiHeaderCustomerName: this.publicVariable.selectCustomer.custName,
    //                             ImpiHeaderCustomerContactPerson: this.publicVariable.selectCustomer.contact,
    //                             ImpiHeaderCustomerEmailId: this.publicVariable.selectCustomer.email,
    //                             ImpiHeaderCustomerPhoneNo: this.publicVariable.selectCustomer.primaryContact,
    //                             ImpiHeaderCustomerState: this.publicVariable.selectCustomer.stateCode,
    //                             ImpiHeaderCustomerCity: this.publicVariable.selectCustomer.city,
    //                         });
    //                     }
    //                 } else {
    //                     this.setFormFieldsToNull();
    //                 }
    //             },
    //             error: (error) => {
    //                 console.error('Error loading project list:', error);
    //                 this.handleLoadingError()
    //                 this.setFormFieldsToNull();
    //             },
    //         });

    //         this.publicVariable.Subscription.add(subscription);
    //     } catch (error) {
    //         console.error('Error loading project list:', error);
    //         this.handleLoadingError()
    //         this.setFormFieldsToNull();
    //     }


    // }

    handleLoadingError() {
        this.publicVariable.isProcess = false; // Set status to false on error
    }
    onSelectProject() {
        const selectedId = this.publicVariable.dataForm.get('ImpiHeaderProjectCode')?.value;
        this.projectCode = selectedId;
        if (selectedId) {
            this.publicVariable.selectedProjet = this.publicVariable.projectList.find(project => project.code == selectedId);
            if (this.publicVariable.selectedProjet) {
                this.publicVariable.dataForm.patchValue({
                    ImpiHeaderDepartment: this.publicVariable.selectedProjet.departmentName,
                    ImpiHeaderDivison: this.publicVariable.selectedProjet.divisionName,
                    Project: this.publicVariable.selectedProjet.name,
                    startDate: this.publicVariable.selectedProjet.startDate,
                    endDate: this.publicVariable.selectedProjet.endDate,
                });
            }
        } else {
            this.publicVariable.dataForm.patchValue({
                ImpiHeaderDepartment: null,
                ImpiHeaderDivison: null,
                Project: null,
                startDate: null,
                endDate: null
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

        // Check if a category is selected
        const selectedCategory = this.publicVariable.dataForm.get('TypeofAttachment')?.value;
        if (!selectedCategory) {
            alert('Please select a category before selecting files.');
            event.target.value = null;
            return;
        }
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
            this.uploadedFiles.push({ file: file, category: selectedCategory });
            this.inseetdFiles.push({ file: file, category: selectedCategory });
        }
        // Clear the file input after successful file selection
        event.target.value = null;
        this.publicVariable.dataForm?.get('TypeofAttachment')?.reset('');
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

    deleteFile(index: number, file: any) {

        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
        var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
        componentInstance.message = "Do you really want to delete these records? This process cannot be undone ?";
        modalRef.result.then((canDelete: boolean) => {
            if (canDelete) {
                this.uploadedFiles.splice(index, 1);

                if (file) {
                    this.publicVariable.isProcess = true;

                    this.API.deleteFile(file.id).subscribe({
                        next: (res: any) => {
                            this.toastr.success(res.message, 'Success');
                            // this.uploadedFiles.splice(index, 1);
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

    downalodFile(fileUrl: any) {

        this.FilePath = `${environment.fileURL}${fileUrl.fileUrl}`;
        window.open(this.FilePath, '_blank');

    }

    citySearchFn(term: string, item: any) {
        const concatenatedString = `${item.countryCode} ${item.cityName}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }

    gstSearchFn(term: string, item: any) {
        const concatenatedString = `${item.no} ${item.name}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }




    onCitySelectionChange() {

        const selectedCityName = this.publicVariable.dataForm.get('ImpiHeaderCustomerCity')?.value;

        this.publicVariable.dataForm.patchValue({
            ImpiHeaderCustomerPinCode: null
        })

        const selectedCity = this.publicVariable.cityList.find(city => city.cityName === selectedCityName);
        if (selectedCity) {
            this.publicVariable.dataForm.patchValue({
                ImpiHeaderCustomerPinCode: selectedCity.cityCode
            })
        } else {
            this.publicVariable.dataForm.patchValue({
                ImpiHeaderCustomerPinCode: null
            })
        }
    }

    onAddLine() {
        if (this.publicVariable.expenseForm.valid) {
            // console.log(this.publicVariable.expenseForm.value;

            if (this.isEditing) {
                // Updating an existing record
                this.publicVariable.expenses[this.publicVariable.editingIndex] = this.publicVariable.expenseForm.value;
                this.publicVariable.editingIndex = -1;
                this.toastr.success('Sales Line updated successfully', 'Success');
                alert('Sales Line  updated successfully')
            } else {
                // Adding a new record
                this.publicVariable.expenses.push(this.publicVariable.expenseForm.value);
                this.toastr.success('Sales Line  added successfully', 'Success');
                alert('Sales Line  added successfully')
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
            impiGstgroupCode: data.impiGstgroupCode,
            impiHsnsaccode: data.impiHsnsaccode,
            impiGlNo: data.impiGlNo,
            impiQuantity: data.impiQuantity,
            impiUnitPrice: data.impiUnitPrice,
            impiDescription: data.impiDescription,
        });
        this.publicVariable.editingIndex = index;
        this.isEditing = true;
    }


    validateGST() {
        try {
            let gst: any;

            const selectedId = this.publicVariable.dataForm.get('ImpiHeaderCustomerName')?.value;

            if (selectedId) {
                this.publicVariable.selectCustomer = this.publicVariable.GetCustomerList.find(customer => customer.custName == selectedId);
                if (this.publicVariable.selectCustomer) {
                    gst = this.publicVariable.selectCustomer.gstregistrationNo

                }
            } else {
                gst = this.publicVariable.dataForm.get('GSTRegistrationNo')?.value;
            }

            const subscription = this.CAPI.ValidateGST(selectedId).subscribe({
                next: (response: any) => {
                    if (response.status) {
                        // GST number does not exist
                        console.log('GST number does not exist');
                        this.gstExists = false;
                        // You can update the UI to indicate that the GST number is valid
                    } else {
                        // GST number already exists
                        console.log('GST number already exists');
                        this.gstExists = true;
                        return
                        // You can update the UI to indicate that the GST number already exists
                    }
                },
                error: (error) => {
                    console.error('Error loading data:', error);
                    this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading data list:', error);
            this.handleLoadingError();
        }
    }


    ValidatePAN() {
        try {
            const pan = this.publicVariable.dataForm.get('ImpiHeaderPanNo')?.value;
            const subscription = this.CAPI.ValidatePAN(pan).subscribe({
                next: (response: any) => {
                    if (response.status) {
                        // PAN number does not exist
                        console.log('PAN number does not exist');
                        this.panExists = false;
                        // You can update the UI to indicate that the PAN number is valid
                    } else {
                        // PAN number already exists
                        alert('PAN number already exists');
                        this.panExists = true;
                        return
                        // You can update the UI to indicate that the PAN number already exists
                    }
                },
                error: (error) => {
                    console.error('Error loading data:', error);
                    this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading data list:', error);
            this.handleLoadingError();
        }
    }

    validateHeaderGST() {
        try {
            const gst = this.publicVariable.dataForm.get('ImpiHeaderGstNo')?.value;
            const subscription = this.CAPI.ValidateGST(gst).subscribe({
                next: (response: any) => {
                    if (response.status) {
                        // GST number does not exist
                        console.log('GST number does not exist');
                        this.gstHeaderExists = false;
                        // You can update the UI to indicate that the GST number is valid
                    } else {
                        // GST number already exists
                        alert('GST number already exists');
                        this.gstHeaderExists = true;
                        return
                        // You can update the UI to indicate that the GST number already exists
                    }
                },
                error: (error) => {
                    console.error('Error loading data:', error);
                    this.handleLoadingError();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading data list:', error);
            this.handleLoadingError();
        }
    }

    onSelectGSTCustomer(event: any): void {

        // this.onSelectCustomer();
        // console.log(event);

        // if(this.CustomerCode =='')
        // {
        //    this.CustomerCode =event.code;
        // }


        // const selectedId = this.publicVariable.dataForm.get('ImpiHeaderCustomerName')?.value;

        // console.log(selectedId);


        // this.publicVariable.selectCustomer = this.GstRegistrationDetail.find(customer => customer.code == event.code);


        this.selectCustomerNo = event.custNo;
        this.selectCustomerCode = event.code;
        this.publicVariable.dataForm.patchValue({


            ImpiHeaderCustomerAddress: event.address,
            ImpiHeaderCustomerAddress2: event.address2,
            ImpiHeaderCustomerPinCode: event.pincode,
            ImpiHeaderCustomerName: event.custName,
            ImpiHeaderCustomerContactPerson: event.contact,
            ImpiHeaderCustomerEmailId: event.email,
            ImpiHeaderCustomerPhoneNo: event.primaryContact,
            ImpiHeaderCustomerState: event.statecode,
            ImpiHeaderCustomerCity: event.city,
            ImpiHeaderCustomerGstNo: event.gstNumber,
        });



        // const selectedId = this.publicVariable.dataForm.get('ImpiHeaderCustomerGstNo')?.value;
        // console.log(selectedId);
        //let selectDATA= this.GetCustomerGSTList.find(customer => customer.code == selectedId);
        //
        //console.log(selectDATA.gstNumber);

        //this.CustomerGSTNo =selectDATA.gstNumber;
        //alert(selectDATA.code);

        // this.GetCustomerGSTList

        let peramiter = {
            gst: event.gstNumber,
            code: event.code
        }

        this.customerCode = event.code;
        this.loadgetGetDetails()

        // try {

        //     const subscription = this.API.getGstRegistrationNo(peramiter).subscribe({
        //         next: (response: any) => {
        //             this.GstRegistrationDetail = response.data;

        //             if (this.GstRegistrationDetail) {
        //                 this.publicVariable.selectCustomer = this.GstRegistrationDetail.find(customer => customer.code == event.code);
        //                 if (this.publicVariable.selectCustomer) {

        //                     console.log(this.publicVariable.selectCustomer);
        //                     this.publicVariable.dataForm.patchValue({
        //                         ImpiHeaderCustomerAddress: this.publicVariable.selectCustomer.address,
        //                         ImpiHeaderCustomerAddress2: this.publicVariable.selectCustomer.address2,
        //                         ImpiHeaderCustomerPinCode: this.publicVariable.selectCustomer.pinCode,
        //                         ImpiHeaderCustomerName: this.publicVariable.selectCustomer.custName,
        //                         ImpiHeaderCustomerContactPerson: this.publicVariable.selectCustomer.contact,
        //                         ImpiHeaderCustomerEmailId: this.publicVariable.selectCustomer.email,
        //                         ImpiHeaderCustomerPhoneNo: this.publicVariable.selectCustomer.primaryContact,
        //                         ImpiHeaderCustomerState: this.publicVariable.selectCustomer.stateCode,
        //                         ImpiHeaderCustomerCity: this.publicVariable.selectCustomer.city,
        //                         ImpiHeaderCustomerGstNo: this.publicVariable.selectCustomer.gstNumber,

        //                     });
        //                 }
        //             }

        //             else {
        //                 this.setFormFieldsToNull();
        //             }
        //         },
        //         error: (error) => {
        //             console.error('Error loading project list:', error);
        //             this.handleLoadingError()
        //             this.setFormFieldsToNull();
        //         },
        //     });

        //     this.publicVariable.Subscription.add(subscription);
        // } catch (error) {
        //     console.error('Error loading project list:', error);
        //     this.handleLoadingError()
        //     this.setFormFieldsToNull();
        // }


    }

    patchFormData(data: any): void {

        console.log('edit date',data);
        this.selectCustomerNo = '';
        this.selectCustomerCode =data.impiHeaderCustomerCode;

        this.publicVariable.dataForm.patchValue({



            headerid: (data && data.headerId) || (data && data.headerid),
            ImpiHeaderInvoiceType: data.impiHeaderInvoiceType,
            ImpiHeaderdept: data.impiHeaderProjectDepartmentName,
            ImpiHeaderProjectCode: data.impiHeaderProjectCode,
            ImpiHeaderDepartment: data.impiHeaderProjectDepartmentName,

            ImpiHeaderDivison: data.impiHeaderProjectDivisionName,
            Project: data.impiHeaderProjectName,

            ImpiHeaderPanNo: data.impiHeaderPanNo,
            ImpiHeaderGstNo: data.impiHeaderGstNo,
            PINO: [''], //api missing
            ImpiHeaderCustomerName: data.impiHeaderCustomerName,
            ImpiHeaderCustomerCode: data.impiHeaderCustomerCode,
            ImpiHeaderCustomerAddress: data.impiHeaderCustomerAddress,
            ImpiHeaderCustomerAddress2: data.impiHeaderCustomerAddress2,
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
            startDate: data.startDate,
            endDate: data.endDate,

        });

        this.publicVariable.expenses = data.lineItem_Requests;
        this.uploadedFiles = data.impiHeaderAttachment;

        if (data.impiHeaderAttachment !== null && data.impiHeaderAttachment !== undefined) {

            this.uploadedFiles = data.impiHeaderAttachment.map((file: any) => ({
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
                doctype: file.doctype
            }));
        } else {
            // Handle the case when data.impiHeaderAttachment is null or undefined
            // For example, you might want to set uploadedFiles to an empty array or handle it differently based on your application logic.
            this.uploadedFiles = [];
        }

    }


    onSubmit(Action: string): void {


        debugger;
        if (this.publicVariable.dataForm.value.ImpiHeaderCustomerContactPerson == null ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerContactPerson == undefined ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerContactPerson == ''
        ) {
            alert('Enter the Customer contact person');
        }

        else if (this.publicVariable.dataForm.value.ImpiHeaderCustomerEmailId == null ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerEmailId == undefined ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerEmailId == ''
        ) {
            alert('Enter the Customer Email Id');
        }

        else if (this.publicVariable.dataForm.value.ImpiHeaderCustomerPhoneNo == null ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerPhoneNo == undefined ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerPhoneNo == ''
        ) {
            alert('Enter the Customer Phone No.');
        }

        else if (this.publicVariable.dataForm.value.ImpiHeaderCustomerAddress == null ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerAddress == undefined ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerAddress == ''
        ) {
            alert('Enter the Address.');
        }
        else if (this.publicVariable.dataForm.value.ImpiHeaderCustomerAddress2 == null ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerAddress2 == undefined ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerAddress2 == ''
        ) {
            alert('Enter the Address 2.');
        }
        else if (this.publicVariable.dataForm.value.ImpiHeaderCustomerState == null ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerState == undefined ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerState == ''
        ) {
            alert('Enter the State.');
        }
        else if (this.publicVariable.dataForm.value.ImpiHeaderCustomerCity == null ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerCity == undefined ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerCity == ''
        ) {
            alert('Enter the city.');
        }
        else if (this.publicVariable.dataForm.value.ImpiHeaderCustomerPinCode == null ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerPinCode == undefined ||
            this.publicVariable.dataForm.value.ImpiHeaderCustomerPinCode == ''
        ) {
            alert('Enter the Pin card.');
        }

        if (Action === 'Calculate') {
            if (!this.publicVariable.dataForm.valid) {
                this.publicVariable.isProcess = false;
                this.markFormControlsAsTouched();

                this.toastr.error("Enter the Customer contact person", "error");

                return;
            }

        }
        // debugger;

        if (this.publicVariable.expenses.length === 0) {
            this.toastr.error('Please add sales line before submitting.', 'Error');
            window.alert('Please add sales line before submitting.');
            return
        }

        if (Action !== 'Calculate' && !this.isCalculate) {
            alert("Please Calculate the tax details");
            return
        }

        let action = true;
        if (Action == "Submit")
            action = false;

        if (this.publicVariable.expenses.length > 0) {
            if (action || this.uploadedFiles.length > 0) {
                if (this.publicVariable.dataForm.valid && !this.gstExists && !this.panExists) {
                    const newData = this.publicVariable.dataForm.value;
                    const isUpdate = !!newData.headerid;
                    let impiHeaderTotalInvoiceAmount = 0; // Initialize the total amount
                    let lineNo = 10000;
                    const formData = new FormData();
                    if (isUpdate) {
                        formData.append('headerid', isUpdate ? newData.headerid : undefined);
                    }
                    formData.append('isupdate', String(isUpdate));
                    this.publicVariable.selectedProjet = this.publicVariable.projectList.find(project => project.code == newData.ImpiHeaderProjectCode);
                    // this.publicVariable.selectCustomer = this.publicVariable.GetCustomerList.find(customer => customer.custName == newData.ImpiHeaderCustomerName);

                    formData.append('impiHeaderCustomerCode',  this.selectCustomerCode);
                    formData.append('impiHeaderCustomerNo',  this.selectCustomerNo);



                    // alert(this.publicVariable.selectCustomer);
                    //console.log(this.publicVariable.selectCustomer);

                    formData.append('ImpiHeaderInvoiceType', newData.ImpiHeaderInvoiceType);
                    formData.append('ImpiHeaderProjectCode', this.publicVariable.selectedProjet.code);

                    formData.append('startDate', this.publicVariable.selectedProjet.startDate);
                    formData.append('endDate', this.publicVariable.selectedProjet.endDate);

                    formData.append('ImpiHeaderPanNo', 'AAACF1282E');
                    formData.append('ImpiHeaderGstNo', '07AAACF1282E1Z1');
                    formData.append('ImpiHeaderCustomerName', newData.ImpiHeaderCustomerName);
                    formData.append('ImpiHeaderCustomerAddress', newData.ImpiHeaderCustomerAddress);
                    formData.append('ImpiHeaderCustomerAddress2', newData.ImpiHeaderCustomerAddress2);
                    formData.append('ImpiHeaderCustomerCity', newData.ImpiHeaderCustomerCity);
                    formData.append('ImpiHeaderCustomerState', newData.ImpiHeaderCustomerState);
                    formData.append('ImpiHeaderCustomerPinCode', newData.ImpiHeaderCustomerPinCode);
                    // formData.append('ImpiHeaderCustomerGstNo', this.CustomerGSTNo);
                    formData.append('ImpiHeaderCustomerGstNo', newData.ImpiHeaderCustomerGstNo);
                    formData.append('ImpiHeaderCustomerContactPerson', newData.ImpiHeaderCustomerContactPerson);
                    formData.append('ImpiHeaderCustomerEmailId', newData.ImpiHeaderCustomerEmailId);
                    formData.append('ImpiHeaderCustomerPhoneNo', newData.ImpiHeaderCustomerPhoneNo);
                    formData.append('impiHeaderCreatedBy', this.publicVariable.storedEmail)
                    formData.append('ImpiHeaderPaymentTerms', newData.ImpiHeaderPaymentTerms);
                    formData.append('ImpiHeaderRemarks', newData.ImpiHeaderRemarks);

                    formData.append('IsDraft', action.toString());
                    formData.append('LoginId', this.publicVariable.storedEmail);
                    // Check if ImpiHeaderInvoiceType is Tax Invoice, then include PINO
                    if (newData.ImpiHeaderInvoiceType === 'Tax Invoice') {
                        formData.append('ImpiHeaderPiNo', newData.PINO);
                    }
                    formData.append('ImpiHeaderTlApprover', this.publicVariable.selectedProjet.tlApprover);
                    formData.append('ImpiHeaderClusterApprover', this.publicVariable.selectedProjet.chApprover);
                    formData.append('ImpiHeaderFinanceApprover', this.publicVariable.selectedProjet.financeApprover);
                    formData.append('ImpiHeaderSupportApprover', this.publicVariable.selectedProjet.supportApprover);
                    formData.append('ImpiHeaderProjectName', this.publicVariable.selectedProjet.name);
                    formData.append('ImpiHeaderProjectDivisionCode', this.publicVariable.selectedProjet.divisionCode);
                    formData.append('ImpiHeaderProjectDivisionName', this.publicVariable.selectedProjet.divisionName);
                    formData.append('ImpiHeaderProjectDepartmentCode', this.publicVariable.selectedProjet.departmentCode);
                    formData.append('ImpiHeaderProjectDepartmentName', this.publicVariable.selectedProjet.departmentName);
                    formData.append('RoleName', this.publicVariable.storedRole);
                    for (let i = 0; i < this.publicVariable.expenses.length; i++) {
                        const item = this.publicVariable.expenses[i];
                        let GL: any = this.publicVariable.COAMasterList.find(gl => gl.no == item.impiGlNo);
                        formData.append(`lineItem_Requests[${i}].ImpiNetTotal`, '0');
                        formData.append(`lineItem_Requests[${i}].ImpiLocationCode`, 'FICCI-DL');
                        formData.append(`lineItem_Requests[${i}].ImpiQuantity`, item.impiQuantity);
                        formData.append(`lineItem_Requests[${i}].ImpiUnitPrice`, item.impiUnitPrice);
                        formData.append(`lineItem_Requests[${i}].ImpiGstgroupCode`, item.impiGstgroupCode);
                        formData.append(`lineItem_Requests[${i}].ImpiGstgroupType`, 'GOODS');
                        formData.append(`lineItem_Requests[${i}].ImpiLineNo`, String(lineNo));
                        formData.append(`lineItem_Requests[${i}].ImpiHsnsaccode`, item.impiHsnsaccode);
                        formData.append(`lineItem_Requests[${i}].ImpiGlNo`, GL.no);
                        formData.append(`lineItem_Requests[${i}].documentType`, 'Invoice');
                        formData.append(`lineItem_Requests[${i}].ImpiType`, 'G/L Account');
                        formData.append(`lineItem_Requests[${i}].ImpiDocumentNo`, '');
                        formData.append(`lineItem_Requests[${i}].ImpiGstBaseAmount`, '');
                        formData.append(`lineItem_Requests[${i}].ImpiTotalGstAmount`, '');
                        formData.append(`lineItem_Requests[${i}].ImpiNetTotal`, '');
                        formData.append(`lineItem_Requests[${i}].ImpiLinePiNo`, '');
                        formData.append(`lineItem_Requests[${i}].ImpiLineDescription`, item.impiDescription);
                        // Calculate the amount here
                        const impiQuantity = parseFloat(item.impiQuantity);
                        const unitPrice = parseFloat(item.impiUnitPrice);
                        const calculateAmount = impiQuantity * unitPrice;
                        formData.append(`lineItem_Requests[${i}].ImpiLineAmount`, calculateAmount.toString());
                        impiHeaderTotalInvoiceAmount += calculateAmount;
                        // Increment line number for next iteration
                        lineNo += 10000; // Increment by 10000 for each row
                    }
                    formData.append('impiHeaderTotalInvoiceAmount', String(impiHeaderTotalInvoiceAmount));


                    for (let i = 0; i < this.inseetdFiles.length; i++) {
                        const item = this.inseetdFiles[i];
                        // Check if item.file is defined before appending
                        if (item.file && item.category) {
                            formData.append(`DocType[${i}].doctype`, item.category);
                            formData.append(`DocType[${i}].content`, item.file);
                        }
                    }



                    this.publicVariable.isProcess = true;
                    // Submit the formData
                    this.publicVariable.Subscription.add(
                        this.API.create(formData).subscribe({
                            next: (res: any) => {
                                if (res.status === true) {
                                    this.data = res.request;
                                    if (Action == "Calculate") {
                                        this.patchFormData(this.data);
                                        this.toastr.success('Tax Calculated Successfully !!', 'Success');
                                        alert('Tax Calculated Successfully !!');
                                        // this.isCalculate =false;
                                    }
                                    else {
                                        this.toastr.success(res.message, 'Success');
                                        // this.router.navigate(['invoice/status']);
                                        this.router.navigate(['dashboard']);
                                        this.publicVariable.dataForm.reset();
                                    }

                                    this.toastr.success(res.message, 'Success');

                                    //  this.toastr.success(res.message, 'Success');
                                    //this.patchFormData( this.data)


                                    //this.router.navigate(['invoice/status']);
                                    // this.publicVariable.dataForm.reset();
                                } else {
                                    this.toastr.error(res.message, 'Error');
                                    this.publicVariable.isProcess = false;
                                }
                            },
                            error: (error: any) => {
                                this.publicVariable.isProcess = false;
                                alert(error.error.message || 'An error occurred. Please try again later.');
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
            else {
                this.toastr.error('File is required.', 'Error');
                window.alert('File is required.');
            }

        }
        else {
            this.toastr.error('Please add expenses before submitting.', 'Error');
            window.alert('Please add expenses before submitting.');
            return
        }

    }

    markFormControlsAsTouched(): void {
        ['ImpiHeaderInvoiceType', 'ImpiHeaderProjectCode', 'ImpiHeaderDepartment', 'ImpiHeaderDivison', 'ImpiHeaderPanNo', 'ImpiHeaderGstNo',
            'ImpiHeaderCustomerName', 'ImpiHeaderCustomerAddress', 'ImpiHeaderCustomerState', 'ImpiHeaderCustomerCity', 'ImpiHeaderCustomerEmailId',
            'ImpiHeaderCustomerGstNo', 'ImpiHeaderCustomerContactPerson', 'ImpiHeaderCustomerPhoneNo', 'items',
            'startDate', 'endDate', 'ImpiHeaderdept', 'ImpiHeaderCustomerAddress2', 'ImpiHeaderCustomerPinCode',
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
        return (e.impiQuantity * e.impiUnitPrice) * (1 + gstPercentage / 100);
    }

    calculateGSTAmount(e: any): number {
        const gstBaseAmount = this.calculateGSTBaseAmount(e);
        return gstBaseAmount - (e.impiQuantity * e.impiUnitPrice);
    }


    calculateTotalBaseAmount(): number {
        return this.publicVariable.expenses.reduce((total, expense) => total + (expense.impiQuantity * expense.impiUnitPrice), 0);
    }

    calculateTotalGSTAmount(): number {
        return this.publicVariable.expenses.reduce((total, expense) => total + this.calculateGSTAmount(expense), 0);
    }

    calculateNetTotal(): number {
        return this.calculateTotalBaseAmount() + this.calculateTotalGSTAmount();
    }

    onCalculateClick(Action: any): void {
        // this.calculateTotalBaseAmount();
        // this.calculateTotalGSTAmount();
        // this.calculateNetTotal();
        this.publicVariable.isProcess = true;
        this.onSubmit(Action);
        this.isCalculate = true;
    }

    markexpenseFormControlsAsTouched(): void {
        ['impiGlNo', 'impiQuantity', 'impiGstgroupCode', 'impiUnitPrice', 'impiDescription'].forEach(controlName => {
            this.publicVariable.expenseForm.controls[controlName].markAsTouched();
        });
    }
    shouldShowExpenseError(controlName: string, errorName: string): boolean {
        return this.publicVariable.expenseForm.controls[controlName].touched && this.publicVariable.expenseForm.controls[controlName].hasError(errorName);
    }
}
