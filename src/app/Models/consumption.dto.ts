import { UntypedFormBuilder } from "@angular/forms";
import { EnergyDTO } from "./energy.dto";

export class ConsumptionDTO {
  consumptionId!: string
  companyId: string
  delegation: number
  quantity!: number
  fromDate!: Date
  toDate!: Date
  created_at!: Date
  objective: string
  aspectId: number
  year:string
  isEdit: boolean
  isSelected: boolean
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
  this.year = year,
  this.energyES = energyES,
  this.energyCA = energyCA,
  this.residueES = residueES,
  this.residueCA = residueCA,
  this.aspectES = aspectES,
  this.aspectCA = aspectCA,
  this.unit = unit,
  this.pci = pci,
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
  this.dec = dec,
  this.isSelected = isSelected,
  this.isEdit = isEdit
}
}

export const energyColumns = [
  {
    key: 'isSelected',
    type: 'isSelected',
    label: '',
  },
  {
    key: "Id",
    type: "label",
    label: "ID"
  },
  {
      key: "delegation",
      type: "label",
      label: "Emplaçament"
  },
  {
      key: "year",
      type: "label",
      label: "Year"
  },
  {
      key: "energyES",
      type: "label",
      label: "Consumption"
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
]

export const waterColumns = [
  {
    key: 'isSelected',
    type: 'isSelected',
    label: '',
  },
  {
    key: "Id",
    type: "label",
    label: "ID"
  },
  {
      key: "delegation",
      type: "label",
      label: "Emplaçament"
  },
  {
      key: "year",
      type: "label",
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
]
