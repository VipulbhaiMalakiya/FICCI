import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../service/user.service';
import { ConfirmationDialogModalComponent } from 'src/app/Modules/shared/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import { Roles } from '../../interface/role';
import { ActivatedRoute } from '@angular/router';

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
  roles: Roles[] = [];
  userData:any;

  employees = [
    { id: 1, username: 'john_doe', name: 'John Doe', email: 'john@example.com' },
    { id: 2, username: 'jane_smith', name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, username: 'alice_johnson', name: 'Alice Johnson', email: 'alice@example.com' },
    // Add more employees as needed
  ];


  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private API: UserService,

  ) {
    this.dataForm = this.fb.group({
      id: [''],
      employeeId: [null, Validators.required],
      role: [, Validators.required],
      username: [{ value: '', disabled: true }, Validators.required],
      name: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      isActive: [false] // Assuming default value is true
    });
  }

  ngOnInit(): void {
    this.getRoles();
    this.patchFormWithData();
  }

  patchFormWithData(): void {
     this.userData = history.state.data; // Assuming history.state.data contains user data

    if (this.userData) {
      this.onEdit(this.userData);
    }

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
    const trimmedRoleName = roleName.trim().toLowerCase(); // Normalize role name
    const role = DEFAULT_ROLE_LIST.find(role => role.role_Name.toLowerCase() === trimmedRoleName);
    return role ? role.id : undefined;
  }

  onEdit(data: any) {
    this.isedite = true;
    const isActiveValue = data.active.toLowerCase() === 'yes' ? true : false;
    const roleId = this.findRoleId(data.role);
    this.dataForm.patchValue({
      employeeId: data.employeeId,
      username: data.userName,
      name: data.name,
      email: data.email,
      role: roleId,
      isActive: isActiveValue,
      id: data.id
    });
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
        this.dataForm.reset();

      }
    }).catch(() => { });

  }


  onSubmit() {
    if (this.dataForm.valid) {
      const newData = this.dataForm.value;
      const isUpdate = !!newData.id;
      const newConfig: any = {
        isUpdate: isUpdate,
        id: isUpdate ? newData.id : undefined,
        employeeId: newData.employeeId,
        role: newData.role,
        isActive: newData.isActive,
        user: "user1",
        isactive: !!newData.isActive
      };
      console.log(newConfig);

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
