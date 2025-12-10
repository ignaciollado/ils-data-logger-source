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

export const vectorColumns = [
    {
        key: 'name_es',
        type: 'url',
        label: 'Nombre castellano',
        label_cat: 'Nom castellà'
    },
    {
        key: 'name_ca',
        type: 'scope',
        label: 'Nombre catalán',
        label_cat: 'Nom català'
    },
    {
        key: 'general_regulations',
        type: 'select',
        label: 'Normativa por defecto',
        label_cat: 'Normativa per defecte'
    },
    {
        key: 'isEdit',
        type: 'isEdit',
        label: '',
        label_cat: ''
    }
]
