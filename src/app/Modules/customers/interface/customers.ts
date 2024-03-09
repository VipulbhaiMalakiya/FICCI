export interface CityList {
    cityId: any
    cityName: string
    cityCode: string
  }

  export interface StateList {
    stateId: any
    stateName: string
    stateCode: string
  }

  export interface CountryList {
    countryId: any
    countryName: string
    countryCode: string
  }

export interface PostCodeList {
    postCode: string,
    city: string
}

export interface GstCustomerTypeList {
    gstTypeId: number,
    gstTypeName: string,
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
    isDraft: boolean
    gstNumber: string
    pan: string
    gstCustomerType: number
    cityCode?: string,
    stateCode?: string,
    countryCode?: string
}

export interface customerStatusListModel {
    customerId: number
    customerCode: string
    customerName: string
    address: string
    phoneNumber: string
    email: string
    pincode: string
    customerLastName: string
    address2: string
    contact: string
    gstNumber: string
    pan: string
    gstType: GstType
    isActive: boolean
    isDraft:boolean
    createdOn:string
    createdBy:string
    lastUpdateBy:string
    modifiedOn:string
    tlApprover:string
    clApprover:string
    customerStatus:string
    approvedBy:string
    approvedOn:string
    cityList: CityList
    stateList: StateList
    countryList: CountryList
    workFlowHistory: WorkFlowHistory[]
    accountRemarks:string
    customerRemarks:string

}
export interface WorkFlowHistory {
    imwdId: number
    imwdScreenName: string
    imwdInitiatedBy: string
    imwdRole: string
    imwdRemarks?: string
    imwdStatus: string
    imwdPendingAt: string
    imwdCreatedBy: string
    imwdCreatedOn: string
    customerId: number
  }



export interface GstType {
    gstTypeId: number
    gstTypeName: string
}

export interface ApproveCustomerList {
    customerId: number
    customerCode: string
    customerName: string
    address: string
    phoneNumber: string
    email: string
    pincode: string
    customerLastName: string
    address2: string
    contact: string
    gstNumber: string
    pan: string
    gstType: GstType
    isActive: boolean
    isDraft:boolean
    createdOn:string
    createdBy:string
    lastUpdateBy:string
    modifiedOn:string
    tlApprover:string
    clApprover:string
    approvedBy:string
    approvedOn:string
    customerStatus:string
    cityList: CityList
    stateList: StateList
    countryList: CountryList
    workFlowHistory: WorkFlowHistory[]

  }
