import { UntypedFormBuilder } from "@angular/forms";

export class BillingDTO {
  Id: string
  companyId: number
  companyDelegationId: number
  year:string
  jan: string
  feb: string
  mar: string
  apr: string
  may: string
  jun: string
  jul: string
  aug: string
  sep: string
  oct: string
  nov: string
  dec: string
  quantity!: number
  objective!: number
  updated_at!: Date
  deleted_at!: Date

constructor (
  Id: number,
  companyId: number,
  companyDelegationId: number,
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
