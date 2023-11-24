export class QuestionDTO {
  key:             string;
  type:            string;
  questionTextES:  string;
  questionImage:   string;
  questionTextCA:  string;
  questionTextEN:  string;
  questionTooltip: string;
  link:            string;
  answers:         Answer[];
}
export interface Answer {
  answerText:       string;
  answerTooltip:    string;
  answerRegulation: string[];
  answerImage_1:    string;
  answerImage_2:    string;
}
