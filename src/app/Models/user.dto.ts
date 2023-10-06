export class UserDTO {
  id?: string;
  access_token?: string
  name: string
  nif: string
  email: string
  password: string
  domicilio: string
  empresa!: string
  localidad!: string
  cpostal!: string
  cnae: string

  constructor(
    name: string,
    email: string,
    password: string,
    domicilio: string,
    nif: string,
    cnae: string
  ) {
    this.name = name
    this.email = email
    this.password = password
    this.domicilio = domicilio
    this.nif = nif
    this.cnae = cnae
  }
}
