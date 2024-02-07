import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogModalComponent } from 'src/app/Modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import { AppService } from 'src/app/services/excel.service';
import { ConfigurationService } from '../../service/configuration.service';
import { Observable, of } from 'rxjs';
import { Category } from '../../interface/category';
import { Configuration, addUpdateConfiguration } from '../../interface/configuration';
import { ToastrService } from 'ngx-toastr';


const DEFAULT_CATEGORY_LIST = [
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
export class ConfigurationListComponent {
  // Assume your data is an array of objects
  dataForm: FormGroup;
  isPatchDataReceived: boolean = false; // Assuming patch data is initially not received
  categoryList$?: Observable<Category[]>;
  data: Configuration[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 2;
  tableSizes: number[] = [2, 5, 10, 20]; // You can adjust these values as needed
  constructor(private fb: FormBuilder,
    private appService: AppService,
    private modalService: NgbModal,
    private API: ConfigurationService,
    private toastr: ToastrService

  ) {
    this.dataForm = this.fb.group({
      c_Code: ['', Validators.required],
      c_Value: ['', Validators.required],
      categoryID: ['', Validators.required],
      isactive: [false]
    });

  }



  ngOnInit() {
    this.loadCategoryList();
    this.loadConfiguration();
  }

  loadCategoryList() {
    this.API.getCategoryList().subscribe({
      next: (response: any) => {
        this.categoryList$ = of(response.data);
      },
      error: (error) => {
        this.categoryList$ = of(DEFAULT_CATEGORY_LIST); // Assuming DEFAULT_CATEGORY_LIST is defined somewhere
      }
    });
  }


  loadConfiguration() {
    this.API.getAll().subscribe({
      next: (response: any) => {
        this.data = response.data;
      },
      error: (error) => {
      }
    });
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

  onSubmit() {
    if (this.dataForm.valid) {

      const newData = this.dataForm.value;

      if (newData.id) {
        //update
      } else {
        //insert

        const newConfig: addUpdateConfiguration = {
          isUpdate: false,
          c_Code: newData.c_Code,
          c_Value: newData.c_Value,
          categoryID: newData.categoryID,
          user: "user1",
          isactive: newData.isactive
        };

        this.API.create(newConfig).subscribe({
          next: (res: any) => {
            this.toastr.success(res.message, 'Success');
            this.loadConfiguration();
          },
          error: (error) => {
            this.toastr.error(error, 'Error');

          }
        });
      }
      //show data function
      this.dataForm.reset();
    } else {
      this.dataForm.controls['c_Code'].markAsTouched();
    this.dataForm.controls['c_Value'].markAsTouched();
    this.dataForm.controls['categoryID'].markAsTouched();
    }

  }





  onDelete(id: number) {
    const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });


    var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
    componentInstance.message = "Are you sure you want to delete this ?";
    modalRef.result.then((canDelete: boolean) => {
      if (canDelete) {

      }
    }).catch(() => { });

  }

  onEdit(data: any) {
    this.isPatchDataReceived = true;
    this.dataForm.patchValue({
      code: data.code,
      value: data.value,
      category: data.category,
      active: data.active
    });
  }

  onDownload() {
    const exportData = this.data.map((x) => ({
      ID: x?.c_ID || '',
      Code: x?.c_Code || '',
      Value: x?.c_Value || '',
      Category: x?.category_Name || '',
      isActive: x?.isActive || ''
    }));

    const headers = ['ID', 'Code', 'Value', 'Category', 'isActive'];
    this.appService.exportAsExcelFile(
      exportData,
      'Configuration-list',
      headers
    );
  }


  shouldShowError(controlName: string, errorName: string) {
    return this.dataForm.controls[controlName].touched && this.dataForm.controls[controlName].hasError(errorName);
  }

}
