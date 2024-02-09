import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../service/user.service';
import { ConfirmationDialogModalComponent } from 'src/app/Modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';

const DEFAULT_ROLE_LIST = [
  { id: 1, role_Name: 'Employee' },
  { id: 2, role_Name: 'Approver' },
  { id: 3, role_Name: 'Accounts' },
  { id: 4, role_Name: 'Admin' }
];

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  dataForm: FormGroup;
  isedite: boolean = false; // Assuming patch data is initially not received
  selectedEmployee: any;
  roles: any[] = [];
  employees = [
    { id: 1, username: 'john_doe', name: 'John Doe', email: 'john@example.com' },
    { id: 2, username: 'jane_smith', name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, username: 'alice_johnson', name: 'Alice Johnson', email: 'alice@example.com' },
    // Add more employees as needed
  ];

  users = [
    { id: 1,employeeId: 1, userName: 'user1', name: 'John Doe', role: 'Employee', email: 'john@example.com', active: 'Yes' },
  ];



  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private API: UserService,

  ) {
    this.dataForm = this.fb.group({
      id: [''],
      employeeId: ['', Validators.required],
      role: ['', Validators.required],
      username: [{ value: '', disabled: true }, Validators.required],
      name: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      isActive: [false] // Assuming default value is true
    });
  }

  ngOnInit(): void {
    this.getRoles();
  }

  // Method to fetch roles
  getRoles() {
    this.API.getRoles().subscribe(
      data => {
        this.roles = data;
      },
      error => {
        this.roles = DEFAULT_ROLE_LIST; // Assuming DEFAULT_ROLE_LIST is defined somewhere
      }
    );
  }

  onSelectEmployee() {
    const selectedId = this.dataForm.get('employeeId')?.value;

    // Check if a valid employee is selected
    if (selectedId) {
      this.selectedEmployee = this.employees.find(employee => employee.id == selectedId);
      // Assign selected employee's properties to form controls
      if (this.selectedEmployee) {
        this.dataForm.patchValue({
          username: this.selectedEmployee.username,
          name: this.selectedEmployee.name,
          email: this.selectedEmployee.email
        });
      }
    } else {
      // Clear form values if no employee is selected
      this.dataForm.patchValue({
        username: null,
        name: null,
        email: null
      });
    }
  }

  findRoleId(roleName: string): number | undefined {
    const category =this.roles.find(role => role.role_Name === roleName);
    return category ? category.id : undefined;
  }

  onEdit(data: any) {
    this.isedite = true;
    const isActiveValue = data.active.toLowerCase() === 'yes' ? true : false;
    const roleId = this.findRoleId(data.role);

    this.dataForm.patchValue({
      employeeId: data.employeeId,
      username:data.userName,
      name:data.name,
      email:data.email,
      role:roleId,
      isActive:isActiveValue,
      id:data.id
    });
  }

  onDelete(id: number) {
    this.dataForm.reset();
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


  onSubmit() {
    if (this.dataForm.valid) {
      const newData = this.dataForm.value;
      console.log(newData);

      const isUpdate = !!newData.id;
      // const newConfig: addUpdateConfiguration = {
      //   isUpdate: isUpdate,
      //   c_ID: isUpdate ? newData.id : undefined,
      //   c_Code: newData.c_Code,
      //   c_Value: newData.c_Value,
      //   categoryID: newData.categoryID,
      //   user: "user1",
      //   isactive: !!newData.isActive
      // };
      const successMessage = isUpdate ? 'Data updated successfully.' : 'Data created successfully.';
      // this.API.create(newConfig).subscribe({
      //   next: (res: any) => {
      //     this.toastr.success(successMessage || res.message , 'Success');
      //     this.loadConfiguration();
      //     this.dataForm.reset();
      //   },
      //   error: (error) => {
      //     this.toastr.error(error.error.message || 'An error occurred. Please try again later.', 'Error');
      //   }
      // });
    } else {
      ['employeeId', 'username', 'name', 'email', 'role'].forEach(controlName => {
        this.dataForm.controls[controlName].markAsTouched();
      });
    }

  }

  shouldShowError(controlName: string, errorName: string) {
    return this.dataForm.controls[controlName].touched && this.dataForm.controls[controlName].hasError(errorName);
  }
}
