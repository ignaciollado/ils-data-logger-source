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