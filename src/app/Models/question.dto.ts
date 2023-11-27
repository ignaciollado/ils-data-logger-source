export class QuestionDTO {
  vectorId:           string
  vectorName:         string
  questions:          Question[]
}

export interface Question {
  questionNumber:    string;
  questionType:      string;
  questionTextES:    string;
  questionTextCA:    string;
  questionDoc:       string;
  questionTooltipES: string;
  questionTooltipCA: string;
  link:              string;
  answers:           Answer[];
}

export interface Answer {
  answerText:        string;
  answerTooltip:     string;
  answerRegulation:  string[];
  answerImage_1:     string;
  answerImage_2:     string;
}