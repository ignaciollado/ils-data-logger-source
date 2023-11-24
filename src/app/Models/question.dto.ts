export class QuestionDTO {
  vector:    string;
  questions: Question[];
}

export interface Question {
  key:               string;
  type:              string;
  questionTextES:    string;
  questionDoc:       string;
  questionTextCA:    string;
  questionTooltipES: string;
  questionTooltipCA: string;
  link:              string;
  answers:           Answer[];
}

export interface Answer {
  answerText:       string;
  answerTooltip:    string;
  answerRegulation: string[];
  answerImage_1:    string;
  answerImage_2:    string;
}
