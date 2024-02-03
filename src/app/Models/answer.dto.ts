import { vectorStateDetail } from "./question.dto"
export class AnswerDTO {
  id: number
  companyId: number
  companyQuestionnaireId: number
  companyDelegationName: string
  companyDelegationId: number
  userAnswers: string
  completed: vectorStateDetail[]
  updated_at: Date
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
  answered:          boolean;
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
