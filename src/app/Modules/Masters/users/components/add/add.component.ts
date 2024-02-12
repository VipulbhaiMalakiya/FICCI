import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { publicVariable, DEFAULT_ROLE_LIST, addUpdateEmployees, UserService, ConfirmationDialogModalComponent, ToastrService, NgbModal, FormBuilder, FormGroup, Validators, Router } from '../../import/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  publicVariable = new publicVariable();
  userId!: number;
  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private API: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute

  ) {
    this.initializeForm();
  }
  private initializeForm(): void {
    this.publicVariable.dataForm = this.fb.group({
      id: [''],
      empId: [null, Validators.required],
      roleId: [null, Validators.required],
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      isActive: [true] // Assuming default value is true
    });
  }


  ngOnInit(): void {
    this.getRoles();
    this.loadEmpoyeeList();
    this.route.paramMap.subscribe(params => {
      if (params && params.get('id')) {
        this.userId = +params.get('id')!;
        this.fetchUserData(this.userId);
      }
    });

  }

  fetchUserData(userId: number): void {
    this.API.getUserById(userId).subscribe(data => {
      this.publicVariable.userData = data.data[0];
      // Store the fetched user data
      if (this.publicVariable.userData) {
        this.onEdit(this.publicVariable.userData);
        this.cdr.detectChanges();

      }
    });
  }
  onSelectEmployee() {
    const selectedId = this.publicVariable.dataForm.get('empId')?.value;
    if (selectedId) {
      this.publicVariable.selectedEmployee = this.publicVariable.employeeList.find(employee => employee.imeM_EmpId == selectedId);
      if (this.publicVariable.selectedEmployee) {
        this.publicVariable.dataForm.patchValue({
          username: this.publicVariable.selectedEmployee.imeM_Username,
          name: this.publicVariable.selectedEmployee.imeM_Name,
          email: this.publicVariable.selectedEmployee.imeM_Email
        });
      }
    } else {
      this.publicVariable.dataForm.patchValue({
        username: null,
        name: null,
        email: null
      });
    }
  }

  onDelete(id: number) {
    const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
    var componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
    componentInstance.message = "Are you sure you want to delete this ?";
    modalRef.result.then((canDelete: boolean) => {
      if (canDelete) {
        this.API.delete(id).subscribe({
          next: (res: any) => {
            this.toastr.success(res.message, 'Success');
            this.router.navigate(['/masters/users']);
          },
          error: (error) => {
            this.toastr.error(error.error.message, 'Error');
          }
        });

      }
    }).catch(() => { });

  }

  onSubmit() {

    if (this.publicVariable.dataForm.valid) {
      //Check if a valid employee is selected
      const newData = this.publicVariable.dataForm.value;
      const isUpdate = !!newData.id;
      const newConfig: addUpdateEmployees = {
        isUpdate: isUpdate,
        imeM_ID: isUpdate ? newData.id : undefined,
        imeM_EmpId: newData.empId,
        imeM_Username: newData.username,
        imeM_Name: newData.name,
        imeM_Email: newData.email,
        roleId: newData.roleId,
        isActive: newData.isActive
      };

      const successMessage = isUpdate ? 'Data updated successfully.' : 'Data created successfully.';
      this.API.create(newConfig).subscribe({
        next: (res: any) => {
          this.handleApiRequest(this.API.create(newConfig), successMessage, 'Error submitting data:');
        },
        error: (error) => {
          this.toastr.error(error.error.message || 'An error occurred. Please try again later.', 'Error');
        }
      });
    } else {
      this.markFormControlsAsTouched();
    }

  }

  // Method to fetch roles

  getRoles() {
    this.API.getRoles().subscribe({
      next: (data: any) => {
        this.publicVariable.roles = data.data.map((role: { roleName: string }) => ({
          ...role,
        }));
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.publicVariable.roles = DEFAULT_ROLE_LIST; // Assuming DEFAULT_ROLE_LIST is defined somewhere
      }
    });
  }

  getRolesAndFindRoleId(roleNameToFind: string): void {
    this.API.getRoles().subscribe({
      next: (data: any) => {
        this.publicVariable.roles = data.data.map((role: { roleName: string, role_id: number }) => ({
          ...role,
        }));
        const roleId = this.getRoleIdFromRoleName(roleNameToFind);
        this.cdr.detectChanges();

      },
      error: (error: any) => {
        this.publicVariable.roles = DEFAULT_ROLE_LIST; // Assuming DEFAULT_ROLE_LIST is defined somewhere
      }
    });
  }

  getRoleIdFromRoleName(roleName: string): number | undefined {
    const role = this.publicVariable.roles.find((r: any) => r.roleName === roleName);
    this.cdr.detectChanges();
    return role ? role.role_id : undefined;

  }

  onEdit(data: any) {
    this.publicVariable.isEdit = true;
    let isActiveValue;
    if (data.isActive === true || data.isActive === 'Yes') {
      isActiveValue = true;
    }
    else {
      isActiveValue = false;
    }
    if (!this.publicVariable.roles || this.publicVariable.roles.length === 0) {
      this.getRolesAndFindRoleId(data.roleName);

    } else {
      this.publicVariable.roleId = this.getRoleIdFromRoleName(data.roleName);
      this.cdr.detectChanges();

    }
    this.publicVariable.dataForm.patchValue({
      empId: data.imeM_EmpId,
      username: data.imeM_Username,
      name: data.imeM_Name,
      email: data.imeM_Email,
      roleId: this.publicVariable.roleId,
      isActive: isActiveValue,
      id: data.imeM_ID
    });

  }

  // Method to fetch employess

  loadEmpoyeeList(): void {
    try {
      this.publicVariable.Subscription.add(
        this.API.getEmployee().subscribe({
          next: (response: any) => {
            this.publicVariable.employeeList = response.data
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

  //handleApiResponse
  handleApiResponse(res: any, successMessage: string): void {
    if (res.status === true) {
      this.toastr.success(successMessage, 'Success');
      this.publicVariable.userData = res.data;
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
            this.publicVariable.userData = res.data
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
    ['empId', 'username', 'name', 'email', 'role'].forEach(controlName => {
      this.publicVariable.dataForm.controls[controlName].markAsTouched();
    });
  }

  //Error Function
  shouldShowError(controlName: string, errorName: string) {
    return this.publicVariable.dataForm.controls[controlName].touched && this.publicVariable.dataForm.controls[controlName].hasError(errorName);
  }
}
