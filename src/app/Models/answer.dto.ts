export class AnswerDTO {
  id: number
  companyId: number
  updated_at: Date
  answers: Answer[];
}

export interface Answer {
  questionNumber:    string;
  questionType:      string;
  questionTextES:    string;
  questionTextCA:    string;
  questionDoc:       string;
  questionTooltipES: string;
  questionTooltipCA: string;
  link:              string;
  answers:           AnswerItem[];
}

export interface AnswerItem {
  answered:          Boolean;
  answerText:        string;
  answerTooltip:     string;
  answerRegulation:  string[];
  answerImage_1:     string;
  answerImage_2:     string;
}