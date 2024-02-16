export interface CountryList{
  countryId:number,
  countryName:string,
  countryCode:string
}


export interface StateList{
  stateId:number,
  stateName:string,
  country:string
}

export interface CityList{
  cityId:number,
  cityName:string,
  state:string
}

export interface GstCustomerTypeList{
  gstTypeId:number,
  gstTypeName:string,
}


export interface addUpdateCustomer {
  isupdate: boolean
  customerId: number
  customerCode: string
  customerName: string
  customerLastName: string
  address: string
  address2: string
  contact: string
  phone: string
  pinCode: string
  email: string
  cityid: number
  isDraft: boolean
  gstNumber: string
  pan: string
  gstCustomerType: number
}
