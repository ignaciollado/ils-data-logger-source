export class AnswerDTO {
  id: number
  companyId: number
  questionnaireId: number
  updated_at: Date
  userAnswers: userQuestionaire[];
}

export interface userQuestionaire {
  vectorId:          number;
  vectorName:        string;
  vectorGeneralRegulation: string[];
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