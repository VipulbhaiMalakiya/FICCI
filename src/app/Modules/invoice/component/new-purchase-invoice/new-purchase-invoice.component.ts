import { Component, OnInit } from '@angular/core';
import { AppService, FormBuilder, InvoicesService, NgbModal, Router, ToastrService, Validators, gstValidator, panValidator, publicVariable } from '../../Export/invoce';
import { FormArray } from '@angular/forms';


@Component({
  selector: 'app-new-purchase-invoice',
  templateUrl: './new-purchase-invoice.component.html',
  styleUrls: ['./new-purchase-invoice.component.css']
})
export class NewPurchaseInvoiceComponent implements OnInit {

  publicVariable = new publicVariable();
  items: any[] = [
    { impiLineDescription: 'I phone 15 Pro Max', impiLineQuantity: '100', impiLineDiscount: '10', impiLineUnitPrice: '150000', calculateAmount: 0 }
  ];
  ImpiHeaderAttachment: any;

  constructor(private appService: AppService,
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private API: InvoicesService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.publicVariable.dataForm = this.fb.group({
      headerid: [''],
      ImpiHeaderInvoiceType: ['Proforma Invoice', Validators.required],
      ImpiHeaderProjectCode: [null, [Validators.required]],
      ImpiHeaderDepartment: ['', [Validators.required]],
      ImpiHeaderDivison: ['', [Validators.required]],
      ImpiHeaderPanNo: ['', [Validators.required, panValidator()]], // Use the custom validator function
      ImpiHeaderGstNo: ['', [Validators.required, gstValidator()]],
      PINO: [''], //api missing
      ImpiHeaderCustomerName: ['', [Validators.required]],
      ImpiHeaderCustomerCode: [''], //new filed
      ImpiHeaderCustomerAddress: ['', [Validators.required]],
      ImpiHeaderCustomerState: ['', [Validators.required]],
      ImpiHeaderCustomerCity: ['', [Validators.required]],
      ImpiHeaderCustomerPinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      ImpiHeaderCustomerGstNo: ['', [Validators.required, gstValidator()]],
      ImpiHeaderCustomerContactPerson: ['', [Validators.required]],
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
    this.publicVariable.isProcess = false;
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
    item = item || { impiLineDescription: '', impiLineQuantity: '', impiLineDiscount: '', impiLineUnitPrice: '', amount: 0 };
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


  onSubmit(): void {

    if (this.publicVariable.dataForm.valid) {
      const newData = this.publicVariable.dataForm.value;
      const isUpdate = !!newData.headerid;
      const formData = new FormData();
      formData.append('ImpiHeaderAttachment', this.ImpiHeaderAttachment);
      formData.append('isupdate', String(isUpdate));
      formData.append('ImpiHeaderInvoiceType', newData.ImpiHeaderInvoiceType);
      formData.append('ImpiHeaderProjectCode', newData.ImpiHeaderProjectCode);
      formData.append('ImpiHeaderDepartment', newData.ImpiHeaderDepartment);
      formData.append('ImpiHeaderDivison', newData.ImpiHeaderDivison);
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
      formData.append('lineItem_Requests', newData.items);
      formData.append('ImpiHeaderPaymentTerms', newData.ImpiHeaderPaymentTerms);
      formData.append('ImpiHeaderRemarks', newData.ImpiHeaderRemarks);
      formData.append('IsDraft', newData.IsDraft);
      formData.append('ImpiHeaderTotalInvoiceAmount', String(this.calculateTotalAmount()));
      formData.append('ImpiHeaderCustomerCode', 'dummy');
      formData.append('ImpiHeaderCreatedBy', 'dummy');

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
