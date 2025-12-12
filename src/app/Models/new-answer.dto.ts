export class AnswerDTO {
    id: number
    question_id: number
    text_es: string
    text_ca: string
    tooltip_text_es: string
    tooltip_text_ca: string
    image_1?: string
    image_2?: string
    regulations?: string

    constructor(
        id: number,
        question_id: number,
        text_es: string,
        text_ca: string,
        tooltip_text_es: string,
        tooltip_text_ca: string,
        image_1?: string,
        image_2?: string,
        regulations?: string
    ) {
        this.id = id;
        this.question_id = question_id;
        this.text_es = text_es;
        this.text_ca = text_ca;
        this.tooltip_text_es = tooltip_text_es;
        this.tooltip_text_ca = tooltip_text_ca;
        this.image_1 = image_1;
        this.image_2 = image_2;
        this.regulations = regulations;
    }
}

export const answersColumns = [
    {
        key: "text_es",
        type: "scope",
        label: "Respuesta en castellano",
        label_ca: "Resposta en castellà"
    },
    {
        key: "text_ca",
        type: "scope",
        label: "Respuesta en catalán",
        label_ca: "Resposta en català"
    },
    {
        key: "question_id",
        type: "select",
        label: "Pregunta vinculada",
        label_ca: "Pregunta vinculada"
    },
    {
        key: "regulations",
        type: "select-multiple",
        label: "Normativa añadida",
        label_ca: "Normativa afegida"
    },
    {
        key: "tooltip_text_es",
        type: "text-area",
        label: "Texto de ayuda en castellano",
        label_ca: "Text d'ajuda en castellà"
    },
    {
        key: "tooltip_text_ca",
        type: "text-area",
        label: "Texto de ayuda en catalán",
        label_ca: "Text d'ajuda en català"
    },
    {
        key: "image_1",
        type: "scope",
        label: "Primera imagen",
        label_ca: "Primera imatge"
    },
    {
        key: "image_2",
        type: "scope",
        label: "Segunda imagen",
        label_ca: "Segona imatge"
    },
    {
        key: "isEdit",
        type: "isEdit",
        label: "",
        label_ca: ""
    },
]