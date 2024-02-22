export interface CountryList {
    countryId: number,
    countryName: string,
    countryCode: string
}


export interface StateList {
    stateId: number,
    stateName: string,
    country: string
}

export interface CityList {
    cityId: number,
    cityName: string,
    state: string
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
    cityCode: string,
    stateCode: string,
    countryCode: string
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
    cityCode:string
    stateCode:string
    countryCode:string
    workFlowHistory: WorkFlowHistory[]

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
    statusName: string
    customerName: string
    custoemrAddress: string
    customerPhoneNo: string
    customerEmailId: string
    customerPinCode: string
    customerLastname: string
    custoemrAddress2: string
    customerContactPerson: any
    customerGstNo: string
    customerPanNo: string
    isActive: boolean
    createdOn: string
    createdby: string
    lastUpdateBy: any
    customerUpdatedOn: string
    customerTlApprover: string
    customerClusterApprover: string
    customerSgApprover: string
    cityName: string
    customerTypeName: string
    customerStatus: number
    approverEmail: string
  }
