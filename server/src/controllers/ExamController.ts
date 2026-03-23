import { Request, Response } from 'express';
import examRepository from '../repositories/ExamRepository';
import questionRepository from '../repositories/QuestionRepository';
import { CreateExamDTO, UpdateExamDTO, ExamWithQuestions } from '../types/Exam';
import pdfGenerator from '../services/PDFGenerator';

export class ExamController {
  async index(req: Request, res: Response): Promise<Response> {
    const exams = examRepository.findAll();
    return res.json(exams);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const exam = examRepository.findById(id);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Buscar as questões associadas
    const questions = exam.questionIds
      .map(qId => questionRepository.findById(qId))
      .filter(q => q !== undefined);

    const examWithQuestions: ExamWithQuestions = {
      ...exam,
      questions
    };

    return res.json(examWithQuestions);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const data: CreateExamDTO = req.body;

    if (!data.title || !data.questionIds || data.questionIds.length === 0) {
      return res.status(400).json({ 
        error: 'Title and at least one question are required' 
      });
    }

    if (!data.identificationType || !['letters', 'powers'].includes(data.identificationType)) {
      return res.status(400).json({ 
        error: 'Identification type must be "letters" or "powers"' 
      });
    }

    if (!data.header || !data.header.discipline || !data.header.professor || !data.header.date) {
      return res.status(400).json({ 
        error: 'Header with discipline, professor, and date is required' 
      });
    }

    // Verificar se todas as questões existem
    const invalidQuestions = data.questionIds.filter(
      qId => !questionRepository.findById(qId)
    );

    if (invalidQuestions.length > 0) {
      return res.status(400).json({ 
        error: 'One or more questions not found',
        invalidQuestions 
      });
    }

    const exam = examRepository.create(data);
    return res.status(201).json(exam);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: UpdateExamDTO = req.body;

    if (data.questionIds) {
      // Verificar se todas as questões existem
      const invalidQuestions = data.questionIds.filter(
        qId => !questionRepository.findById(qId)
      );

      if (invalidQuestions.length > 0) {
        return res.status(400).json({ 
          error: 'One or more questions not found',
          invalidQuestions 
        });
      }
    }

    if (data.identificationType && !['letters', 'powers'].includes(data.identificationType)) {
      return res.status(400).json({ 
        error: 'Identification type must be "letters" or "powers"' 
      });
    }

    const exam = examRepository.update(id, data);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    return res.json(exam);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const deleted = examRepository.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    return res.status(204).send();
  }

  async preview(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const exam = examRepository.findById(id);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Buscar as questões com formatação para preview
    const questions = exam.questionIds
      .map(qId => questionRepository.findById(qId))
      .filter(q => q !== undefined);

    const preview = {
      ...exam,
      questions: questions.map((q, index) => ({
        number: index + 1,
        statement: q!.statement,
        alternatives: q!.alternatives.map((alt, altIndex) => ({
          identifier: exam.identificationType === 'letters' 
            ? String.fromCharCode(65 + altIndex) // A, B, C, D...
            : Math.pow(2, altIndex), // 1, 2, 4, 8...
          description: alt.description,
          isCorrect: alt.isCorrect
        })),
        answerSpace: exam.identificationType === 'letters'
          ? 'Alternativas marcadas: _______________'
          : 'Soma das alternativas: _______________'
      }))
    };

    return res.json(preview);
  }

  async generatePDF(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { numberOfCopies } = req.body;

    const exam = examRepository.findById(id);

    if (!exam) {
      res.status(404).json({ error: 'Exam not found' });
      return;
    }

    if (!numberOfCopies || numberOfCopies < 1 || numberOfCopies > 100) {
      res.status(400).json({ error: 'Number of copies must be between 1 and 100' });
      return;
    }

    // Buscar questões
    const questions = exam.questionIds
      .map(qId => questionRepository.findById(qId))
      .filter(q => q !== undefined) as any[];

    if (questions.length === 0) {
      res.status(400).json({ error: 'Exam has no valid questions' });
      return;
    }

    try {
      // Gerar cópias randomizadas
      const copies = pdfGenerator.generateRandomizedCopies(exam, questions, numberOfCopies);

      // Configurar headers da resposta
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="provas_${exam.title.replace(/\s/g, '_')}.pdf"`);

      // Gerar PDF com todas as cópias de uma vez
      await pdfGenerator.generatePDF(exam, copies, res);

      res.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error generating PDF' });
      }
    }
  }

  async generateAnswerKey(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { numberOfCopies } = req.body;

    const exam = examRepository.findById(id);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    if (!numberOfCopies || numberOfCopies < 1 || numberOfCopies > 100) {
      return res.status(400).json({ error: 'Number of copies must be between 1 and 100' });
    }

    // Buscar questões
    const questions = exam.questionIds
      .map(qId => questionRepository.findById(qId))
      .filter(q => q !== undefined) as any[];

    if (questions.length === 0) {
      return res.status(400).json({ error: 'Exam has no valid questions' });
    }

    try {
      // Gerar cópias randomizadas
      const copies = pdfGenerator.generateRandomizedCopies(exam, questions, numberOfCopies);

      // Gerar CSV
      const csv = pdfGenerator.generateCSV(exam, copies);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="gabarito_${exam.title.replace(/\s/g, '_')}.csv"`);
      return res.send(csv);
    } catch (error) {
      console.error('Error generating answer key:', error);
      return res.status(500).json({ error: 'Error generating answer key' });
    }
  }
}

export default new ExamController();
