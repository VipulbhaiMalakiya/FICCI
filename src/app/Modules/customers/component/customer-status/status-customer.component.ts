import { Component } from '@angular/core';
import{AppService, ConfirmationDialogModalComponent, NgbModal, Router, ToastrService, publicVariable} from '../../Export/new-customer'
@Component({
  selector: 'app-status-customer',
  templateUrl: './status-customer.component.html',
  styleUrls: ['./status-customer.component.css']
})
export class StatusCustomerComponent {
  publicVariable = new publicVariable();


  constructor(private appService: AppService,
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,

  ) {

  }


  onDelete(id: number) {
    const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
    var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
    componentInstance.message = "Do you really want to delete these records? This process cannot be undone ?";
    modalRef.result.then((canDelete: boolean) => {
      if (canDelete) {
        this.publicVariable.isProcess = true;
        // this.API.delete(id).subscribe({
        //   next: (res: any) => {
        //     this.toastr.success(res.message, 'Success');
        //     this.publicVariable.isProcess = false;
        //     this.loadUserList();
        //   },
        //   error: (error) => {
        //     this.publicVariable.isProcess = false;
        //     this.toastr.error(error.error.message, 'Error');
        //   }
        // });

      }
    }).catch(() => { });

  }
  onDownload() {
    // const exportData = this.publicVariable.userlist.map((x) => ({
    //   "Cust. No.": x?.imeM_EmpId || '',
    //   Name: x?.imeM_Name || '',
    //   Address: x?.imeM_Username || '',
    //   City: x?.imeM_Email || '',
    //   Contact: x && x.isActive ? 'Yes' : 'No',
    //   Email: x?.roleName || ''
    // }));

    // const headers = ['Cust. No.','Name', 'Address', 'City','Contact', 'Email'];
    // this.appService.exportAsExcelFile(exportData,'Customer Status',headers);
  }
  onTableDataChange(event: any) {
    this.publicVariable.page = event;
    // this.publicVariable.userlist
  }
  onTableSizeChange(event: any): void {
    this.publicVariable.tableSize = event.target.value;
    this.publicVariable.page = 1;
    // this.publicVariable.userlist

  }
}
