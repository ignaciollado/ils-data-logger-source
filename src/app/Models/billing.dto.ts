import { UntypedFormBuilder } from "@angular/forms";

export class BillingDTO {
  Id: number
  companyId: number
  companyDelegationId: number
  isEdit: boolean
  isSelected: boolean
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
  this.companyId = companyId,
  this.companyDelegationId = companyDelegationId,
  this.isEdit = isEdit
  this.isSelected = isSelected
  this.year = year,
  this.jan = jan,
  this.feb = feb,
  this.mar = mar,
  this.apr = apr,
  this.may = may,
  this.jun = jun,
  this.jul = jul,
  this.aug = aug,
  this.sep = sep,
  this.oct = oct,
  this.nov = nov,
  this.dec = dec
}
}
export const BillingColumns = [
/*   {
    key: 'isSelected',
    type: 'isSelected',
    label: '',
  }, */

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
    label: "January"
  },
  {
    key: "feb",
    type: "number",
    label: "February"
  },
  {
    key: "mar",
    type: "number",
    label: "March"
  },
  {
    key: "apr",
    type: "number",
    label: "April"
  },
  {
    key: "may",
    type: "number",
    label: "May"
  },
  {
    key: "jun",
    type: "number",
    label: "June"
  },
  {
    key: "jul",
    type: "number",
    label: "July"
  },
  {
    key: "aug",
    type: "number",
    label: "August"
  },
  {
    key: "sep",
    type: "number",
    label: "September"
  },
  {
    key: "oct",
    type: "number",
    label: "October"
  },
  {
    key: "nov",
    type: "number",
    label: "November"
  },
  {
    key: "dec",
    type: "number",
    label: "December"
  },
  {
    key: "isEdit",
    type: "isEdit",
    label: ""
  },
];
