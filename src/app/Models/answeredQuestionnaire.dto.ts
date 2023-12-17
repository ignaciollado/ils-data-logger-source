export interface answeredQuestionnaire {
  vectorId:    number;
  regulations: Regulation[];
}

export interface Regulation {
  regulation: RegulationRegulation[];
}

export interface RegulationRegulation {
  q1?:  string[];
  q2?:  string[];
  q3?:  string[];
  q4?:  string[];
  q5?:  string[];
  q6?:  string[];
  q7?:  string[];
  q8?:  string[];
  q9?:  string[];
  q10?: string[];
  q11?: string[];
}

export interface questionnaireFinalStateDTO {
  questionnaireId:         number;
  questionnaireCompleted:  boolean;
}
