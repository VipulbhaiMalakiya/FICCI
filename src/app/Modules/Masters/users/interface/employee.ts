export interface Employees{
  imeM_ID:number;
  imeM_EmpId:string ;
  imeM_Name:string;
  imeM_Email:string;
  imeM_Username:string;
  isActive:string
}

export interface addUpdateEmployees{
  isUpdate:boolean;
  id:number;
  empId:string;
  username:string;
  name:string;
  email:string;
  roleId:string;
  isActive:boolean;
}
