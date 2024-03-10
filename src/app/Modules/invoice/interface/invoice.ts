
export interface projectModel {


    dimension_Code: string
    code: string
    name: string
    departmentCode: string
    departmentName: string
    divisionCode: string
    divisionName: string
    tlApprover: string
    chApprover: string
    financeApprover: string
    supportApprover: string
}


export interface invoiceStatusModule {
    headerId: number
    headerPiNo: any
    impiHeaderInvoiceType: string
    impiHeaderProjectCode: string
    impiHeaderProjectName: string
    impiHeaderProjectDepartmentCode: string
    impiHeaderProjectDepartmentName: string
    impiHeaderProjectDivisionCode: string
    impiHeaderProjectDivisionName: string
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
    accountApprover:string
    impiHeaderPaymentTerms: string
    impiHeaderRemarks: string
    impiHeaderSubmittedDate: string
    impiHeaderModifiedDate: any
    headerStatus: string
    isDraft: boolean
    impiHeaderTlApprover: string
    impiHeaderClusterApprover: string
    impiHeaderFinanceApprover: string
    impiHeaderSupportApprover: any
    lineItem_Requests: LineItemRequest[]
    impiHeaderAttachment: Attachment[]
    impiHeaderTlApproverRemarks:string
    impiHeaderFinanceRemarks:string
    impiHeaderClusterApproverRemarks:string
    accountApproverRemarks:string
}

export interface Attachment {
    imadId: number
    imadRecordNo: any
    imadScreenName: string
    imadFileName: string
    imadFileType: string
    imadFileSize: string
    imadFileUrl: string
    imadActive: boolean
    imadCreatedBy: string
    imadCreatedOn: string
    imadModifiedBy: any
    imadModifiedOn: any
  }

export interface LineItemRequest {
    impiLineDescription: string
    impiLineQuantity: number
    impiLineDiscount: number
    impiLineUnitPrice: number
    impiLineAmount: number
}


export interface invoiceApproveModule {
    impiHeaderId: number
    impiHeaderPiNo: any
    impiHeaderInvoiceType: string
    impiHeaderProjectDivisionCode: string
    impiHeaderPanNo: string
    impiHeaderGstNo: string
    impiHeaderCustomerCode: string
    impiHeaderCustomerCity: string
    impiHeaderCustomerState: string
    impiHeaderCustomerPinCode: string
    impiHeaderCustomerGstNo: string
    impiHeaderCustomerEmailId: string
    impiHeaderCustomerPhoneNo: string
    impiHeaderCreatedBy: string
    impiHeaderSubmittedDate: string
    impiHeaderTotalInvoiceAmount: number
    impiHeaderPaymentTerms: string
    impiHeaderRemarks: string
    headerStatusId: number
    statusName: string
    approverEmail: string
    impiHeaderTlApproverRemarks:string
    impiHeaderFinanceRemarks:string
    impiHeaderClusterApproverRemarks:string
    accountApproverRemarks:string
  }

  export interface GetCustomerModel {
    custId: number
    custNo: string
    custName: string
    custName2: string
    custAddress: string
    custAddress2: string
    city: string
    contact: string
    pinCode: any
    stateCode: string
    countryRegionCode: string
    gstregistrationNo: string
    gstcustomerType: string
    panNo: string
    email: string
    primaryContactNo: string
  }

  export interface COAMasterModel {
    name:string
    no:string
  }
 export interface GSTGroupModel{
    code:string
 }

 export interface HSNSACModel {
    hsnId:number,
    hsnCode:string,
    hsnGroup:string
 }

 export interface InvoiceSummaryModel {
    no: string
    postingDate: string
    invoice_no: string
    sellToCustomerNo: string
    sellToCustomerName: string
    sellToCustomerName2: string
    projectCode: string
    dimensionSetID: string
    departmentName: string
    departmentCode: string
    divisionCode: string
    divisionName: string
    approverTL: string
    approverCH: string
    approverSupport: string
    financeApprover: string
    invoicePortalOrder: boolean
    invoicePortalSubmitted: boolean
    createdByUser: string
    sellToCity: any
    sellToAddress: any
    sellToAddress2: any
    sellToPostCode: any
    sellToCountryRegionCode: any
    gsT_No: any
    paN_NO: any
    taxLineDetails: any
    cancelled:any
    cancelRemark:any
    getTaxInvoiceInfoLines:any
    status:any
  }
