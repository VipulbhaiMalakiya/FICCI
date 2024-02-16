export interface addUpdateCustomers{

}


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


