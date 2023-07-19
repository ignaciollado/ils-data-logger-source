export class UserDTO {
  id?: string;
  access_token?: string;
  name: string;
  nif: string;
  email: string;
  password: string;
  domicilio: string;
  empresa!: string;
  localidad!: string;
  cpostal!: string

  constructor(
    name: string,
    email: string,
    password: string,
    domicilio: string,
    nif: string
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.domicilio = domicilio;
    this.nif = nif;
  }
}
