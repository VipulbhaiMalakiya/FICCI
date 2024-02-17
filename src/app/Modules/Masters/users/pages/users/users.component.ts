import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AppService, publicVariable, Router, ConfirmationDialogModalComponent, NgbModal, UserService, ToastrService } from '../../import/index'
import { finalize, timeout } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  publicVariable = new publicVariable();
  constructor(private appService: AppService,
    private modalService: NgbModal,
    private router: Router,
    private API: UserService,
    private toastr: ToastrService,

  ) {

  }
  ngOnInit(): void {
    this.loadUserList();
  }

  ngOnDestroy() {
    if (this.publicVariable.Subscription) {
      this.publicVariable.Subscription.unsubscribe();
    }
  }

  loadUserList(): void {
    const subscription = this.API.getUsers().pipe(
      timeout(120000), // Timeout set to 2 minutes (120000 milliseconds)
      finalize(() => {
        this.publicVariable.isProcess = false;
      })
    ).subscribe({
      next: (response: any) => {
        this.publicVariable.userlist = response.data;
        this.publicVariable.count = response.data.length;
      },
      error: (error: any) => {
        if (error.name === 'TimeoutError') {
          this.toastr.error('Operation timed out after 40 seconds', error.name);
        } else {
          this.toastr.error('Error loading user list', error.name);
        }
      }
    });

    this.publicVariable.Subscription.add(subscription);
  }

  onTableDataChange(event: any) {
    this.publicVariable.page = event;
    this.publicVariable.userlist
  }
  onTableSizeChange(event: any): void {
    this.publicVariable.tableSize = event.target.value;
    this.publicVariable.page = 1;
    this.publicVariable.userlist

  }

  onDownload() {
    const exportData = this.publicVariable.userlist.map((x) => ({
      "Employee ID	": x?.imeM_EmpId || '',
      Name: x?.imeM_Name || '',
      Username: x?.imeM_Username || '',
      Email: x?.imeM_Email || '',
      Active: x && x.isActive ? 'Yes' : 'No',
      Role: x?.roleName || ''
    }));

    const headers = ['Employee ID	', 'Name', 'Email', 'Username','Role', 'Active'];
    this.appService.exportAsExcelFile(
      exportData,
      'Users',
      headers
    );
  }

  onDelete(id: number) {
    const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
    var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
    componentInstance.message = "Do you really want to delete these records? This process cannot be undone ?";
    modalRef.result.then((canDelete: boolean) => {
      if (canDelete) {
        this.publicVariable.isProcess = true;
        this.API.delete(id).subscribe({
          next: (res: any) => {
            this.toastr.success(res.message, 'Success');
            this.publicVariable.isProcess = false;
            this.loadUserList();
          },
          error: (error) => {
            this.publicVariable.isProcess = false;
            this.toastr.error(error.error.message, 'Error');
          }
        });

      }
    }).catch(() => { });

  }

  onEdit(user: any): void {
    if (user.imeM_ID) {
      this.router.navigate(['masters/users/edit', user.imeM_ID], { state: { data: user } });
    } else {
      console.error('User ID is undefined or null');
    }
  }

}
