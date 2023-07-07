export class ResidueDTO {
  residueId!: string
  nameES: string
  nameCA: string
  reuse: boolean
  recycling: boolean
  incineration: boolean
  dump: boolean
  compost: boolean

  constructor(
    nameES: string,
    nameCA: string,
    reuse: boolean,
    recycling: boolean,
    incineration: boolean,
    dump: boolean,
    compost: boolean
  ) {
    this.nameES = nameES
    this.nameCA = nameCA
    this.reuse = reuse
    this.recycling = recycling
    this.incineration = incineration
    this.dump = dump
    this.compost = compost
    }
}
