export class QuestionDTO {
    id: number
    vector_id: number
    type: "radio" | "checkbox"
    question_text_es: string
    question_text_ca: string
    tooltip_text_es: string
    tooltip_text_ca: string
    link?: string
    doc_1?: string
    doc_2?: string

    constructor(
        id: number,
        vector_id: number,
        type: "radio" | "checkbox",
        question_text_es: string,
        question_text_ca: string,
        tooltip_text_es: string,
        tooltip_text_ca: string,
        link?: string,
        doc_1?: string,
        doc_2?: string
    ) {
        this.id = id;
        this.vector_id = vector_id;
        this.type = type;
        this.question_text_es = question_text_es;
        this.question_text_ca = question_text_ca;
        this.tooltip_text_es = tooltip_text_es;
        this.tooltip_text_ca = tooltip_text_ca;
        this.link = link;
        this.doc_1 = doc_1;
        this.doc_2 = doc_2;
    }
}

export const questionColumns = [
    {
        key: 'question_text_es',
        type: 'url',
        label: 'Pregunta en castellano',
        label_cat: 'Pregunta en castellà'
    },
    {
        key: 'question_text_ca',
        type: 'scope',
        label: 'Pregunta en catalán',
        label_cat: 'Pregunta en català'
    },
    {
        key: 'type',
        type: 'radio',
        label: 'Tipo',
        label_cat: 'Tipus'
    },
    {
        key: 'vector_id',
        type: 'select',
        label: 'Vector',
        label_cat: 'Vector'
    },
    {
        key: 'tooltip_text_es',
        type: 'text-area',
        label: 'Texto de ayuda en castellano',
        label_cat: "Text d'ajuda en castellà"
    },
    {
        key: 'tooltip_text_ca',
        type: 'text-area',
        label: 'Texto de ayuda en catalán',
        label_cat: "Text d'ajuda en català"
    },
    {
        key: 'link',
        type: 'link',
        label: 'Enlace',
        label_cat: 'Enllaç'
    },
    {
        key: 'doc_1',
        type: 'doc',
        label: 'Primer documento',
        label_cat: 'Primer document'
    },
    {
        key: 'doc_2',
        type: 'doc',
        label: 'Segundo documento',
        label_cat: 'Segon document'
    },
    {
        key: 'isEdit',
        type: 'isEdit',
        label: '',
        label_cat: ''
    }
]