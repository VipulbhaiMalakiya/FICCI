import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, publicVariable, ToastrService, DEFAULT_CATEGORY_LIST, addUpdateConfiguration, alphanumericWithSpacesValidator, ConfirmationDialogModalComponent, AppService, ConfigurationService, Configuration, alphanumericValidator, toTitleCase, UtilityService } from '../../import/index'
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-configuration-list',
  templateUrl: './configuration-list.component.html',
  styleUrls: ['./configuration-list.component.css']
})
export class ConfigurationListComponent implements OnInit, OnDestroy {

  publicVariable = new publicVariable();

  dropdownOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];
  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private modalService: NgbModal,
    private API: ConfigurationService,
    private toastr: ToastrService,
    public utilityService: UtilityService,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.publicVariable.dataForm = this.fb.group({
      id: [''],
      c_Code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10), alphanumericValidator()]],
      c_Value: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20), alphanumericWithSpacesValidator()]],
      categoryID: [null, Validators.required],
      isActive: [true]
    });
  }

  ngOnDestroy() {
    if (this.publicVariable.configurationSubscription) {
      this.publicVariable.configurationSubscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.loadCategoryList();
    this.loadConfiguration();
  }

  loadCategoryList(): void {
    try {
      this.publicVariable.configurationSubscription.add(
        this.API.getCategoryList().subscribe({
          next: (response: any) => {
            this.publicVariable.categoryList = response.data.map((category: { category_Name: string }) => ({
              ...category,
              category_Name: toTitleCase(category.category_Name)
            }));
            this.cdr.detectChanges();

          },
          error: () => {
            this.publicVariable.categoryList = DEFAULT_CATEGORY_LIST;
            this.cdr.detectChanges();

          }
        })
      );
    } catch (error) {
      console.error('Error loading category list:', error);
    }
  }
  loadConfiguration(): void {
    try {
      this.publicVariable.configurationSubscription.add(
        this.API.getAll().subscribe({
          next: (response: any) => {
            this.publicVariable.data = response.data;
            this.publicVariable.count =  response.data.length;
            this.publicVariable.isProcess =false;
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
    this.publicVariable.page = event;
    this.loadConfiguration();
  }
  onTableSizeChange(event: any): void {
    this.publicVariable.tableSize = event.target.value;
    this.publicVariable.page = 1;
    this.loadConfiguration();
  }



  onSubmit(): void {
    if (this.publicVariable.dataForm.valid) {
      const newData = this.publicVariable.dataForm.value;
      const isUpdate = !!newData.id;
      this.publicVariable.isProcess =true;

      const newConfig: addUpdateConfiguration = {
        isUpdate: isUpdate,
        c_ID: isUpdate ? newData.id : undefined,
        c_Code: newData.c_Code.trim(),
        c_Value: newData.c_Value.trim(),
        categoryID: newData.categoryID,
        user: "user1".trim(),
        isactive: !!newData.isActive
      };
      const successMessage = isUpdate ? 'Data updated successfully.' : 'Data created successfully.';
      this.handleApiRequest(this.API.create(newConfig), successMessage, 'Error submitting data:');
    } else {
      this.markFormControlsAsTouched();
    }
  }
  onDelete(id: number): void {
    const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "md", centered: true, backdrop: "static" });
    const componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
    componentInstance.message = "Do you really want to delete these records? This process cannot be undone ?";

    modalRef.result
      .then((canDelete: boolean) => {
        if (canDelete) {
          this.publicVariable.isProcess =true;
          this.handleApiRequest(this.API.delete(id), 'Data deleted successfully.', 'Error deleting data:');
        }
      })
      .catch(() => { });
  }
  onEdit(data: Configuration): void {
    this.publicVariable.isEdit = true;
    const categoryId = this.findCategoryId(data.category_Name);
    this.publicVariable.dataForm.patchValue({
      c_Code: data.c_Code,
      c_Value: data.c_Value,
      categoryID: categoryId,
      isActive:  data.isActive,
      id: data.c_ID
    });
  }
  onDownload(): void {
    const exportData = this.publicVariable.data.map((x) => ({
      //ID: x?.c_ID || '',
      Code: x?.c_Code || '',
      Value: x?.c_Value || '',
      Category: x?.category_Name ? toTitleCase(x.category_Name) : '',
      isActive:  x && x.isActive ? 'Yes' : 'No'
    }));
    const headers = ['Code', 'Value', 'Category', 'isActive'];
    this.appService.exportAsExcelFile(exportData, 'Configuration-list', headers);
  }

  shouldShowError(controlName: string, errorName: string): boolean {
    return this.publicVariable.dataForm.controls[controlName].touched && this.publicVariable.dataForm.controls[controlName].hasError(errorName);
  }
  findCategoryId(categoryName: string): number | undefined {
    const trimmedCategoryName = categoryName.trim().toLowerCase(); // Normalize category name
    const category = this.publicVariable.categoryList.find(cat => cat.category_Name.toLowerCase() === trimmedCategoryName);
    return category ? category.id : undefined;
  }
  handleApiResponse(res: any, successMessage: string): void {
    if (res.status === true) {
      this.toastr.success(successMessage, 'Success');
      this.loadConfiguration();
      this.publicVariable.isProcess =false;

      this.publicVariable.dataForm.reset();
    } else {
      this.toastr.error(res.message, 'Error');
      this.publicVariable.isProcess =false;

    }
  }
  markFormControlsAsTouched(): void {
    ['c_Code', 'c_Value', 'categoryID'].forEach(controlName => {
      this.publicVariable.dataForm.controls[controlName].markAsTouched();
    });
  }
  handleApiRequest(apiRequest: any, successMessage: string, errorMessagePrefix: string): void {
    try {
      this.publicVariable.configurationSubscription.add(
        apiRequest.subscribe({
          next: (res: any) => {
            this.handleApiResponse(res, successMessage);
          },
          error: (error: any) => {
            console.error(errorMessagePrefix, error);
            this.toastr.error(error.error.message || 'An error occurred. Please try again later.', 'Error');
          }
        })
      );
    } catch (error) {
      this.toastr.error('Error handling API request', 'Error');
    }
  }

}
