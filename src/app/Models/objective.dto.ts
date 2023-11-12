export class ObjectiveDTO {
  Id!: number
  companyId: string
  companyDelegationId: number
  delegation: string
  aspectId!: number
  theRatioType: string
  isSelected: boolean
  isEdit: boolean
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
  energy!: number
  residueId!: number
  energyES!: string
  energyCA!: string
  residueES!: string
  residueCA!: string
  aspectES!: string
  aspectCA!: string

constructor(
  Id: number,
  companyId: string,
  companyDelegationId: number,
  delegation: string,
  aspectId: number,
  theRatioType: string,
  isSelected: boolean,
  isEdit: boolean,

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
) {
  this.Id = Id,
  this.companyId = companyId,
  this.companyDelegationId = companyDelegationId,
  this.delegation = delegation,
  this.aspectId = aspectId,
  this.isSelected = isSelected,
  this.isEdit = isEdit,

  this.theRatioType = theRatioType,
  this.energyES = energyES,
  this.energyCA = energyCA,
  this.residueES = residueES,
  this.residueCA = residueCA,
  this.aspectES = aspectES,
  this.aspectCA = aspectCA,
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

export const ObjectiveColumns = [
      {
        key: 'isSelected',
        type: 'isSelected',
        label: '',
      },
      {
        key: "id",
        type: "number",
        label: "ID"
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
          key: "nameES",
          type: "text",
          label: "Enviromental"
      },
      {
        key: "objectiveType",
        type: "text",
        label: "Tipo de RATIO"
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
