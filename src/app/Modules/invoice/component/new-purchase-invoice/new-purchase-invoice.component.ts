import { Component, OnInit } from '@angular/core';
import { AppService, FormBuilder, NgbModal, Router, ToastrService, Validators, gstValidator, panValidator, publicVariable } from '../../Export/invoce';
import { FormArray } from '@angular/forms';
import { InvoicesService } from '../../service/invoices.service';


@Component({
  selector: 'app-new-purchase-invoice',
  templateUrl: './new-purchase-invoice.component.html',
  styleUrls: ['./new-purchase-invoice.component.css']
})
export class NewPurchaseInvoiceComponent implements OnInit {

  publicVariable = new publicVariable();
  items: any[] = [
    { name: 'I phone 15 Pro Max', unit: '100', discount: '10', rate: '150000', amount: 0 }
  ];

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
      ImpiHeaderCustomerCode:[''] , //new filed
      ImpiHeaderCustomerAddress: ['', [Validators.required]],
      ImpiHeaderCustomerState: ['', [Validators.required]],
      ImpiHeaderCustomerCity: ['', [Validators.required]],
      ImpiHeaderCustomerPinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      ImpiHeaderCustomerGstNo: ['', [Validators.required, gstValidator()]],
      ImpiHeaderCustomerContactPerson: ['', [Validators.required]],
      ImpiHeaderCustomerEmailId: ['', [Validators.required, Validators.email]],
      ImpiHeaderCustomerPhoneNo: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      ImpiHeaderCreatedBy :[''],
      ImpiHeaderTotalInvoiceAmount:[],
       //api new filed
      items: this.fb.array([]),
      file: [''],
      ImpiHeaderPaymentTerms: [],
      ImpiHeaderRemarks: [],
      IsDraft:[false]
    });
    // Initialize items form array
    this.items.forEach(item => this.addItem(item));
  }

  ngOnInit(): void {
    this.loadProjectList()

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
    item = item || { name: '', unit: '', discount: '', rate: '', amount: 0 };
    this.itemsFormArray.push(this.fb.group({
      name: [item.name, Validators.required],
      unit: [item.unit, Validators.required],
      discount: [item.discount, [Validators.required, Validators.min(0), Validators.max(100)]],
      rate: [item.rate, Validators.required],
      amount: [this.calculateAmount(item), Validators.required]
    }));
  }

  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
  }

  calculateAmount(item: any): number {
    const unit = parseFloat(item.unit) || 0;
    const discount = parseFloat(item.discount) || 0;
    const rate = parseFloat(item.rate) || 0;
    const amount = unit * rate * (1 - discount / 100);
    return isNaN(amount) ? 0 : amount;
  }

  calculateTotalAmount(): number {
    let total = 0;
    this.itemsFormArray.controls.forEach(control => {
      total += this.calculateAmount(control.value);
    });
    return total;
  }

  onSubmit(): void {
    if (this.publicVariable.dataForm.valid) {
      const newData = this.publicVariable.dataForm.value;
      const isupdate = !!newData.headerid;
      const newConfig: any = {
        isupdate: isupdate,
        headerid: isupdate ? newData.headerid : undefined,
        ImpiHeaderInvoiceType: newData.ImpiHeaderInvoiceType,
        ImpiHeaderProjectCode: newData.ImpiHeaderProjectCode,
        ImpiHeaderDepartment: newData.ImpiHeaderDepartment,
        ImpiHeaderDivison: newData.ImpiHeaderDivison,
        ImpiHeaderPanNo: newData.ImpiHeaderPanNo,
        ImpiHeaderGstNo: newData.ImpiHeaderGstNo,
        PINO: newData.PINO,
        ImpiHeaderCustomerName: newData.ImpiHeaderCustomerName,
        ImpiHeaderCustomerAddress: newData.ImpiHeaderCustomerAddress,
        ImpiHeaderCustomerState: newData.ImpiHeaderCustomerState,
        ImpiHeaderCustomerCity: newData.ImpiHeaderCustomerCity,
        ImpiHeaderCustomerPinCode: newData.ImpiHeaderCustomerPinCode,
        ImpiHeaderCustomerGstNo: newData.ImpiHeaderCustomerGstNo,
        ImpiHeaderCustomerContactPerson: newData.ImpiHeaderCustomerContactPerson,
        ImpiHeaderCustomerEmailId: newData.ImpiHeaderCustomerEmailId,
        ImpiHeaderCustomerPhoneNo: newData.ImpiHeaderCustomerPhoneNo,
        lineItem_Requests: newData.items,
        ImpiHeaderAttachment: newData.file,
        ImpiHeaderPaymentTerms: newData.ImpiHeaderPaymentTerms,
        ImpiHeaderRemarks: newData.ImpiHeaderRemarks,
        IsDraft:newData.IsDraft
      };
      // Check if ImpiHeaderInvoiceType is Tax Invoice, then include PINO
      if (newData.ImpiHeaderInvoiceType === 'Tax Invoice') {
        newConfig.PINO = newData.PINO;
      }

      console.log(newConfig);

      // const successMessage = isupdate ? 'Data updated successfully.' : 'Data created successfully.';
      // this.handleApiRequest(this.API.create(newConfig), successMessage, 'Error submitting data:');
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
