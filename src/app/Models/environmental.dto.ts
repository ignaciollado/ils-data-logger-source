export class EnvironmentalDTO {
  idEnv: number
  nameES: string
  nameCA: string
  aspect: number

  constructor(
    nameES: string,
    nameCA: string,
    aspect: number,
    idEnv: number,
  ) {
    this.nameES = nameES
    this.nameCA = nameCA
    this.aspect = aspect
    this.idEnv = idEnv
    }
}
