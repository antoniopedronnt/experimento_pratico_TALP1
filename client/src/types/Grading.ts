export type GradingMode = 'strict' | 'proportional';

export interface GradeReport {
  gradingMode: GradingMode;
  studentGrades: StudentGrade[];
  statistics: {
    average: number;
    median: number;
    highest: number;
    lowest: number;
    passRate: number;
  };
}

export interface StudentGrade {
  examNumber: number;
  studentName?: string;
  studentCPF?: string;
  questionGrades: QuestionGrade[];
  totalScore: number;
  maxScore: number;
  percentage: number;
}

export interface QuestionGrade {
  questionNumber: number;
  studentAnswer: string;
  correctAnswer: string;
  score: number;
  maxScore: number;
}
