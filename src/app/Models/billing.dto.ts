import { UntypedFormBuilder } from "@angular/forms";

export class BillingDTO {
  Id?: number
  companyId: number
  companyDelegationId: number
  isEdit?: boolean
  isSelected?: boolean
  year:string
  jan?: string
  feb?: string
  mar?: string
  apr?: string
  may?: string
  jun?: string
  jul?: string
  aug?: string
  sep?: string
  oct?: string
  nov?: string
  dec?: string

constructor (
  Id: number,
  companyId: number,
  companyDelegationId: number,
  isEdit: boolean,
  isSelected: boolean,
  year: string,
  jan: string,
  feb: string,
  mar: string,
  apr: string,
  may: string,
  jun: string,
  jul: string,
  aug: string,
  sep: string,
  oct: string,
  nov: string,
  dec: string,
) {
  this.companyId = companyId
  this.companyDelegationId = companyDelegationId
  this.isEdit = isEdit
  this.isSelected = isSelected
  this.year = year
  this.jan = jan
  this.feb = feb
  this.mar = mar
  this.apr = apr
  this.may = may
  this.jun = jun
  this.jul = jul
  this.aug = aug
  this.sep = sep
  this.oct = oct
  this.nov = nov
  this.dec = dec
}
}
export const BillingColumns = [
  {
      key: "delegation",
      type: "text",
      label: "Emplaçament"
  },
  {
      key: "year",
      type: "text",
      label: "Year"
  },

  {
    key: "jan",
    type: "number",
    label: "01"
  },
  {
    key: "feb",
    type: "number",
    label: "02"
  },
  {
    key: "mar",
    type: "number",
    label: "03"
  },
  {
    key: "apr",
    type: "number",
    label: "04"
  },
  {
    key: "may",
    type: "number",
    label: "05"
  },
  {
    key: "jun",
    type: "number",
    label: "06"
  },
  {
    key: "jul",
    type: "number",
    label: "07"
  },
  {
    key: "aug",
    type: "number",
    label: "08"
  },
  {
    key: "sep",
    type: "number",
    label: "09"
  },
  {
    key: "oct",
    type: "number",
    label: "10"
  },
  {
    key: "nov",
    type: "number",
    label: "11"
  },
  {
    key: "dec",
    type: "number",
    label: "12"
  },
  {
    key: "isEdit",
    type: "isEdit",
    label: ""
  },
];
