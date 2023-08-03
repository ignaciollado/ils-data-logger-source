export class JwtDTO {
  iat: string;
  exp: string;
  iss: string;
  aud: string;
  data: JSON

  constructor(
    iat: string,
    exp: string,
    iss: string,
    aud: string,
    data: JSON
  ) {
    this.iat = iat
    this.exp = exp
    this.iss = iss
    this.aud = aud
    this.data = data
  }
}
