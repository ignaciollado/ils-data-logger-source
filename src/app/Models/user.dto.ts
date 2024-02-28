export class UserDTO {
  id?: string;
  access_token?: string
  name: string
  nif: string
  email: string
  password: string
  domicilio: string
  empresa?: string
  localidad?: string
  cpostal?: string
  cnae: string
  activityIndicator: string
  isEdit: boolean
  isSelected: boolean

  constructor(
    name: string,
    email: string,
    password: string,
    domicilio: string,
    nif: string,
    cnae: string,
    activityIndicator: string,
    isEdit: boolean,
    isSelected: boolean,
  ) {
    this.name = name
    this.email = email
    this.password = password
    this.domicilio = domicilio
    this.nif = nif
    this.cnae = cnae
    this.activityIndicator = activityIndicator
    this.isSelected = isSelected,
    this.isEdit = isEdit
  }
}

export const userColumns = [
    {
      key: 'isSelected',
      type: 'isSelected',
      label: '',
    }, 
    {
      key: "name",
      type: "text",
      label: "Empresa"
    },
    /* {
      key: "nif",
      type: "text",
      label: "NIF"
    },
    {
      key: "domicilio",
      type: "text",
      label: "Domicilio"
    }, */
    {
      key: "email",
      type: "text",
      label: "User"
    },
    {
      key: "password",
      type: "text",
      label: "Password"
    },
    {
      key: "updated_at",
      type: "text",
      label: "Created"
    },
    {
      key: "isEdit",
      type: "isEdit",
      label: ""
    },
  ]
