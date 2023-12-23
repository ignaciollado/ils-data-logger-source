export class QuestionDTO {
  vectorId:           string
  vectorName:         string
  vectorGeneralRegulation: string[]
  questions:          Question[]
}

export interface Question {
  key:                string;
  type:               string;
  questionTextES:     string;
  questionTextCA:     string;
  questionDoc1:       string;
  questionDoc2:       string;
  questionTooltipES:  string;
  questionTooltipCA:  string;
  link:               string;
  answers:            Answer[];
}

export interface Answer {
  answerText:         string;
  answerTooltip:      string;
  answerRegulation:   string[];
  answerImage_1:      string;
  answerImage_2:      string;
}

export interface vectorStateDetail {
  vectorId: number;
  vectorName: string;
  vectorGeneralRegulation: string[];
  totalQuestions: number;
  totalAnswers: number;
}
