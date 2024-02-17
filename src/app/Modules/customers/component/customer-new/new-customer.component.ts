import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, CustomersService, FormBuilder, NgbModal, Router, ToastrService, Validators, alphanumericWithSpacesValidator, gstValidator, panValidator, publicVariable } from '../../Export/new-customer';
@Component({
    selector: 'app-new-customer',
    templateUrl: './new-customer.component.html',
    styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {
    publicVariable = new publicVariable();
    customerId?: number;
    data: any;


    constructor(private fb: FormBuilder,
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
            customerNo: [''],
            name: ['', [Validators.required, alphanumericWithSpacesValidator()]],
            name2: ['', alphanumericWithSpacesValidator()],
            address: ['', Validators.required,],
            address2: ['',],
            country: [null, Validators.required],
            state: [null, Validators.required],
            city: [null, Validators.required],
            postCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
            GSTRegistrationNo: ['', [Validators.required, gstValidator()]],
            GSTCustomerType: [null, Validators.required],
            email: ['', [Validators.required, Validators.email]],
            PrimaryContactNo: ['', Validators.required],
            contact: ['', Validators.required],
            PANNo: ['', [Validators.required, panValidator()]],
            isDraft: ['true']
        });
    }

    ngOnInit(): void {
        this.loadCountryList();
        this.loadGstCustomerType();

        this.route.params.subscribe(params => {
            this.customerId = +params['id'];
        });

        if (this.data = history.state.data) {
            this.onSelectState(this.data.country);
            this.onSelectCity(this.data.state);
            this.patchFormData(this.data);
        }
    }

    patchFormData(data: any): void {

        this.publicVariable.dataForm.patchValue({
            customerId: data.customerId,
            customerNo: data.customerCode,
            name: data.customerName,
            name2: data.customerLastName,
            address: data.address,
            address2: data.address,
            country: data.country.countryId,
            state: data.state.stateId,
            city: data.city.cityId,
            postCode: data.pincode,
            GSTRegistrationNo: data.gstNumber,
            GSTCustomerType: data.gstType.gstTypeId,
            email: data.email,
            PrimaryContactNo: data.phoneNumber,
            contact: data.contact,
            PANNo: data.pan,
            isDraft: data.isActive
        });

    }


    loadCountryList(): void {
        try {
            const subscription = this.API.getCountryList().subscribe({
                next: (response: any) => {
                    this.publicVariable.countryList = response.data;
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

    onSelectState(event: any) {
        const selectedCountry = event;
        const countryId = selectedCountry ? selectedCountry.countryId : null;

        try {
            const subscription = this.API.getStateList(countryId).subscribe({
                next: (response: any) => {
                    this.publicVariable.stateList = response.data;
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
    onSelectCity(event: any) {
        const selectedState = event;
        const stateId = selectedState ? selectedState.stateId : null;
        try {
            const subscription = this.API.getCityList(stateId).subscribe({
                next: (response: any) => {
                    this.publicVariable.cityList = response.data;
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

    loadGstCustomerType(): void {
        try {
            const subscription = this.API.getGstCustomerType().subscribe({
                next: (response: any) => {

                    this.publicVariable.customerTypeList = response.data;
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




    onInputChange(event: any) {
        const inputValue = event.target.value; event.target.value = inputValue.replace(/[^0-9]/g, '');
    }

    onSubmit(): void {
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
                pinCode: newData.postCode.trim(),
                email: newData.email.trim(),
                cityid: newData.city,
                isDraft: newData.isDraft,
                gstNumber: newData.GSTRegistrationNo.trim(),
                gstCustomerType: newData.GSTCustomerType,
                pan: newData.PANNo.trim()
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
        ['name', 'address', 'country', 'state', 'city', 'postCode', 'GSTRegistrationNo', 'GSTCustomerType', 'email', 'PrimaryContactNo', 'contact', 'PANNo'].forEach(controlName => {
            this.publicVariable.dataForm.controls[controlName].markAsTouched();
        });
    }

    shouldShowError(controlName: string, errorName: string): boolean {
        return this.publicVariable.dataForm.controls[controlName].touched && this.publicVariable.dataForm.controls[controlName].hasError(errorName);
    }
}
