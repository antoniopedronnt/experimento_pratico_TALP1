import { Request, Response } from 'express';
import questionRepository from '../repositories/QuestionRepository';
import { CreateQuestionDTO, UpdateQuestionDTO } from '../types/Question';

export class QuestionController {
  async index(req: Request, res: Response): Promise<Response> {
    const questions = questionRepository.findAll();
    return res.json(questions);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const question = questionRepository.findById(id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    return res.json(question);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const data: CreateQuestionDTO = req.body;

    if (!data.statement || !data.alternatives || data.alternatives.length === 0) {
      return res.status(400).json({ 
        error: 'Statement and at least one alternative are required' 
      });
    }

    const question = questionRepository.create(data);
    return res.status(201).json(question);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: UpdateQuestionDTO = req.body;

    const question = questionRepository.update(id, data);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    return res.json(question);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const deleted = questionRepository.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Question not found' });
    }

    return res.status(204).send();
  }
}

export default new QuestionController();
