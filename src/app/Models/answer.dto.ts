export class AnswerDTO {
  id: number
  componyId: number
  updated_at: Date
  answers: Answer[];
}

export interface Answer {
  vector:   number
  key:      string;
  answers:  Answer[];
}

export interface Answer {
  answerText:       string;
  selected:         boolean;
}
