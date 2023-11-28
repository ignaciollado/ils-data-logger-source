export class AnswerDTO {
  id: number
  companyId: number
  updated_at: Date
  questionaire: Questionaire[];
}

export interface Questionaire {
  vectorId:          number;
  vectorName:        string;
  answers:           Answers[];
}

export interface Answers {
  key:               number;
  type:              string;
  answered:          Boolean;
  questionTextES:    string;
  questionDoc:       string;
  questionTextCA:    string;
  questionTooltipES: string;
  questionTooltipCA: string;
  link:              string;
  questionaireAnswers: QuestionaireAnswers[];
}

export interface QuestionaireAnswers {
  answerText:     string;
  answerTooltip:  string;
  regulation:     string;
  image_1:        string;
  image_2:        string;
}