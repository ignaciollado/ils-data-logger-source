export class CnaeDTO {
    sector: string
    subsector: string
    cnaeCode: string
    activityIndicator: string[]
    emissionIndicator: string[]

  constructor(
    sector: string,
    subsector: string,
    cnaeCode: string,
    activityIndicator: string[],
    emissionIndicator: string[]
  ) {
    this.sector = sector
    this.subsector = subsector
    this.cnaeCode = cnaeCode
    this.activityIndicator = activityIndicator
    this.emissionIndicator = emissionIndicator
  }
}
