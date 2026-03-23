export type AlternativeIdentificationType = 'letters' | 'powers';

export interface ExamHeader {
  discipline: string;
  professor: string;
  date: string;
  institution?: string;
}

export interface Exam {
  id: string;
  title: string;
  questionIds: string[];
  identificationType: AlternativeIdentificationType;
  header: ExamHeader;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExamDTO {
  title: string;
  questionIds: string[];
  identificationType: AlternativeIdentificationType;
  header: ExamHeader;
}

export interface UpdateExamDTO {
  title?: string;
  questionIds?: string[];
  identificationType?: AlternativeIdentificationType;
  header?: ExamHeader;
}

export interface ExamWithQuestions extends Exam {
  questions: any[];
}

export interface GeneratePDFRequest {
  examId: string;
  numberOfCopies: number;
}
