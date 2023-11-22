export class QuestionDTO {
  key:               string;
  type:              string;
  questionTextES:    string;
  questionTextCA:    string;
  questionTooltipES: string;
  questionTooltipCA: string;
  link:              string;
  answers:           { [key: string]: Array<boolean | string> }[];

  constructor(
    key: string,
    type: string,
    questionTextES: string,
    questionTextCA: string,
    questionTooltipES: string,
    questionTooltipCA: string,
    link: string,
    answers: string[]
  ) {
    this.key = key
    this.type = type
    this.questionTextES = questionTextES
    this.questionTextCA = questionTextCA
    this.questionTooltipES = questionTooltipES
    this.questionTooltipCA = questionTooltipCA
    this.link = link
    this.answers = []
  }
}
