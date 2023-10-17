import { UntypedFormBuilder } from "@angular/forms";
import { EnergyDTO } from "./energy.dto";

export class ConsumptionDTO {
  consumptionId!: string
  companyId: string
  delegation: number
  aspectId: number
  quantity: number
  objective?: number
  fromDate: Date
  toDate: Date
  year:string
  month?: string
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
  created_at!: Date
  updated_at!: Date
  energy!: number
  residueId!: number
  scopeOne!: number
  scopeTwo!: number
  reuse!:number
  recycling!:number
  incineration!:number
  dump!:number
  compost!:number
  energyES!: string
  energyCA!: string
  residueES!: string
  residueCA!: string
  aspectES!: string
  aspectCA!: string
  unit: string
  pci: number

constructor(
  aspectId: number,
  delegation: number,
  fromDate: Date,
  toDate: Date,
  month: string,
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
  energyES: string,
  energyCA: string,
  residueES: string,
  residueCA: string,
  aspectES: string,
  aspectCA: string,
  quantity: number,
  companyId: string,
  unit: string,
  pci: number
) {
  this.companyId = companyId,
  this.delegation = delegation,
  this.aspectId = aspectId,
  this.energyES = energyES,
  this.energyCA = energyCA,
  this.residueES = residueES,
  this.residueCA = residueCA,
  this.aspectES = aspectES,
  this.aspectCA = aspectCA,
  this.unit = unit,
  this.pci = pci,
  this.quantity = quantity,
  this.fromDate = fromDate,
  this.toDate = toDate,
  this.month = month,
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
