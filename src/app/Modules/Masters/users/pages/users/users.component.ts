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
    filteredUserList: any[] = [];

    constructor(private appService: AppService,
        private modalService: NgbModal,
        private router: Router,
        private API: UserService,
        private toastr: ToastrService,
        private cd: ChangeDetectorRef

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
        const subscription = this.API.getUsers()
            .pipe(
                timeout(120000),
                finalize(() => {
                    this.publicVariable.isProcess = false;
                })
            )
            .subscribe({
                next: (response: any) => {
                    this.publicVariable.userlist = response.data;
                    this.publicVariable.count = response.data.length;
                    this.updateFilteredUserList();
                },
                error: (error: any) => {
                    this.toastr.error(
                        error.name === 'TimeoutError' ?
                            'Operation timed out after 40 seconds' : 'Error loading user list',
                        error.name
                    );
                }
            });

        this.publicVariable.Subscription.add(subscription);
    }
    updateFilteredUserList(): void {
        const searchText = this.publicVariable.searchText.toLowerCase();
        const filteredData = this.publicVariable.userlist.filter(user => {
            const nameMatch = user.imeM_Name.toLowerCase().includes(searchText);
            const departmentMatch = user.department ? user.department.toLowerCase().includes(searchText) : false;
            const roleMatch = user.roleName.toLowerCase().includes(searchText);

            // Check if departmentName is an array before joining and searching
            const departmentNamesMatch = Array.isArray(user.departmentName)
                ? user.departmentName.join(', ').toLowerCase().includes(searchText)
                : false;

            return nameMatch || departmentMatch || departmentNamesMatch || roleMatch;
        });

        // Set the total count for filtered items
        this.publicVariable.count = filteredData.length;

        // Apply pagination
        const startIndex = (this.publicVariable.page - 1) * this.publicVariable.tableSize;
        const endIndex = startIndex + this.publicVariable.tableSize;
        this.filteredUserList = filteredData.slice(startIndex, endIndex);

        this.cd.detectChanges(); // Trigger change detection manually
    }

    onTableDataChange(event: any) {
        this.publicVariable.page = event;
        this.updateFilteredUserList();

    }
    onTableSizeChange(event: any): void {
        this.publicVariable.tableSize = Number(event.target.value);
        this.publicVariable.page = 1; // Reset to first page
        this.updateFilteredUserList();

    }

    toTitleCase(str: string): string {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    onDownload() {
        const exportData = this.publicVariable.userlist.map((x) => ({
            "Employee ID	": x?.imeM_EmpId || '',
            Name: x?.imeM_Name ? this.toTitleCase(x.imeM_Name) : '',
            Username: x?.imeM_Username ? this.toTitleCase(x.imeM_Username) : '',
            Department: x?.department ? this.toTitleCase(x.department) : '',
            "Nav Department": Array.isArray(x?.departmentName) ? x.departmentName.join(', ') : '',
            Email: x?.imeM_Email ? this.toTitleCase(x.imeM_Email) : '',
            Active: x && x.isActive ? 'Yes' : 'No',
            Role: x?.roleName ? this.toTitleCase(x.roleName) : ''
        }));

        const headers = ['Employee ID	', 'Name', 'Email', 'Username', 'Department', 'Nav Department', 'Role', 'Active'];
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

    calculateIndex(page: number, index: number): number {
        return (page - 1) * this.publicVariable.tableSize + index + 1;
    }

    onEdit(user: any): void {
        if (user.imeM_ID) {
            const encryptedHeaderId = btoa(user.imeM_ID.toString());

            this.router.navigate(['masters/users/edit', encryptedHeaderId], { state: { data: user } });
        } else {
            console.error('User ID is undefined or null');
        }
    }

}
