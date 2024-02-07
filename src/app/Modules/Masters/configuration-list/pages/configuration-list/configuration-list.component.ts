import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogModalComponent } from 'src/app/Modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import { AppService } from 'src/app/services/excel.service';
import { ConfigurationService } from '../../service/configuration.service';
import { Observable, of } from 'rxjs';
import { Category } from '../../interface/category';
declare var $: any; // Declare jQuery

interface DataTableWithButtonsSettings extends DataTables.Settings {
  buttons?: any[]; // Add buttons property to the DataTables settings
}
const DEFAULT_CATEGORY_LIST = [
  { id: 1, category_Name: 'Default Category 1' },
  { id: 2, category_Name: 'Default Category 2' },
  { id: 3, category_Name: 'Default Category 3' }
];

@Component({
  selector: 'app-configuration-list',
  templateUrl: './configuration-list.component.html',
  styleUrls: ['./configuration-list.component.css']
})
export class ConfigurationListComponent {
  data: any[] = []; // Assume your data is an array of objects
  dataForm: FormGroup;
  isPatchDataReceived: boolean = false; // Assuming patch data is initially not received
  categoryList$?: Observable<Category[]>;

  constructor(private fb: FormBuilder,
    private appService: AppService,
    private modalService: NgbModal,
    private API: ConfigurationService

  ) {
    this.dataForm = this.fb.group({
      code: ['', Validators.required],
      value: ['', Validators.required],
      category: ['', Validators.required],
      active: [false]
    });

  }



  ngOnInit() {
    this.loadCategoryList();
    // Dummy data for testing
    this.data = this.generateDummyData(1000)
    setTimeout(() => {
      const dataTableSettings: DataTableWithButtonsSettings = {
        pagingType: 'full_numbers',
        language: {
          paginate: {
            first: '<i class="la la-angle-double-left"></i>',
            previous: '<i class="la la-angle-left"></i>',
            next: '<i class="la la-angle-right"></i>',
            last: '<i class="la la-angle-double-right"></i>'
          },
          searchPlaceholder: 'Search by id...', // Add this line to set the search placeholder

        },
        pageLength: 5,
        processing: true,
        lengthMenu: [5, 10, 25],
        responsive: true,
        columnDefs: [
          { targets: [0], searchable: true, orderable: true },  // Enable searching and ordering for the name column
          { targets: [1, 2, 3, 4], searchable: false, orderable: false }, // Disable searching and ordering for the email and job_title columns
          // Add more columns as needed
        ],
      };

      $('#datatableexample').DataTable(dataTableSettings);
    }, 1);
  }




  loadCategoryList() {
    this.API.getCategoryList().subscribe({
      next: (response:any) => {
        // Handle successful response
        this.categoryList$ = of(response.data);
      },
      error: (error) => {
        // Handle error
        console.error('Error loading category list:', error);
        // Optionally, you can set a default value for categoryList$ or perform other error handling actions
        this.categoryList$ = of(DEFAULT_CATEGORY_LIST); // Assuming DEFAULT_CATEGORY_LIST is defined somewhere
      }
    });
  }




  onSubmit() {
    if (this.dataForm.valid) {
      const newData = this.dataForm.value;
      if (newData.id) {
        //update
      } else {
        //insert
      }
      //show data function
      this.dataForm.reset();
    } else {
      this.dataForm.controls['code'].markAsTouched();
      this.dataForm.controls['value'].markAsTouched();
      this.dataForm.controls['category'].markAsTouched();
    }

  }

  private generateDummyData(count: number): any[] {
    const dummyData = [];
    for (let i = 1; i <= count; i++) {
      dummyData.push({
        code: i,
        value: `User ${i}`,
        category: `category ${i}`,
        active: true
      });
    }
    return dummyData;
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
    const exportData = this.data.map((x) => {
      return {
        code: x.code || '',
        value: x.value || '',
        category: x.category || '',
        active: x.active || '',
      };
    });
    const headers = ['code', 'value', 'category', 'active'];
    this.appService.exportAsExcelFile(
      exportData,
      'Configration-list',
      headers
    );
  }

  shouldShowError(controlName: string, errorName: string) {
    return this.dataForm.controls[controlName].touched && this.dataForm.controls[controlName].hasError(errorName);
  }

}
