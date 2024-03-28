import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, AppService, ConfirmationDialogModalComponent, CustomersService, FormBuilder, InvoicesService, NgbModal, Router, ToastrService, Validators, alphanumericWithSpacesValidator, gstValidator, publicVariable } from '../../Export/invoce';
import { FileService } from '../../service/FileService';
import { finalize, timeout } from 'rxjs';
import { InvoiceSummaryModel, invoiceStatusModule } from '../../interface/invoice';
import { environment } from 'src/environments/environment';
import { ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

@Component({
    selector: 'app-creditmemo',
    templateUrl: './creditmemo.component.html',
    styleUrls: ['./creditmemo.component.css']
})
export class CreditmemoComponent implements OnInit {

    publicVariable = new publicVariable();
    Id?: number;
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
    TaxInvoicedata?: any;
    TaxInvoiceinfo: any = {};
    GstRegistrationDetail: any[] = [];
    InvoiceSummaryList: InvoiceSummaryModel[] = [];
    PostedTaxInvoiceCount: number = 0;
    isCalculate: boolean = false;
    isEdit: boolean = false;

    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private API: InvoicesService,
        private CAPI: CustomersService,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef,

    ) {
        this.initializeForm();
        this.createExpenseForm();
    }

    private initializeForm(): void {
        this.publicVariable.dataForm = this.fb.group({
            headerid: [''],
            invoice_no: [null],
            ImpiHeaderInvoiceType: ['Tax Invoice'],
            ImpiHeaderProjectCode: [null, ],
            Project: [{ value: '', disabled: true }, ],
            ImpiHeaderDepartment: [{ value: '', disabled: true }, ],
            ImpiHeaderDivison: [{ value: '', disabled: true }, ],
            ImpiHeaderPanNo: [{ value: 'AAACF1282E', disabled: true }, ],
            ImpiHeaderGstNo: [{ value: '07AAACF1282E1Z1', disabled: true }, ],
            PINO: [''], 
            creditMemoAmount:['',[Validators.required]],
            ImpiHeaderCustomerName: [null,],
            ImpiHeaderCustomerCode: [''], //new filed
            ImpiHeaderCustomerAddress: [null, ],
            ImpiHeaderCustomerState: [null, ],
            ImpiHeaderCustomerCity: [null, ],
            ImpiHeaderCustomerPinCode: [null],
            ImpiHeaderCustomerGstNo: [null],
            ImpiHeaderCustomerContactPerson: [''],
            ImpiHeaderCustomerEmailId: [''],
            ImpiHeaderCustomerPhoneNo: ['', ],
            ImpiHeaderCreatedBy: [''],
            ImpiHeaderTotalInvoiceAmount: [''],//api new filed
            items: this.fb.array([]),
            ImpiHeaderPaymentTerms: [''],
            ImpiHeaderRemarks: [''],
            IsDraft: [false],
            startDate: [{ value: '', disabled: true }, []],
            endDate: [{ value: '', disabled: true }, []],
            TypeofAttachment: [''],
            MemoType: [''],
        });
    }

    private createExpenseForm(): void {
        this.publicVariable.expenseForm = this.fb.group({
            impiGlNo: [null, ],
            impiQuantity: ['', ],
            impiGstgroupCode: [null, ],
            impiHsnsaccode: [null],
            impiUnitPrice: ['', ],
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
        this.loadProjectList();
        this.route.params.subscribe(params => {
            this.Id = +params['id'];
        });
        if (this.data = history.state.data) {
            this.patchFormData(this.data);
            //console.log(this.data);
        }
        this.loadCOAMasterList();
        this.loadGetGSTGroupList();
        // this.loadgetGstRegistrationNoAll();
    }

    loadInvoiceSummary() {
        this.publicVariable.isProcess = true;
        const subscription = this.API.GetInvoiceSummary().pipe(
            timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
            finalize(() => {
                this.publicVariable.isProcess = false;
            })
        ).subscribe({
            next: (response: any) => {
                if (response.data && Array.isArray(response.data)) {

                    // Filter the data by createdBy
                    // this.InvoiceSummaryList = response.data;
                    // this.InvoiceSummaryList = response.data.filter((item: any) => item.createdByUser === this.publicVariable.storedEmail);
                    // this.PostedTaxInvoiceCount = this.InvoiceSummaryList.length;


                    this.InvoiceSummaryList = response.data;
                    this.PostedTaxInvoiceCount = response.data.length;
                } else {
                    // Handle case where response data is null or not an array
                    this.InvoiceSummaryList = [];
                    this.PostedTaxInvoiceCount = 0;
                    console.warn('Response data is null or not an array:', response.data);
                }
                this.publicVariable.isProcess = false;
            },
            error: (error: any) => {
                if (error.name === 'TimeoutError') {
                    this.toastr.error('Operation timed out after 2 minutes', error.name);
                } else {
                    this.toastr.error('Error loading user list', error.name);
                }
                this.publicVariable.isProcess = false;
            }
        });

        this.publicVariable.Subscription.add(subscription);
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
    custominvoiceSearchFn(term: string, item: any) {
        const concatenatedString = `${item.invoice_no} ${item.no}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }
    customSearchFn(term: string, item: any) {
        const concatenatedString = `${item.code} ${item.name}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }
    customerSearchFn(term: string, item: any) {
        const concatenatedString = `${item.custNo} ${item.custName} ${item.custName2} ${item.panNo} ${item.gstregistrationNo}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }

    customerGSTSearchFn(term: string, item: any) {
        const concatenatedString = ` ${item.gstNumber}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }

    onSelectInvoice(event: any) {

        //let data  = event.invoice_no;

        this.loadTaxInvoiceInformation(event.invoice_no)



    }

    loadTaxInvoiceInformation(invoice_no: any) {
        this.publicVariable.isProcess = true;
        try {

            const subscription = this.API.GetTaxInvoiceInformation("SI121683").subscribe({

                // const subscription = this.API.GetTaxInvoiceInformation(invoice_no).subscribe({
                next: (response: any) => {
                    this.TaxInvoicedata = response.data;
                    this.filterTaxInvoiceByInvoiceNo("SI121683");
                    this.publicVariable.isProcess = false;
                    //this.filterTaxInvoiceByInvoiceNo(invoice_no);
                    this.cd.detectChanges();
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

    filterTaxInvoiceByInvoiceNo(invoiceNo: string) {
        if (!this.TaxInvoicedata || !Array.isArray(this.TaxInvoicedata)) {
            console.error("TaxInvoicedata is not properly initialized or is not an array.");
            return;
        }

        const TaxInvoicedataArray = this.TaxInvoicedata.filter((invoice: any) => invoice.invoice_no === invoiceNo);
        if (TaxInvoicedataArray.length === 0) {
            console.log("No invoices found for the provided invoice number.");
            return;
        }

        this.TaxInvoiceinfo = TaxInvoicedataArray[0];


        this.invoicepatchFormData(this.TaxInvoiceinfo);


        this.cd.detectChanges();
    }


    invoicepatchFormData(data: any): void {
        // console.log(data);

        // let peramiter = {
        //     gst:'',
        //     code: ''
        // }


        this.publicVariable.dataForm.patchValue({

            // headerid: '',
            // ImpiHeaderInvoiceType: '',
            ImpiHeaderProjectCode: data.projectCode,
            PINO: data.invoice_no,
            ImpiHeaderCustomerGstNo: data.gsT_No,
            ImpiHeaderCustomerAddress: data.sellToAddress,

            ImpiHeaderCustomerCity: data.sellToCity,
            ImpiHeaderCustomerPinCode: data.sellToPostCode,
            // ImpiHeaderCustomerContactPerson: data.impiHeaderCustomerContactPerson,
            // ImpiHeaderCustomerEmailId: data.impiHeaderCustomerEmailId,
            // ImpiHeaderCustomerPhoneNo: data.impiHeaderCustomerPhoneNo,
            // ImpiHeaderCreatedBy: data.impiHeaderCreatedBy,
            // ImpiHeaderTotalInvoiceAmount: data.impiHeaderTotalInvoiceAmount,
            // ImpiHeaderPaymentTerms: data.impiHeaderPaymentTerms,
            // ImpiHeaderRemarks: data.impiHeaderRemarks,



        });
        this.onSelectProject();

        const customerNo = data.sellToCustomerNo;
        if (customerNo) {
            this.publicVariable.selectCustomer = this.publicVariable.GetCustomerList.find(customer => customer.custNo == customerNo);
            if (this.publicVariable.selectCustomer) {
                this.publicVariable.dataForm.patchValue({
                    ImpiHeaderCustomerName: this.publicVariable.selectCustomer.custName,
                });
                // this.getErpDetailCustNo(this.publicVariable.selectCustomer.custNo);
            } else {

            }
        }


        // Assuming data.getTaxInvoiceInfoLines contains the array of invoice line items
        this.publicVariable.expenses = data.getTaxInvoiceInfoLines.map((item: any) => {
            return {
                type: item.type,
                impiGlNo: item.no_,
                locationCode: item.locationCode,
                impiQuantity: item.quantity,
                impiUnitPrice: item.unitPrice,
                lineAmount: item.lineAmount,
                gSTCredit: item.gSTCredit,
                impiGstgroupCode: item.gSTGroupCode,
                gST_Group_Type: item.gST_Group_Type,
                impiHsnsaccode: item.hSN_SAC_Code,
                // Add more properties as needed
            };
        });
    }

    patchFormData(data: any): void {

        console.log(data);
        
        this.publicVariable.dataForm.patchValue({

            headerid: (data && data.headerId) || (data && data.headerid),
            ImpiHeaderInvoiceType: data.impiHeaderInvoiceType,
            ImpiHeaderProjectCode: data.impiHeaderProjectCode,
            ImpiHeaderDepartment: data.impiHeaderProjectDepartmentName,
            MemoType:data.memoType,
            invoice_no :data.headerPiNo,
            ImpiHeaderDivison: data.impiHeaderProjectDivisionName,
            Project: data.impiHeaderProjectName,
            creditMemoAmount:data.memoAmount,
            ImpiHeaderPanNo: data.impiHeaderPanNo,
            ImpiHeaderGstNo: data.impiHeaderGstNo,
            PINO: data.headerPiNo, //api missing
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
                    this.loadInvoiceSummary();

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
            ImpiHeaderCustomerPinCode: null,
            ImpiHeaderCustomerGstNo: null,
            ImpiHeaderCustomerContactPerson: null,
            ImpiHeaderCustomerEmailId: null,
            ImpiHeaderCustomerPhoneNo: null,
            ImpiHeaderCustomerState: null,
            ImpiHeaderCustomerCity: null,
        });
    }


    getGstRegistrationNo(data: any) {

    }

    onSelectGSTCustomer(event: any): void {



        let peramiter = {
            gst: event.gstNumber,
            code: event.code
        }


        try {

            const subscription = this.API.getGstRegistrationNo(peramiter).subscribe({
                next: (response: any) => {
                    this.GstRegistrationDetail = response.data;

                    if (this.GstRegistrationDetail) {
                        this.publicVariable.selectCustomer = this.GstRegistrationDetail.find(customer => customer.code == event.code);
                        if (this.publicVariable.selectCustomer) {
                            this.publicVariable.dataForm.patchValue({
                                ImpiHeaderCustomerAddress: this.publicVariable.selectCustomer.address,
                                ImpiHeaderCustomerPinCode: this.publicVariable.selectCustomer.pinCode,
                                ImpiHeaderCustomerName: this.publicVariable.selectCustomer.custName,
                                ImpiHeaderCustomerContactPerson: this.publicVariable.selectCustomer.contact,
                                ImpiHeaderCustomerEmailId: this.publicVariable.selectCustomer.email,
                                ImpiHeaderCustomerPhoneNo: this.publicVariable.selectCustomer.primaryContact,
                                ImpiHeaderCustomerState: this.publicVariable.selectCustomer.stateCode,
                                ImpiHeaderCustomerCity: this.publicVariable.selectCustomer.city,

                            });
                        }
                    } else {
                        this.setFormFieldsToNull();
                    }
                },
                error: (error) => {
                    console.error('Error loading project list:', error);
                    this.handleLoadingError()
                    this.setFormFieldsToNull();
                },
            });

            this.publicVariable.Subscription.add(subscription);
        } catch (error) {
            console.error('Error loading project list:', error);
            this.handleLoadingError()
            this.setFormFieldsToNull();
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
        this.isEdit = true;
        this.publicVariable.expenseForm.patchValue({
            impiGstgroupCode: data.impiGstgroupCode,
            impiHsnsaccode: data.impiHsnsaccode,
            impiGlNo: data.impiGlNo,
            impiQuantity: data.impiQuantity,
            impiUnitPrice: data.impiUnitPrice,
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



    onSubmit(Action: string): void {



        
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
                    formData.append('MemoType',newData.MemoType);
                    formData.append('memoAmount', newData.creditMemoAmount);

                    formData.append('isupdate', String(isUpdate));
                    this.publicVariable.selectedProjet = this.publicVariable.projectList.find(project => project.code == newData.ImpiHeaderProjectCode);
                    this.publicVariable.selectCustomer = this.publicVariable.GetCustomerList.find(customer => customer.custName == newData.ImpiHeaderCustomerName);
                    formData.append('ImpiHeaderInvoiceType', newData.ImpiHeaderInvoiceType);
                    formData.append('ImpiHeaderProjectCode', this.publicVariable.selectedProjet.code);

                    formData.append('startDate', this.publicVariable.selectedProjet.startDate);
                    formData.append('endDate', this.publicVariable.selectedProjet.endDate);

                    formData.append('ImpiHeaderPanNo', 'AAACF1282E');
                    formData.append('ImpiHeaderGstNo', '07AAACF1282E1Z1');
                    formData.append('ImpiHeaderCustomerName', newData.ImpiHeaderCustomerName);
                    formData.append('impiHeaderCustomerCode', this.publicVariable.selectCustomer.custNo);
                    formData.append('ImpiHeaderCustomerAddress', newData.ImpiHeaderCustomerAddress);
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
                        formData.append('headerPiNo', newData.invoice_no);
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
                        this.API.createMemo(formData).subscribe({
                            next: (res: any) => {
                                if (res.status === true) {
                                    this.data = res.request;

                                    if (Action == "Calculate") {
                                        this.patchFormData(this.data);
                                        this.toastr.success('Tax Calculated Successfully !!', 'Success');
                                        alert('Tax Calculated Successfully !!');
                                    }
                                    else {
                                        this.toastr.success(res.message, 'Success');
                                        this.router.navigate(['invoice/credit-memo-status']);
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
        [
            'invoice_no','MemoType','creditMemoAmount'
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
        this.onSubmit(Action);
        this.isCalculate = true;
    }

    markexpenseFormControlsAsTouched(): void {
        ['impiGlNo', 'impiQuantity', 'impiGstgroupCode', 'impiUnitPrice'].forEach(controlName => {
            this.publicVariable.expenseForm.controls[controlName].markAsTouched();
        });
    }
    shouldShowExpenseError(controlName: string, errorName: string): boolean {
        return this.publicVariable.expenseForm.controls[controlName].touched && this.publicVariable.expenseForm.controls[controlName].hasError(errorName);
    }
}
