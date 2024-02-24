
export interface projectModel {
    // projectId: number
    // projectCode: string
    // projectName: string
    // divison: string
    // department: string

    dimension_Code:string
    code:string
    name:string
    departmentCode:string
    departmentName:string
    divisionCode:string
    divisionName:string
    tlApprover:string
    chApprover:string
    financeApprover:string
    supportApprover:string
}


export interface invoiceStatusModule {
    headerId: string
    impiHeaderInvoiceType: string
    impiHeaderProjectCode: string
    impiHeaderDepartment: string
    impiHeaderDivison: string
    impiHeaderPanNo: string
    impiHeaderGstNo: string
    impiHeaderCustomerName: string
    impiHeaderCustomerCode: string
    impiHeaderCustomerAddress: string
    impiHeaderCustomerCity: string
    impiHeaderCustomerState: string
    impiHeaderCustomerPinCode: string
    impiHeaderCustomerGstNo: string
    impiHeaderCustomerContactPerson: string
    impiHeaderCustomerEmailId: string
    impiHeaderCustomerPhoneNo: string
    impiHeaderCreatedBy: string
    impiHeaderTotalInvoiceAmount: number
    impiHeaderAttachment: any
    impiHeaderPaymentTerms: string
    impiHeaderRemarks: string
    impiHeaderSubmittedDate: string
    impiHeaderModifiedDate: any
    isDraft: boolean
    lineItem_Requests: LineItemRequest[]
}

export interface LineItemRequest {
    impiLineDescription: string
    impiLineQuantity: number
    impiLineDiscount: number
    impiLineUnitPrice: number
    impiLineAmount: number
}
