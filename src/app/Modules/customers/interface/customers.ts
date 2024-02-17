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
    cityid: number
    isDraft: boolean
    gstNumber: string
    pan: string
    gstCustomerType: number
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
