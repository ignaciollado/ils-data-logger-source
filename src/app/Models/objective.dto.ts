export class ObjectiveDTO {
  id?: number
  companyId: string
  companyDelegationId: number
  delegation?: string
  aspectId?: number
  chapterItemId?: string
  enviromentalDataName?: string
  theRatioType: string
  isSelected: boolean
  isEdit: boolean
  year: string
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

constructor(
  id: number,
  companyId: string,
  companyDelegationId: number,
  aspectId: number,
  chapterItemId: string,
  enviromentalDataName: string,
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
) {
  this.id = id,
  this.companyId = companyId,
  this.companyDelegationId = companyDelegationId,
  this.chapterItemId = chapterItemId,
  this.enviromentalDataName = enviromentalDataName,
  this.aspectId = aspectId,
  this.isSelected = isSelected,
  this.isEdit = isEdit,
  this.theRatioType = theRatioType,
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
        key: "enviromentalDataName",
        type: "text",
        label: "Environmental data"
      },
      {
        key: "theRatioType",
        type: "text",
        label: "RATIO type"
      },
      {
        key: "jan",
        type: "number",
        label: "01"
      },
      {
        key: "feb",
        type: "number",
        label: "02"
      },
      {
        key: "mar",
        type: "number",
        label: "03"
      },
      {
        key: "apr",
        type: "number",
        label: "04"
      },
      {
        key: "may",
        type: "number",
        label: "05"
      },
      {
        key: "jun",
        type: "number",
        label: "06"
      },
      {
        key: "jul",
        type: "number",
        label: "07"
      },
      {
        key: "aug",
        type: "number",
        label: "08"
      },
      {
        key: "sep",
        type: "number",
        label: "09"
      },
      {
        key: "oct",
        type: "number",
        label: "10"
      },
      {
        key: "nov",
        type: "number",
        label: "11"
      },
      {
        key: "dec",
        type: "number",
        label: "12"
      },
      {
        key: "isEdit",
        type: "isEdit",
        label: ""
      },
  ];
