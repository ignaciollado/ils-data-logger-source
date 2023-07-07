export class UserDTO {
  id?: string;
  access_token?: string;
  name: string;
  email: string;
  password: string;

  constructor(
    name: string,
    email: string,
    password: string
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
