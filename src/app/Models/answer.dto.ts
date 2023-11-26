export class AnswerDTO {
  vector:    string;
  answers: Answer[];
}

export interface Answer {
  key:               string;
  answers:           Answer[];
}

export interface Answer {
  answerText:       string;
  selected:         boolean;
}
