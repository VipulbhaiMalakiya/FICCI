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
import { AbstractControl, ValidatorFn } from '@angular/forms';
@Component({
    selector: 'app-new-customer',
    templateUrl: './new-customer.component.html',
    styleUrls: ['./new-customer.component.css'],
})
export class NewCustomerComponent implements OnInit, OnDestroy {
    publicVariable = new publicVariable();
    customerId?: any;
    data: any;
    gstExists: boolean = false;
    panExists: boolean = false;
    gstStateCode: any;
    stateCode: any;
    selectedCountryCode!: string;

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




    onCountryChange(event: any): void {
        this.selectedCountryCode = event;
        console.log('Selected country code:', event);
    }

    private initializeForm(): void {
        this.publicVariable.dataForm = this.fb.group({
            customerId: [''],
            customerNo: ['', [Validators.maxLength(20)]],
            name: ['', [Validators.required, alphanumericWithSpacesValidator(), Validators.maxLength(100)]],
            name2: [null, [
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9 ]*$') // Allow alphanumeric characters and spaces
            ]],
            address: ['', [Validators.required, this.addressValidator(), Validators.maxLength(100)]],
            address2: ['', [this.addressValidator(), Validators.maxLength(100)]],
            countryCode: [null, [Validators.required]],
            stateCode: [null, [Validators.required]],
            cityCode: [null, [Validators.required]],
            postCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
            GSTRegistrationNo: [''],
            GSTCustomerType: [null, Validators.required],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(80), this.emailValidator()]],
            PrimaryContactNo: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],],
            contact: ['', [Validators.required, alphanumericWithSpacesValidator(), Validators.maxLength(100)]],
            PANNo: ['', [Validators.required, panValidator()]],
            isDraft: [false],
            CustomerRemarks: ['', [Validators.required]],

        });
    }

    addressValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const forbidden = /[^a-zA-Z0-9\s\-]/.test(control.value);
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
        this.loadCountryList();
        this.publicVariable.storedEmail = sessionStorage.getItem('userEmail') ?? '';

        // this.route.params.subscribe((params) => {
        //     //this.customerId = +params['id'];

        //     let decrypted = params['id']
        //     this.customerId = atob(decrypted);
        // });


        this.route.params.subscribe(params => {
            // Check if 'id' parameter exists
            if (params && params['id']) {
                let decrypted = params['id'];
                this.customerId = atob(decrypted);
                console.log("Decrypted ID:", this.customerId); // Log the decrypted ID
            } else {
                console.error("ID parameter does not exist.");
            }
        });

        if ((this.data = history.state.data)) {
            this.patchFormData(this.data);
        }


    }

    get isAccount() {
        return this.publicVariable.storedRole == 'Accounts';
    }







    ValidatePAN() {
        try {
            const pan = this.publicVariable.dataForm.get('PANNo')?.value;

            if (pan.length < 10) {

                this.toastr.warning('Please enter Valid PAN No.');
                // this.toastr.warning('Please enter Valid PAN No.');
                return;
            }

            const subscription = this.API.ValidatePAN(pan).subscribe({
                next: (response: any) => {
                    if (response.status) {
                        // PAN number does not exist
                        console.log('PAN number does not exist');
                        this.panExists = false;
                        // You can update the UI to indicate that the PAN number is valid
                    } else {
                        // PAN number already exists
                        // this.toastr.warning('Customers with the same PAN Number and different GST Number already exist');
                        this.panExists = true;
                        // return
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
            CustomerRemarks: data.customerRemarks,
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
        const concatenatedString = `${item.cityCode} ${item.cityName}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }

    ongstTypeChange(event: any) {
        // Clear the GST registration number when the dropdown selection changes
        this.publicVariable.dataForm?.get('GSTRegistrationNo')?.setValue('');
        this.setGstValidator();

    }

    onSelectStateCustomer(event: any) {

        this.gstStateCode = event.gstStateCode;
        this.stateCode = event.stateCode;

        this.publicVariable.dataForm.patchValue({
            GSTRegistrationNo: null
        })

        // this.setPANValidator();


    }

    private setGstValidator() {
        const gstRegistrationNoControl = this.publicVariable.dataForm?.get('GSTRegistrationNo');

        if (gstRegistrationNoControl) {
            const gstCustomerTypeControl = this.publicVariable.dataForm?.get('GSTCustomerType');
            if (gstCustomerTypeControl?.value == 2) {
                gstRegistrationNoControl.clearValidators(); // Remove all validators
                gstRegistrationNoControl.setValue(''); // Clear the value
            } else {
                gstRegistrationNoControl.setValidators([Validators.required, gstValidator(this.gstStateCode)]);


            }
            gstRegistrationNoControl.updateValueAndValidity();
        }
    }


    onCitySelectionChange() {
        const selectedId = this.publicVariable.dataForm.get('cityCode')?.value;

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

    onpostCodeSelectionChange(event: any) {
        // Get the value of the post code field
        const selectedId = this.publicVariable.dataForm.get('postCode')?.value;

        if (selectedId.length <= 5) return;
        console.log(selectedId);

        // Check if the post code field has been cleared
        if (!selectedId) {
            // If the post code field is cleared, clear the city code as well
            this.publicVariable.dataForm.patchValue({
                cityCode: null
            });
            return; // Exit the function early since there's no need to proceed further
        }

        // Find the city object in cityList where cityCode matches selectedId
        const selectedCity: any = this.publicVariable.cityList.find(city => city.cityCode === selectedId);

        if (selectedCity) {
            this.publicVariable.dataForm.patchValue({
                cityCode: selectedCity.cityCode
            });
        } else {
            this.publicVariable.dataForm.patchValue({
                cityCode: null
            });
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

            if (!this.checkGst()) return;
            const newData = this.publicVariable.dataForm.value;
            if (newData.GSTCustomerType !== 2 && newData.GSTRegistrationNo == '') {
                this.toastr.warning('GST number required!');

                return
            }
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
                gstNumber: newData.GSTRegistrationNo,
                gstCustomerType: newData.GSTCustomerType,
                pan: newData.PANNo.trim(),
                loginId: this.publicVariable.storedEmail,
                roleName: this.publicVariable.storedRole,
                CustomerRemarks: newData.CustomerRemarks.trim(),
                Department: sessionStorage.getItem('department')
            };
            this.publicVariable.isProcess = true;
            this.publicVariable.Subscription.add(
                this.API.create(newConfig).subscribe({
                    next: (res: any) => {
                        if (res.status === true) {
                            this.toastr.success(res.message, 'Success');
                            // this.router.navigate(['customer/status']);
                            this.router.navigate(['dashboard']);
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

    validateGST() {


        try {
            const gst = this.publicVariable.dataForm.get('GSTRegistrationNo')?.value;
            // if (gst.length < 15) {
            //     this.toastr.warning('Please enter Valid GST No.');
            //     return;
            // }

            if (!this.checkGst()) return;
            const subscription = this.API.ValidateGST(gst).subscribe({
                next: (response: any) => {
                    if (response.status) {
                        // GST number does not exist
                        console.log('GST number does not exist');
                        this.gstExists = false;
                        // You can update the UI to indicate that the GST number is valid
                    } else {
                        // GST number already exists
                        this.toastr.warning('GST number already exists');
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

    checkGst() {

        let PANNo = this.publicVariable.dataForm.get('PANNo')?.value.toUpperCase();
        let GSTNo = this.publicVariable.dataForm.get('GSTRegistrationNo')?.value.toUpperCase();

        if (PANNo == "" || PANNo == undefined || PANNo == null) {
            this.toastr.warning('Please Enter PAN Number');
            this.panExists = false;
            this.gstExists = false;
            return false;
        }
        else if (PANNo != "") {
            var regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (!regex.test(PANNo)) {
                this.toastr.warning("Invalid pan no");
                this.panExists = false;
                this.gstExists = false;
                return false;
            }
        }


        if (this.publicVariable.dataForm.get('GSTCustomerType')?.value != 2) {
            if (GSTNo == "") {
                this.toastr.warning('Please Enter GST Number');
                this.gstExists = false;
                this.gstExists = false;
                return false;
            }
            if (GSTNo.length != 15) {
                this.toastr.warning('GST Number must be 15 Characters.');
                this.gstExists = false;
                this.gstExists = false;
                return false;
            }
            else if (!GSTNo.includes(PANNo)) {
                this.toastr.warning("Invalid GST Number.");
                this.gstExists = false;
                this.gstExists = false;
                return false;
            }
            else if (GSTNo.length == 15) {
                let stateCode = GSTNo.substring(0, 2);
                let b = GSTNo.substring(2, 12);
                let GSTLast = GSTNo.substring(12);
                var regexNum = /[0-9]{2}$/;
                var regexGSTLast = /[0-9A-Z]{3}$/;

                if (b != PANNo) {
                    this.toastr.warning("Invalid GST Number.");
                    this.gstExists = false;
                    this.gstExists = false;
                    return false;
                }
                else if (!regexNum.test(stateCode)) {
                    this.toastr.warning("Invalid State Code in GST No.");
                    this.gstExists = false;
                    this.gstExists = false;
                    return false;
                }
                else if (!regexGSTLast.test(GSTLast)) {
                    this.toastr.warning("Last 3 Chars are invalid in GST No.");
                    this.gstExists = false;
                    this.gstExists = false;
                    return false;
                }
            }
        }

        return true;

    }

    markFormControlsAsTouched(): void {
        [
            'name',
            'address',
            'countryCode',
            'stateCode',
            'cityCode',
            'postCode',
            'GSTCustomerType',
            'email',
            'PrimaryContactNo',
            'contact',
            'CustomerRemarks',
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
