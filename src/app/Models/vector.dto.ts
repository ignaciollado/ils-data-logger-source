export class VectorDTO {
    id: number
    name_es: string
    name_ca: string
    general_regulations: string


    constructor(id: number, name_es: string, name_ca: string, general_regulations: string) {
        this.id = id;
        this.name_es = name_es;
        this.name_ca = name_ca;
        this.general_regulations = general_regulations;
    }
}
