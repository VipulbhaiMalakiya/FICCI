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
    city: City
    state: State
    country: Country
    gstType: GstType
    isActive: boolean
    isDraft: boolean
    createdOn: string
    createdBy: string
    lastUpdateBy: string
    modifiedOn: string
    tlApprover: string
    clApprover: string
    customerStatus: string

}

export interface City {
    cityId: number
    cityName: string
    state: any
}

export interface State {
    stateId: number
    stateName: string
    country: any
}

export interface Country {
    countryId: number
    countryName: string
}

export interface GstType {
    gstTypeId: number
    gstTypeName: string
}
