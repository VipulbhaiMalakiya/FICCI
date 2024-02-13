import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {AppService,publicVariable,Router,ConfirmationDialogModalComponent,NgbModal, UserService, ToastrService} from '../../import/index'

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
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,

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
            this.publicVariable.userlist = response.data;
            this.publicVariable.count =  response.data.length;

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
      ID: x?.imeM_ID || '',
      "Employee ID": x?.imeM_EmpId || '',
      EmpId: x?.imeM_EmpId || '',
      Name: x?.imeM_Name || '',
      Username: x?.imeM_Username || '',
      Email:x?.imeM_Email || '',
      Active:x?.isActive || '',
      Role:x?.roleName || ''
    }));

    const headers = ['ID', 'Employee ID', 'Name', 'Email', 'Username','Active','Role'];
    this.appService.exportAsExcelFile(
      exportData,
      'Users',
      headers
    );
  }

  onDelete(id: number) {
    const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "md", centered: true, backdrop: "static" });
    var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
    componentInstance.message = "Do you really want to delete these records? This process cannot be undone ?";
    modalRef.result.then((canDelete: boolean) => {
      if (canDelete) {
        this.API.delete(id).subscribe({
          next: (res: any) => {
            this.toastr.success(res.message, 'Success');
            this.loadUserList();
          },
          error: (error) => {
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
