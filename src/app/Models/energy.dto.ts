export class EnergyDTO {
  energyId!: string
  nameES: string
  nameCA: string
  aspectId: number
  unit: string
  pci: number
  createAt!: Date
  updatedAt!: Date

  constructor(
    nameES: string,
    nameCA: string,
    aspectId: number,
    unit: string,
    pci: number,
    createAt: Date,
    updatedAt: Date
  ) {
    this.nameES = nameES
    this.nameCA = nameCA
    this.aspectId = aspectId
    this.unit = unit
    this.pci = pci
    this.createAt = createAt
    this.updatedAt = updatedAt
    }
}
