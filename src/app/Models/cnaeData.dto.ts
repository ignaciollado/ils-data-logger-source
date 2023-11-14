export class CnaeDataDTO {
    Id: number
    companyId: number
    companyDelegationId: number
    cnaeUnitSelected: string

    isEdit: boolean
    isSelected: boolean
    year: string
    jan: number
    feb: number
    mar: number
    apr: number
    may: number
    jun: number
    jul: number
    aug: number
    sep: number
    oct: number
    nov: number
    dec: number
    
  constructor (
    Id: number,
    companyId: number,
    companyDelegationId: number,
    cnaeUnitSelected: string,
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
  ) {
    this.companyId = companyId,
    this.companyDelegationId = companyDelegationId,
    this.cnaeUnitSelected = cnaeUnitSelected,
    this.isEdit = isEdit,
    this.isSelected = isSelected,
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

export const CnaeColumns = [
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
    key: "cnaeUnitSelected",
    type: "label",
    label: "CNAE unit"
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
