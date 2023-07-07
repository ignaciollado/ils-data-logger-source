import { EnergyDTO } from "./energy.dto";

export class ConsumptionDTO {
  consumptionId!: string
  companyId: string
  delegation: string
  aspectId: number
  quantity: number
  fromDate: Date
  toDate: Date
  createAt!: Date
  updatedAt!: Date
  energy!: number
  residue!: number
  reuse!:number
  recycling!:number
  incineration!:number
  dump!:number
  compost!:number
  nameES: string
  nameCA!: string
  unit: string
  pci: number

constructor(
  aspectId: number,
  delegation: string,
  fromDate: Date,
  toDate: Date,
  nameES: string,
  nameCA: string,
  quantity: number,
  companyId: string,
  unit: string,
  pci: number
) {
  this.companyId = companyId,
  this.delegation = delegation,
  this.aspectId = aspectId,
  this.nameES = nameES,
  this.nameCA = nameCA,
  this.unit = unit,
  this.pci = pci,
  this.quantity = quantity
  this.fromDate = fromDate
  this.toDate = toDate
}
}
