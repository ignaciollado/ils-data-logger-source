import { UntypedFormBuilder } from "@angular/forms";
import { EnergyDTO } from "./energy.dto";

export class ConsumptionDTO {
  consumptionId!: string
  companyId: string
  delegation: number
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
  this.quantity = quantity
  this.fromDate = fromDate
  this.toDate = toDate
}
}
