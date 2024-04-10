export interface Employees {
    imeM_ID: number;
    imeM_EmpId: string;
    imeM_Name: string;
    imeM_Email: string;
    imeM_Username: string;
    isActive: boolean;
    department: string;
}

export interface addUpdateEmployees {
    isUpdate: boolean;
    imeM_ID: number;
    imeM_EmpId: string;
    imeM_Username: string;
    imeM_Name: string;
    imeM_Email: string;
    roleId: string;
    isActive: boolean;
    roleName?: string;
    departmentName:any;
    Department:any
}

export interface UserMaster {
    imeM_ID: number;
    imeM_EmpId: number;
    imeM_Name: string;
    imeM_Email: string;
    imeM_Username: string;
    isActive: string;
    roleName: string;
}
