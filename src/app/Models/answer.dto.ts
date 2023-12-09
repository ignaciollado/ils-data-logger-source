export class AnswerDTO {
  id: number
  companyId: number
  questionnaireId: number
  vectorId: string
  questionId: string
  questionAnswer: string
  regulationToApply: string
  mustBeApplied: boolean
  updated_at: Date
}

export interface userQuestionaire {
  vectorId:          number;
  vectorName:        string;
  questionaireAnswers: QuestionaireAnswers[];
}

export interface QuestionaireAnswers {
  key:               number;
  type:              string;
  answered:          Boolean;
  questionTextES:    string;
  questionDoc:       string;
  questionTextCA:    string;
  questionTooltipES: string;
  questionTooltipCA: string;
  link:              string;
  answer: Answer[];
}

export interface Answer {
  answerText:     string;
  answerTooltip:  string;
  regulation:     string;
  image_1:        string;
  image_2:        string;
}