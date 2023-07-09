export class AspectDTO {
  aspectId!: number
  nameES: string
  nameCA: string

  createAt!: Date
  updatedAt!: Date

  constructor(
    nameES: string,
    nameCA: string,
  ) {
    this.nameES = nameES
    this.nameCA = nameCA

    }
}
