import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {AppService,publicVariable,Router,ConfirmationDialogModalComponent,NgbModal, UserService} from '../../import/index'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
  publicVariable = new publicVariable();



  constructor(    private appService: AppService,
    private modalService: NgbModal,
    private router: Router,
    private API: UserService,
    private cdr: ChangeDetectorRef
    ){

  }
  ngOnInit(): void {
    this.loadUserList();
  }

  loadUserList(): void {
    try {
      this.publicVariable.Subscription.add(
        this.API.getUsers().subscribe({
          next: (response: any) => {
            this.publicVariable.userlist = response.data
            this.cdr.detectChanges();
          },
          error: () => {
            this.cdr.detectChanges();
          }
        })
      );
    } catch (error) {
      console.error('Error loading category list:', error);
    }
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
      // ID: x?.id || '',
      // "Employee ID": x?.employeeId || '',
      // Name: x?.name || '',
      // Role: x?.role || '',
      // Email: x?.email || '',
      // Active:x?.active || ''
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
    this.router.navigate(['masters/users/edit', user.id], { state: { data: user } });

  }

}
