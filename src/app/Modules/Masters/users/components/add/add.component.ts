import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { publicVariable, DEFAULT_ROLE_LIST, addUpdateEmployees, UserService, ConfirmationDialogModalComponent, ToastrService, NgbModal, FormBuilder, FormGroup, Validators, Router } from '../../import/index';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class AddComponent implements OnInit {
    publicVariable = new publicVariable();
    userId!: number;
    deparment: any;

    constructor(private fb: FormBuilder,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private API: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef,

    ) {
        this.initializeForm();
    }
    private initializeForm(): void {
        this.publicVariable.dataForm = this.fb.group({
            id: [''],
            empId: [null, Validators.required],
            roleId: [null, Validators.required],
            username: [{ value: '', disabled: true }, , Validators.required],
            name: [{ value: '', disabled: true }, , Validators.required],
            email: [{ value: '', disabled: true }, , [Validators.required, Validators.email]],
            isActive: [true] ,// Assuming default value is true
            departmentName: [null],
            dept: [{ value: '', disabled: true }],
        });
    }


    ngOnInit(): void {

        this.loadEmpoyeeList();
       // this.getRoles();

        //this.GetDepartment();
        //this.publicVariable.isProcess = false;
        this.route.paramMap.pipe(
            // take(1) // Take only the first emitted value
        ).subscribe(params => {
            if (params && params.get('id')) {
                this.userId = +params.get('id')!;
                //this.fetchUserData(this.userId);
            }
        });

    }

    GetDepartment(): void {

        this.API.GetDepartment().subscribe({
            next: (data: any) => {
                this.deparment = data.data;
                this.publicVariable.isProcess = false; // Close loader
                this.cd.detectChanges(); // Trigger change detection

                this.fetchUserData(this.userId);
            },
            error: (error: any) => {
                this.publicVariable.isProcess = false; // Close loader
                this.cd.detectChanges(); // Trigger change detection

                // Handle error if necessary
            }
        });
    }

    customSearchFn(term: string, item: any) {
        const concatenatedString = `${item.imeM_EmpId} ${item.imeM_Name}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }

    fetchUserData(userId: number): void {
        this.API.getUserById(userId).subscribe({
            next: (data: any) => {
                const userData = data.data[0];
                if (userData) {
                    this.publicVariable.roleId = this.getRoleIdByRoleName(userData.roleName);
                    this.publicVariable.userData = userData;
                    this.onEdit(userData);
                }
            },
            complete: () => {
                this.publicVariable.isProcess = false;
            }
        });
    }

    getRoles(): void {
        this.API.getRoles().subscribe({
            next: (data: any) => {
                this.publicVariable.roles = data.data.map((role: { roleName: string }) => ({
                    ...role,
                }));

                this.GetDepartment();
            },

            error: (error: any) => {
                this.publicVariable.roles = DEFAULT_ROLE_LIST;
            }
        });
    }

    loadEmpoyeeList(): void {
        this.publicVariable.Subscription.add(
            this.API.getEmployee().subscribe({
                next: (response: any) => {
                    this.publicVariable.employeeList = response.data;
                    this.publicVariable.isProcess = false;
                    this.getRoles();
                }
            })
        );
    }

    onSelectEmployee() {
        const selectedId = this.publicVariable.dataForm.get('empId')?.value;
        if (selectedId) {
            this.publicVariable.selectedEmployee = this.publicVariable.employeeList.find(employee => employee.imeM_EmpId == selectedId);
            if (this.publicVariable.selectedEmployee) {
                this.publicVariable.dataForm.patchValue({
                    username: this.publicVariable.selectedEmployee.imeM_Username,
                    name: this.publicVariable.selectedEmployee.imeM_Name,
                    email: this.publicVariable.selectedEmployee.imeM_Email,
                    dept: this.publicVariable.selectedEmployee.department,
                });
            }
        } else {
            this.publicVariable.dataForm.patchValue({
                username: null,
                name: null,
                email: null,
                dept:null
            });
        }
    }

    customSearchFn1(term: string, item: any) {
        const concatenatedString = `${item.departmentCode} ${item.departmentName}`.toLowerCase();
        return concatenatedString.includes(term.toLowerCase());
    }
    onDelete(id: number): void {
        const modalRef = this.modalService.open(ConfirmationDialogModalComponent, { size: "sm", centered: true, backdrop: "static" });
        const componentInstance = modalRef.componentInstance as ConfirmationDialogModalComponent;
        componentInstance.message = "Do you really want to delete these records? This process cannot be undone ?";

        modalRef.result.then((canDelete: boolean) => {
            if (canDelete) {
                this.publicVariable.isProcess = true;
                this.API.delete(id).subscribe({
                    next: (res: any) => {
                        this.toastr.success(res.message, 'Success');
                        this.router.navigate(['/masters/users']);
                    },
                    error: (error: any) => {
                        this.toastr.error(error.error.message, 'Error');
                    },
                    complete: () => {
                        this.publicVariable.isProcess = false;
                    }
                });
            }
        }).catch(() => { });
    }


    onSubmit(): void {
        if (this.publicVariable.dataForm.valid) {
            const newData = this.publicVariable.dataForm.value;
            const isUpdate = !!newData.id;
            const selectedEmployee = this.publicVariable.employeeList.find(employee => employee.imeM_EmpId === newData.empId) || this.publicVariable.userData;

            const newConfig: addUpdateEmployees = {
                isUpdate: isUpdate,
                imeM_ID: isUpdate ? newData.id : undefined,
                imeM_EmpId: newData.empId || this.publicVariable.userData.imeM_EmpId,
                imeM_Username: selectedEmployee.imeM_Username,
                imeM_Name: selectedEmployee.imeM_Name,
                imeM_Email: selectedEmployee.imeM_Email,
                roleId: newData.roleId,
                isActive: newData.isActive,
                departmentName: newData.departmentName,
                Department: selectedEmployee.department,
            };

           // console.log(newConfig);

            const successMessage = isUpdate ? 'Data updated successfully.' : 'Data created successfully.';
            this.handleApiRequest(this.API.create(newConfig), successMessage, 'Error submitting data:');
        } else {
            this.markFormControlsAsTouched();
        }
    }

    handleApiRequest(apiRequest: any, successMessage: string, errorMessagePrefix: string): void {
        try {
            this.publicVariable.isProcess = true;
            this.publicVariable.Subscription.add(
                apiRequest.subscribe({
                    next: (res: any) => {
                        if (res.status === true) {
                            this.toastr.success(successMessage, 'Success');
                            this.publicVariable.userData = res.data;
                            this.publicVariable.isProcess = false;
                            this.publicVariable.dataForm.reset();
                            this.publicVariable.dataForm.patchValue({ isActive: true });

                        } else {
                            this.toastr.error(res.message, 'Error');
                            this.publicVariable.isProcess = false;
                        }
                        this.cd.detectChanges();
                    },
                    error: (error: any) => {
                        this.toastr.error(error.error.message || 'An error occurred. Please try again later.', 'Error');
                        this.publicVariable.isProcess = false;
                        this.cd.detectChanges();
                    },
                    complete: () => {
                        this.publicVariable.isProcess = false;
                    }
                })
            );
        } catch (error) {
            this.toastr.error('Error handling API request', 'Error');
            this.publicVariable.isProcess = false;
        }
    }

    findRoleId(roleName: string): number | null {


        // Assuming you have an array of roles with id and name properties
        console.log(this.publicVariable.roles);

        const role = this.publicVariable.roles.find(role => role.roleName === roleName);

        return role ? role.role_id : null; // Return the role id if found, otherwise return null
    }

    onEdit(data: any): void {


        console.log(data);
        this.publicVariable.isEdit = true;
        this.cd.detectChanges();
      let empdata = this.publicVariable.employeeList.find(x=>x.imeM_EmpId == data.imeM_EmpId);

      if(empdata!=undefined)

      {

        this.publicVariable.dataForm.patchValue({
            empId: data.imeM_EmpId,
            username: empdata.imeM_Username,
            name: empdata.imeM_Name,
            email: empdata.imeM_Email,
            roleId: this.findRoleId(data.roleName),
            isActive: data.isActive,
            id: data.imeM_ID,
            dept: empdata.department,
            departmentName: data.departmentName,
        });

    }

    else
    {
        this.publicVariable.dataForm.patchValue({
            empId: data.imeM_EmpId,
            username: data.imeM_Username,
            name: data.imeM_Name,
            email: data.imeM_Email,
            roleId: this.findRoleId(data.roleName),
            isActive: data.isActive,
            id: data.imeM_ID,
            dept: data.department,
            departmentName: data.departmentName,
        });


    }
        this.publicVariable.dataForm.controls["empId"].disable();
    }

    // onEdit(data: any): void {
    //     this.publicVariable.isEdit = true;
    //     this.cd.detectChanges();
    //     this.publicVariable.dataForm.patchValue({
    //         empId: data.imeM_EmpId,
    //         username: data.imeM_Username,
    //         name: data.imeM_Name,
    //         email: data.imeM_Email,
    //         roleId: data.roleId || this.publicVariable.roleId,
    //         isActive: data.isActive,
    //         id: data.imeM_ID
    //     });
    //     this.publicVariable.dataForm.controls["empId"].disable();
    // }

    getRoleIdByRoleName(roleName: string): number | undefined {

        const role = this.publicVariable.roles.find(role => role.roleName === roleName);
        return role ? role.role_id : undefined;
    }



    markFormControlsAsTouched(): void {

                ['empId', 'username', 'name', 'email', 'roleId','departmentName','dept'].forEach(controlName => {
            this.publicVariable.dataForm.controls[controlName].markAsTouched();
        });
    }

    shouldShowError(controlName: string, errorName: string): boolean {
        return this.publicVariable.dataForm.controls[controlName].touched && this.publicVariable.dataForm.controls[controlName].hasError(errorName);
    }
}
