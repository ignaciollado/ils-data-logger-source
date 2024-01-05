import { UntypedFormBuilder } from "@angular/forms";
import { ChapterItem } from "./residueLER.dto";

export class ConsumptionDTO {
  consumptionId?: string
  companyId: string
  delegation: number
  quantity?: number
  fromDate?: Date
  toDate?: Date
  created_at?: Date
  objective: string
  aspectId: number
  year:string
  isEdit: boolean
  isSelected: boolean
  jan?: number
  feb?: number
  mar?: number
  apr?: number
  may?: number
  jun?: number
  jul?: number
  aug?: number
  sep?: number
  oct?: number
  nov?: number
  dec?: number

  energy?: number
  residueId?: string
  scopeOne?: number
  scopeTwo?: number
  reuse?: number
  recycling?: number
  incineration?: number
  dump?: number
  compost?: number
  energyES?: string
  energyCA?: string
  residueES?: string
  residueCA?: string
  aspectES?: string
  aspectCA?: string
  pci?: number /* eliminar cuando se hayan modificado las gráficas */
  unit?: string /* eliminar cuando se hayan modificado las gráficas */

constructor(
  aspectId: number,
  residueId: string, /* el código LER del residue es una cadena */
  delegation: number,
  isEdit: boolean,
  isSelected: boolean,
  year: string,
  jan: number,
  feb: number,
  mar: number,
  apr: number,
  may: number,
  jun: number,
  jul: number,
  aug: number,
  sep: number,
  oct: number,
  nov: number,
  dec: number,
  energyES: string,
  energyCA: string,
  residueES: string,
  residueCA: string,
  aspectES: string,
  aspectCA: string,
  quantity: number,
  companyId: string,

) {
  this.companyId = companyId,
  this.delegation = delegation,
  this.aspectId = aspectId,
  this.residueId = residueId,
  this.year = year,
  this.energyES = energyES,
  this.energyCA = energyCA,
  this.residueES = residueES,
  this.residueCA = residueCA,
  this.aspectES = aspectES,
  this.aspectCA = aspectCA,
  this.quantity = quantity,
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
      key: "energyES",
      type: "text",
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
]

export const emissionColumns = [
  {
    key: 'isSelected',
    type: 'isSelected',
    label: '',
  },
  {
    key: "delegation",
    type: 'label',
    label: "Emplaçament"
  },
  {
    key: "year",
    type: 'label',
    label: "Year"
  },
  {
    key: "quantity",
    type: "number",
    label: "Emissions"
  },
  { 
    key:"scopeOne",
    type: "number",
    label: "Scope one",
  },
  { 
    key:"scopeTwo",
    type: "number",
    label: "Scope two",
  },
  
  /* { 
    key: "jan",
    type: 'number',
    label: "January"
  },
 
  {
    key: "feb",
    type: 'number',
    label: "February"
  },
  
  {
    key: "mar",
    type: 'number',
    label: "March"
  },
 
  {
    key: "apr",
    type: 'number',
    label: "April"
  },
  
  {
    key: "may",
    type: 'number',
    label: "May"
  },
 
  {
    key: "jun",
    type: 'number',
    label: "Juny"
  },
  
  {
    key: "jul",
    type: 'number',
    label: "July"
  },
  
  {
    key: "aug",
    type: 'number',
    label: "August"
  },
  
  {
    key: "sep",
    type: 'number',
    label: "September"
  },
  
  {
    key: "oct",
    type: 'number',
    label: "October"
  }, */
  /* {
    key: "octScope1",
    type: 'text',
    label: "Scope 1"
  },
  {
    key: "octScope2",
    type: 'text',
    label: "Scope 2"
  }, */
 /*  {
    key: "nov",
    type: 'number',
    label: "November"
  }, */
 /*  {
    key: "novScope1",
    type: 'text',
    label: "Scope 1"
  },
  {
    key: "novScope2",
    type: 'text',
    label: "Scope 2"
  }, */
 /*  {
    key: "dec",
    type: 'number',
    label: "December"
  }, */
 /*  {
    key: "decScope1",
    type: 'text',
    label: "Scope 1"
  },
  {
    key: "decScope2",
    type: 'text',
    label: "Scope 2"
  }, */
  {
    key: "isEdit",
    type: "isEdit",
    label: ""
  },
]

export const residueColumns = [
  {
    key: 'isSelected',
    type: 'isSelected',
    label: '',
  },
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
    key: "residueES",
    type: "text",
    label: "Residue type"
  },

  {
    key: "jan",
    type: 'number',
    label: "January"
  },
  {
    key: "feb",
    type: 'number',
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

export interface graphConsumptionData {
  aspectId?: number,
  delegation?: string,
  year: string,
  energyName?: string,
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
  dec: string
}
