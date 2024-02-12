import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { publicVariable, DEFAULT_ROLE_LIST, UserService, ConfirmationDialogModalComponent, ToastrService, NgbModal, FormBuilder, FormGroup, Validators } from '../../import/index';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  publicVariable = new publicVariable();

  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private API: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
  }
  private initializeForm(): void {
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
    this.patchFormWithData();
    this.loadEmpoyeeList();
    this.getRoles();
  }
  onSelectEmployee() {
    const selectedId = this.publicVariable.dataForm.get('employeeId')?.value;
    //Check if a valid employee is selected
    if (selectedId) {
      this.publicVariable.selectedEmployee = this.publicVariable.employeeList.find(employee => employee.imeM_ID == selectedId);
      // Assign selected employee's properties to form controls
      if (this.publicVariable.selectedEmployee) {
        this.publicVariable.dataForm.patchValue({
          username: this.publicVariable.selectedEmployee.imeM_Username,
          name: this.publicVariable.selectedEmployee.imeM_Name,
          email: this.publicVariable.selectedEmployee.imeM_Email
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

  // Method to fetch employess

  loadEmpoyeeList(): void {
    try {
      this.publicVariable.Subscription.add(
        this.API.getEmployee().subscribe({
          next: (response: any) => {
            this.publicVariable.employeeList = response.employees
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

  // Method to fetch roles
  getRoles() {
    this.API.getRoles().subscribe({
      next: (data: any) => {
        this.publicVariable.roles = data.roles;
      },
      error: (error: any) => {
        this.publicVariable.roles = DEFAULT_ROLE_LIST; // Assuming DEFAULT_ROLE_LIST is defined somewhere
      }
    });
  }

  // Method to Patch data edite time
  patchFormWithData(): void {
    this.publicVariable.userData = history.state.data; // Assuming history.state.data contains user data
    if (this.publicVariable.userData) {
      this.onEdit(this.publicVariable.userData);
    }
  }

  //Fine role name to roleId
  findRoleId(roleName: string): number | undefined {
    const trimmedRoleName = roleName.trim().toLowerCase(); // Normalize role name
    const role = DEFAULT_ROLE_LIST.find(role => role.roleName.toLowerCase() === trimmedRoleName);
    return role ? role.role_id : undefined;
  }

  //handleApiResponse
  handleApiResponse(res: any, successMessage: string): void {
    if (res.status === true) {
      this.toastr.success(successMessage, 'Success');
      // this.loadConfiguration();
      this.publicVariable.dataForm.reset();
    } else {
      this.toastr.error(res.message, 'Error');
    }
  }

  //handleApiRequest
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
  //Filed Define to show error in sumit time
  markFormControlsAsTouched(): void {
    ['employeeId', 'username', 'name', 'email', 'role'].forEach(controlName => {
      this.publicVariable.dataForm.controls[controlName].markAsTouched();
    });
  }

  //Error Function
  shouldShowError(controlName: string, errorName: string) {
    return this.publicVariable.dataForm.controls[controlName].touched && this.publicVariable.dataForm.controls[controlName].hasError(errorName);
  }
}
