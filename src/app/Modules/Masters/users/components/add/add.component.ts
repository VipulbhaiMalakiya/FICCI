import { Component, OnInit } from '@angular/core';
import { Roles,publicVariable,DEFAULT_ROLE_LIST,UserService,ConfirmationDialogModalComponent,ToastrService,NgbModal,FormBuilder, FormGroup, Validators } from '../../import/index';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  publicVariable = new publicVariable();


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
    this.publicVariable.dataForm = this.fb.group({
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
     this.publicVariable.userData = history.state.data; // Assuming history.state.data contains user data

    if (this.publicVariable.userData) {
      this.onEdit(this.publicVariable.userData);
    }

  }

  // Method to fetch roles
  getRoles() {
    this.API.getRoles().subscribe(
      data => {
        this.publicVariable.roles = data;
      },
      error => {
        this.publicVariable.roles = DEFAULT_ROLE_LIST; // Assuming DEFAULT_ROLE_LIST is defined somewhere
      }
    );
  }

  onSelectEmployee() {
    const selectedId = this.publicVariable.dataForm.get('employeeId')?.value;

    // Check if a valid employee is selected
    if (selectedId) {
      this.publicVariable.selectedEmployee = this.employees.find(employee => employee.id == selectedId);
      // Assign selected employee's properties to form controls
      if (this.publicVariable.selectedEmployee) {
        this.publicVariable.dataForm.patchValue({
          username: this.publicVariable.selectedEmployee.username,
          name: this.publicVariable.selectedEmployee.name,
          email: this.publicVariable.selectedEmployee.email
        });
      }
    } else {
      // Clear form values if no employee is selected
      this.publicVariable.dataForm.patchValue({
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
    this.publicVariable.isEdit = true;
    const isActiveValue = data.active.toLowerCase() === 'yes' ? true : false;
    const roleId = this.findRoleId(data.role);
    this.publicVariable.dataForm.patchValue({
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
        this.publicVariable.dataForm.reset();

      }
    }).catch(() => { });

  }


  onSubmit() {
    if (this.publicVariable.dataForm.valid) {
      const newData = this.publicVariable.dataForm.value;
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
      this.markFormControlsAsTouched();
    }

  }

  handleApiResponse(res: any, successMessage: string): void {
    if (res.status === true) {
      this.toastr.success(successMessage, 'Success');
      // this.loadConfiguration();
      this.publicVariable.dataForm.reset();
    } else {
      this.toastr.error(res.message, 'Error');
    }
  }

  handleApiRequest(apiRequest: any, successMessage: string, errorMessagePrefix: string): void {
    try {
      this.publicVariable.Subscription.add(
        apiRequest.subscribe({
          next: (res: any) => {
            this.handleApiResponse(res, successMessage);
          },
          error: (error: any) => {
            console.error(errorMessagePrefix, error);
            this.toastr.error(error.error.message || 'An error occurred. Please try again later.', 'Error');
          }
        })
      );
    } catch (error) {
      this.toastr.error('Error handling API request', 'Error');
    }
  }
  markFormControlsAsTouched(): void {
    ['employeeId', 'username', 'name', 'email', 'role'].forEach(controlName => {
      this.publicVariable.dataForm.controls[controlName].markAsTouched();
    });
  }

  shouldShowError(controlName: string, errorName: string) {
    return this.publicVariable.dataForm.controls[controlName].touched && this.publicVariable.dataForm.controls[controlName].hasError(errorName);
  }
}
