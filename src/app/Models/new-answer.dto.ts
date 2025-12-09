export class AnswerDTO {
    id: number
    question_id: number
    text_es: string
    text_ca: string
    tooltip_text_es: string
    tooltip_text_ca: string
    image_1?: string
    image_2?: string
    regulations?: number[]

    constructor(
        id: number,
        question_id: number,
        text_es: string,
        text_ca: string,
        tooltip_text_es: string,
        tooltip_text_ca: string,
        image_1?: string,
        image_2?: string,
        regulations?: number[]
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