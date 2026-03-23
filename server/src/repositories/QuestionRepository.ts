import { Question, CreateQuestionDTO, UpdateQuestionDTO, Alternative } from '../types/Question';
import { v4 as uuidv4 } from 'uuid';

class QuestionRepository {
  private questions: Question[] = [];

  findAll(): Question[] {
    return this.questions;
  }

  findById(id: string): Question | undefined {
    return this.questions.find(q => q.id === id);
  }

  create(data: CreateQuestionDTO): Question {
    const alternatives: Alternative[] = data.alternatives.map(alt => ({
      id: uuidv4(),
      description: alt.description,
      isCorrect: alt.isCorrect
    }));

    const question: Question = {
      id: uuidv4(),
      statement: data.statement,
      alternatives,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.questions.push(question);
    return question;
  }

  update(id: string, data: UpdateQuestionDTO): Question | null {
    const index = this.questions.findIndex(q => q.id === id);
    
    if (index === -1) {
      return null;
    }

    const question = this.questions[index];
    
    if (data.statement) {
      question.statement = data.statement;
    }

    if (data.alternatives) {
      question.alternatives = data.alternatives.map(alt => ({
        id: uuidv4(),
        description: alt.description,
        isCorrect: alt.isCorrect
      }));
    }

    question.updatedAt = new Date();
    this.questions[index] = question;
    
    return question;
  }

  delete(id: string): boolean {
    const index = this.questions.findIndex(q => q.id === id);
    
    if (index === -1) {
      return false;
    }

    this.questions.splice(index, 1);
    return true;
  }
}

export default new QuestionRepository();
