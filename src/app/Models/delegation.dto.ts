export class DelegationDTO {
  companyDelegationId?: number;
  companyId?: string | null;
  name: string;
  address: string;

  constructor(
    name: string,
    address: string
  ) {
    this.name = name;
    this.address = address;
  }
}

export interface MunicipalityDto {
  name: string;
  key:  string;
}
