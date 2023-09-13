import { UntypedFormBuilder } from "@angular/forms";

export class BillingDTO {
  Id: string
  companyId: number
  companyDelegationId: number
  year:string
  month: string
  quantity: number
  objective: number
  updated_at!: Date
  deleted_at!: Date

constructor (
  Id: number,
  companyId: number,
  companyDelegationId: number,
  year: string,
  month: string,
  quantity: number,
  objective: number,
) {
  this.companyId = companyId,
  this.companyDelegationId = companyDelegationId,
  this.year = year,
  this.month = month,
  this.quantity = quantity,
  this.objective = objective
}
}
