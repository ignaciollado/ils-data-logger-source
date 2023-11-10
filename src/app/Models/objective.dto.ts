export class ObjectiveDTO {
  id!: number
  companyId: string
  companyDelegationId: number
  delegation: string
  aspectId!: number
  theRatioType: string
  isSelected: boolean
  year: string
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

constructor(
  id: number,
  companyId: string,
  companyDelegationId: number,
  delegation: string,
  aspectId: number,
  theRatioType: string,
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
) {
  this.id = id,
  this.companyId = companyId,
  this.companyDelegationId = companyDelegationId,
  this.delegation = delegation,
  this.aspectId = aspectId,
  this.isSelected = isSelected,
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
          label: "Enviromental"
      },
      {
        key: "objectiveType",
        type: "text",
        label: "Tipo de RATIO"
    },
      {
        key: "jan",
        type: "text",
        label: "January"
      },
      {
        key: "feb",
        type: "text",
        label: "February"
      },
      {
        key: "mar",
        type: "text",
        label: "March"
      },
      {
        key: "apr",
        type: "text",
        label: "April"
      },
      {
        key: "may",
        type: "text",
        label: "May"
      },
      {
        key: "jun",
        type: "text",
        label: "June"
      },  
      {
        key: "jul",
        type: "text",
        label: "July"
      },
      {
        key: "aug",
        type: "text",
        label: "August"
      },
      {
        key: "sep",
        type: "text",
        label: "September"
      },
      {
        key: "oct",
        type: "text",
        label: "October"
      },
      {
        key: "nov",
        type: "text",
        label: "November"
      },
      {
        key: "dec",
        type: "text",
        label: "December"
      },
      {
        key: "isEdit",
        type: "isEdit",
        label: ""
      },
  ];