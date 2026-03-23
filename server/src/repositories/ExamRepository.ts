import { Exam, CreateExamDTO, UpdateExamDTO } from '../types/Exam';
import { v4 as uuidv4 } from 'uuid';

class ExamRepository {
  private exams: Exam[] = [];

  findAll(): Exam[] {
    return this.exams;
  }

  findById(id: string): Exam | undefined {
    return this.exams.find(e => e.id === id);
  }

  create(data: CreateExamDTO): Exam {
    const exam: Exam = {
      id: uuidv4(),
      title: data.title,
      questionIds: data.questionIds,
      identificationType: data.identificationType,
      header: data.header,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.exams.push(exam);
    return exam;
  }

  update(id: string, data: UpdateExamDTO): Exam | null {
    const index = this.exams.findIndex(e => e.id === id);
    
    if (index === -1) {
      return null;
    }

    const exam = this.exams[index];
    
    if (data.title !== undefined) {
      exam.title = data.title;
    }

    if (data.questionIds !== undefined) {
      exam.questionIds = data.questionIds;
    }

    if (data.identificationType !== undefined) {
      exam.identificationType = data.identificationType;
    }

    if (data.header !== undefined) {
      exam.header = data.header;
    }

    exam.updatedAt = new Date();
    this.exams[index] = exam;
    
    return exam;
  }

  delete(id: string): boolean {
    const index = this.exams.findIndex(e => e.id === id);
    
    if (index === -1) {
      return false;
    }

    this.exams.splice(index, 1);
    return true;
  }
}

export default new ExamRepository();
