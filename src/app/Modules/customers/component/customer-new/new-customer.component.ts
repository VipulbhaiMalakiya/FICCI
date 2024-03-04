import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
    ActivatedRoute,
    CustomersService,
    FormBuilder,
    NgbModal,
    Router,
    ToastrService,
    Validators,
    alphanumericWithSpacesValidator,
    gstValidator,
    panValidator,
    publicVariable,
} from '../../Export/new-customer';
@Component({
    selector: 'app-new-customer',
    templateUrl: './new-customer.component.html',
    styleUrls: ['./new-customer.component.css'],
})
export class NewCustomerComponent implements OnInit, OnDestroy {
    publicVariable = new publicVariable();
    customerId?: number;
    data: any;

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
        private cd: ChangeDetectorRef,
        private API: CustomersService,
        private route: ActivatedRoute
    ) {
        this.initializeForm();
    }
    private initializeForm(): void {
        this.publicVariable.dataForm = this.fb.group({
            customerId: [''],
            customerNo: ['', [Validators.maxLength(20)]],
            name: ['', [Validators.required, alphanumericWithSpacesValidator(), Validators.maxLength(100)]],
            name2: ['',],
            address: ['', [Validators.required, Validators.maxLength(100)]],
            address2: [''],
            countryCode: [null, [Validators.required]],
            stateCode: [null, [Validators.required]],
            cityCode: [null, [Validators.required]],
            postCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
            GSTRegistrationNo: ['', [Validators.required, gstValidator()]],
            GSTCustomerType: [null, Validators.required],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(80)]],
            PrimaryContactNo: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],],
            contact: ['', [Validators.required, alphanumericWithSpacesValidator(), Validators.maxLength(100)]],
            PANNo: ['', [Validators.required, panValidator()]],
            isDraft: [false],
        });
    }

    ngOnInit(): void {
        this.loadCountryList();
        this.publicVariable.storedEmail = localStorage.getItem('userEmail') ?? '';

        this.route.params.subscribe((params) => {
            this.customerId = +params['id'];
        });

        if ((this.data = history.state.data)) {
            this.patchFormData(this.data);
        }


    }

    get isAccount() {
        return this.publicVariable.storedRole == 'Accounts';
    }



    ValidateGST() {
        try {
            const gst = this.publicVariable.dataForm.get('GSTRegistrationNo')?.value;

            const subscription = this.API.ValidateGST(gst).subscribe({
                next: (response: any) => {
                    console.log(response);

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



    ngOnDestroy() {
        if (this.publicVariable.Subscription) {
            this.publicVariable.Subscription.unsubscribe();
        }
    }

    patchFormData(data: any): void {

        this.publicVariable.dataForm.patchValue({
            customerId: data.customerId,
            customerNo: data.customerCode,
            name: data.customerName,
            name2: data.customerLastName,
            address: data.address,
            address2: data.address2,
            countryCode: data.countryList.countryCode,
            stateCode: data.stateList.stateCode,
            cityCode: data.cityList.cityCode,
            postCode: data.pincode,
            GSTRegistrationNo: data.gstNumber,
            GSTCustomerType: data.gstType.gstTypeId,
            email: data.email,
            PrimaryContactNo: data.phoneNumber,
            contact: data.contact,
            PANNo: data.pan,
            isDraft: data.isDraft,
        });
    }

    loadCountryList(): void {
        try {
            const subscription = this.API.getCountryList().subscribe({
                next: (response: any) => {
                    this.publicVariable.countryList = response.data;
                    this.loadStateList();
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

    loadStateList() {
        try {
            const subscription = this.API.getStateList().subscribe({
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
            const subscription = this.API.getCityList().subscribe({
                next: (response: any) => {
                    this.publicVariable.cityList = response.data;
                    this.loadGstCustomerType()
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



    loadGstCustomerType(): void {
        try {
            const subscription = this.API.getGstCustomerType().subscribe({
                next: (response: any) => {
                    this.publicVariable.customerTypeList = response.data;
                    this.publicVariable.isProcess = false;
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

    handleLoadingError() {
        this.publicVariable.isProcess = false;
    }

    countrySearchFn(term: string, item: any) {
        const concatenatedString = `${item.countryCode} ${item.countryName}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }

    stateSearchFn(term: string, item: any) {
        const concatenatedString = `${item.stateCode} ${item.stateName}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }
    citySearchFn(term: string, item: any) {
        const concatenatedString = `${item.countryCode} ${item.cityName}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }

    onCitySelectionChange() {
        const selectedId = this.publicVariable.dataForm.get('cityCode')?.value;
        console.log(selectedId);

        if (selectedId) {
            this.publicVariable.dataForm.patchValue({
                postCode: selectedId
            })
        } else {
            this.publicVariable.dataForm.patchValue({
                postCode: null
            })
        }
    }

    postCodeSearchFn(term: string, item: any) {
        const concatenatedString = `${item.postCode} ${item.city}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }

    onInputChange(event: any) {
        const inputValue = event.target.value;
        event.target.value = inputValue.replace(/[^0-9]/g, '');
    }

    onSubmit(action: boolean): void {
        if (this.publicVariable.dataForm.valid) {
            const newData = this.publicVariable.dataForm.value;
            const isUpdate = !!newData.customerId;
            const newConfig: any = {
                isupdate: isUpdate,
                customerId: isUpdate ? newData.customerId : undefined,
                customerCode: newData.customerNo,
                customerName: newData.name.trim(),
                customerLastName: newData.name2.trim(),
                address: newData.address.trim(),
                address2: newData.address2.trim(),
                contact: newData.contact.trim(),
                phone: newData.PrimaryContactNo.trim(),
                pinCode: newData.postCode,
                email: newData.email.trim(),
                cityCode: newData.cityCode,
                stateCode: newData.stateCode,
                countryCode: newData.countryCode,
                isDraft: action,
                gstNumber: newData.GSTRegistrationNo.trim(),
                gstCustomerType: newData.GSTCustomerType,
                pan: newData.PANNo.trim(),
                loginId: this.publicVariable.storedEmail,
                roleName: this.publicVariable.storedRole,
            };
            this.publicVariable.isProcess = true;
            this.publicVariable.Subscription.add(
                this.API.create(newConfig).subscribe({
                    next: (res: any) => {
                        if (res.status === true) {
                            this.toastr.success(res.message, 'Success');
                            this.router.navigate(['customer/status']);
                            this.publicVariable.dataForm.reset();
                        } else {
                            this.toastr.error(res.message, 'Error');
                        }
                    },
                    error: (error: any) => {
                        this.toastr.error(
                            error.error.message ||
                            'An error occurred. Please try again later.',
                            'Error'
                        );
                        this.publicVariable.isProcess = false;
                    },
                    complete: () => {
                        this.publicVariable.isProcess = false;
                    },
                })
            );
        } else {
            this.markFormControlsAsTouched();
        }
    }

    markFormControlsAsTouched(): void {
        [
            'name',
            'address',
            'countryCode',
            'stateCode',
            'cityCode',
            'postCode',
            'GSTRegistrationNo',
            'GSTCustomerType',
            'email',
            'PrimaryContactNo',
            'contact',
            'PANNo',
        ].forEach((controlName) => {
            this.publicVariable.dataForm.controls[controlName].markAsTouched();
        });
    }

    shouldShowError(controlName: string, errorName: string): boolean {
        return (
            this.publicVariable.dataForm.controls[controlName].touched &&
            this.publicVariable.dataForm.controls[controlName].hasError(
                errorName
            )
        );
    }
}
