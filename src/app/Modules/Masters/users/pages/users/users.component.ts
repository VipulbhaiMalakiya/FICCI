import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogModalComponent } from 'src/app/Modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import { AppService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{

  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: number[] = [10,20,50,100]; // You can adjust these values as needed
  searchText: string = '';

  constructor(    private appService: AppService,
    private modalService: NgbModal,
    private router: Router,
    ){

  }
  data = [
    { id: 1,employeeId: 1, userName: 'user1', name: 'John Doe', role: 'Employee', email: 'john@example.com', active: 'Yes' },
  ];
  ngOnInit(): void {
    this.addDummyRecords();
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.data;
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.data;

  }
  addDummyRecords() {
    for (let i = 2; i <= 21; i++) {
      this.data.push({
        id: i,
        employeeId: i,
        userName: 'user' + i,
        name: 'Dummy User ' + (i - 1),
        role: 'Employee',
        email: 'user' + i + '@example.com',
        active: Math.random() < 0.5 ? 'Yes' : 'No'
      });
    }
  }

  onDownload() {
    const exportData = this.data.map((x) => ({
      ID: x?.id || '',
      "Employee ID": x?.employeeId || '',
      Name: x?.name || '',
      Role: x?.role || '',
      Email: x?.email || '',
      Active:x?.active || ''
    }));

    const headers = ['ID', 'Employee ID', 'Name', 'Role', 'Email','Active'];
    this.appService.exportAsExcelFile(
      exportData,
      'Users',
      headers
    );
  }

  onDelete(id: number) {
    const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
    var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
    componentInstance.message = "Are you sure you want to delete this ?";
    modalRef.result.then((canDelete: boolean) => {
      if (canDelete) {
        // this.API.delete(id).subscribe({
        //   next: (res: any) => {
        //     this.toastr.success(res.message, 'Success');
        //     this.loadConfiguration();
        //   },
        //   error: (error) => {
        //     this.toastr.error(error.error.message, 'Error');
        //   }
        // });

      }
    }).catch(() => { });

  }

  onEdit(user: any): void {
    // Assuming user has an 'id' property
    // this.router.navigate(['masters/users/edit', { id: user.id, data: user }]);
    this.router.navigate(['masters/users/edit', user.id], { state: { data: user } });

  }

}
