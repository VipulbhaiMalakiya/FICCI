import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogModalComponent } from 'src/app/Modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import { AppService } from 'src/app/services/excel.service';
import { ConfigurationService } from '../../service/configuration.service';
import { Category } from '../../interface/category';
import { Configuration, addUpdateConfiguration } from '../../interface/configuration';
import { ToastrService } from 'ngx-toastr';
import { alphanumericValidator } from '../../Validation/alphanumericValidator';
import { alphanumericWithSpacesValidator } from '../../Validation/alphanumericWithSpacesValidator ';
import { toTitleCase } from 'src/app/Helper/toTitleCase';
import { Subscription } from 'rxjs';


const DEFAULT_CATEGORY_LIST: Category[] = [
  { id: 1, category_Name: 'CUSTOMER TYPE' },
  { id: 2, category_Name: 'USER ROLE' },
  { id: 3, category_Name: 'MAIL TEMPLATE' },
  { id: 4, category_Name: 'INVOICE TYPE' }
];

@Component({
  selector: 'app-configuration-list',
  templateUrl: './configuration-list.component.html',
  styleUrls: ['./configuration-list.component.css']
})
export class ConfigurationListComponent implements OnInit , OnDestroy  {
  dataForm: FormGroup;
  isEdit: boolean = false; // Assuming patch data is initially not received
  categoryList: Category[] = [];
  data: Configuration[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: number[] = [10, 20, 50, 100]; // You can adjust these values as needed
  searchText: string = '';
  configurationSubscription: Subscription = new Subscription(); // Initialize here

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private modalService: NgbModal,
    private API: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.dataForm = this.fb.group({
      id: [''],
      c_Code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10), alphanumericValidator()]],
      c_Value: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20), alphanumericWithSpacesValidator()]],
      categoryID: [null, Validators.required],
      isActive: [false]
    });
  }

  ngOnDestroy() {
    if (this.configurationSubscription) {
      this.configurationSubscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.loadCategoryList();
    this.loadConfiguration();
  }

  loadCategoryList(): void {
    try {
      this.configurationSubscription.add(
        this.API.getCategoryList().subscribe({
          next: (response: any) => {
            this.categoryList = response.data.map((category: { category_Name: string }) => ({
              ...category,
              category_Name: toTitleCase(category.category_Name)
            }));
          },
          error: () => {
            this.categoryList = DEFAULT_CATEGORY_LIST;
          }
        })
      );
    } catch (error) {
      console.error('Error loading category list:', error);
    }
  }




  loadConfiguration(): void {
    try {
      this.configurationSubscription.add(
        this.API.getAll().subscribe({
          next: (response: any) => {
            this.data = response.data;
          },
          error: () => {
            // Handle error
          }
        })
      );
    } catch (error) {
      console.error('Error loading configuration:', error);
    }
  }


  onTableDataChange(event: any) {
    this.page = event;
    this.loadConfiguration();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.loadConfiguration();
  }

  onSubmit(): void {
    if (this.dataForm.valid) {
      const newData = this.dataForm.value;
      const isUpdate = !!newData.id;
      const newConfig: addUpdateConfiguration = {
        isUpdate: isUpdate,
        c_ID: isUpdate ? newData.id : undefined,
        c_Code: newData.c_Code.trim(),
        c_Value: newData.c_Value.trim(),
        categoryID: newData.categoryID,
        user: "user1",
        isactive: !!newData.isActive
      };
      const successMessage = isUpdate ? 'Data updated successfully.' : 'Data created successfully.';
      this.configurationSubscription.add(
        this.API.create(newConfig).subscribe({
          next: (res: any) => {
            this.handleApiResponse(res, successMessage);
          },
          error: (error) => {
            this.toastr.error(error.error.message || 'An error occurred. Please try again later.', 'Error');
          }
        })
      );
    } else {
      this.markFormControlsAsTouched();
    }
  }

  onDelete(id: number): void {
    const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
    const componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
    componentInstance.message = "Are you sure you want to delete this ?";
    modalRef.result.then((canDelete: boolean) => {
      if (canDelete) {
        this.configurationSubscription.add(
          this.API.delete(id).subscribe({
            next: (res: any) => {
              this.handleApiResponse(res, 'Data deleted successfully.');
            },
            error: (error) => {
              this.toastr.error(error.error.message, 'Error');
            }
          })
        );
      }
    }).catch(() => { });
  }


  onEdit(data: Configuration): void {
    this.isEdit = true;
    const categoryId = this.findCategoryId(data.category_Name);
    const isActiveValue = data.isActive.toLowerCase() === 'yes';
    this.dataForm.patchValue({
      c_Code: data.c_Code,
      c_Value: data.c_Value,
      categoryID: categoryId,
      isActive: isActiveValue,
      id: data.c_ID
    });
  }
  onDownload(): void {
    const exportData = this.data.map((x) => ({
      ID: x?.c_ID || '',
      Code: x?.c_Code || '',
      Value: x?.c_Value || '',
      Category: x?.category_Name ? toTitleCase(x.category_Name) : '',
      isActive: x?.isActive || ''
    }));

    const headers = ['ID', 'Code', 'Value', 'Category', 'isActive'];

    this.appService.exportAsExcelFile(
      exportData,
      'Configuration-list',
      headers
    );
  }

  shouldShowError(controlName: string, errorName: string): boolean {
    return this.dataForm.controls[controlName].touched && this.dataForm.controls[controlName].hasError(errorName);
  }
  findCategoryId(categoryName: string): number | undefined {
    const trimmedCategoryName = categoryName.trim().toLowerCase(); // Normalize category name
    const category = this.categoryList.find(cat => cat.category_Name.toLowerCase() === trimmedCategoryName);
    return category ? category.id : undefined;
  }
  handleApiResponse(res: any, successMessage: string): void {
    if (res.status === true) {
      this.toastr.success(successMessage, 'Success');
      this.loadConfiguration();
      this.dataForm.reset();
    } else {
      this.toastr.error(res.message, 'Error');
    }
  }
  markFormControlsAsTouched(): void {
    ['c_Code', 'c_Value', 'categoryID'].forEach(controlName => {
      this.dataForm.controls[controlName].markAsTouched();
    });
  }

}
