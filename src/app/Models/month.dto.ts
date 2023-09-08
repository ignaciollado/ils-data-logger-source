export class MonthDTO {
  monthId?: number;
  nameES?: string;
  nameCA?: string;
  nameEN?: string;

  constructor(
    nameES: string,
    nameCA: string,
    nameEN: string,
  ) {
    this.nameES = nameES;
    this.nameCA = nameCA;
    this.nameEN = nameEN;
    }
}
