export class EnvironmentalDTO {
  idEnv: string
  nameES: string
  nameCA: string
  aspectId: number

  constructor(
    nameES: string,
    nameCA: string,
    aspectId: number,
    idEnv: string,
  ) {
    this.nameES = nameES
    this.nameCA = nameCA
    this.aspectId = aspectId
    this.idEnv = idEnv
    }
}
