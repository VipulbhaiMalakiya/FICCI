export interface Configuration {
  c_ID: number;
  c_Code: string;
  c_Value: string;
  category_Name: string;
  isActive: string;
}

export interface addUpdateConfiguration {
  isUpdate: boolean;
  c_ID?: number;
  c_Code: string; // Remove quotes here
  c_Value: string; // Remove quotes here
  categoryID: number;
  user: string; // Remove quotes here
  isactive: boolean;
}
