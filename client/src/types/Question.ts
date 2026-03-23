export interface Alternative {
  id: string;
  description: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  statement: string;
  alternatives: Alternative[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuestionDTO {
  statement: string;
  alternatives: Omit<Alternative, 'id'>[];
}

export interface UpdateQuestionDTO {
  statement?: string;
  alternatives?: Omit<Alternative, 'id'>[];
}
