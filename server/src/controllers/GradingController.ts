import { Request, Response } from 'express';
import gradingService from '../services/GradingService';
import { GradingMode } from '../types/Grading';

export class GradingController {
  async gradeExams(req: Request, res: Response): Promise<Response> {
    try {
      const { mode, identificationType } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files || !files['answerKey'] || !files['studentAnswers']) {
        return res.status(400).json({
          error: 'Both answer key and student answers CSV files are required'
        });
      }

      if (!mode || !['strict', 'proportional'].includes(mode)) {
        return res.status(400).json({
          error: 'Grading mode must be "strict" or "proportional"'
        });
      }

      if (!identificationType || !['letters', 'powers'].includes(identificationType)) {
        return res.status(400).json({
          error: 'Identification type must be "letters" or "powers"'
        });
      }

      // Ler conteúdo dos arquivos
      const answerKeyContent = files['answerKey'][0].buffer.toString('utf-8');
      const studentAnswersContent = files['studentAnswers'][0].buffer.toString('utf-8');

      // Parsear CSVs
      const answerKeys = gradingService.parseAnswerKeyCSV(answerKeyContent);
      const studentAnswers = gradingService.parseStudentAnswersCSV(studentAnswersContent);

      // Gerar relatório
      const report = gradingService.generateGradeReport(
        studentAnswers,
        answerKeys,
        mode as GradingMode,
        identificationType as 'letters' | 'powers'
      );

      return res.json(report);
    } catch (error: any) {
      console.error('Error grading exams:', error);
      return res.status(500).json({
        error: 'Error processing grading',
        details: error.message
      });
    }
  }

  async downloadGradeReport(req: Request, res: Response): Promise<void> {
    try {
      const { mode, identificationType } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files || !files['answerKey'] || !files['studentAnswers']) {
        res.status(400).json({
          error: 'Both answer key and student answers CSV files are required'
        });
        return;
      }

      // Ler conteúdo dos arquivos
      const answerKeyContent = files['answerKey'][0].buffer.toString('utf-8');
      const studentAnswersContent = files['studentAnswers'][0].buffer.toString('utf-8');

      // Parsear CSVs
      const answerKeys = gradingService.parseAnswerKeyCSV(answerKeyContent);
      const studentAnswers = gradingService.parseStudentAnswersCSV(studentAnswersContent);

      // Gerar relatório
      const report = gradingService.generateGradeReport(
        studentAnswers,
        answerKeys,
        mode as GradingMode,
        identificationType as 'letters' | 'powers'
      );

      // Gerar CSV
      const csv = gradingService.generateReportCSV(report);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="relatorio_notas.csv"');
      res.send(csv);
    } catch (error: any) {
      console.error('Error generating report:', error);
      res.status(500).json({
        error: 'Error generating report',
        details: error.message
      });
    }
  }
}

export default new GradingController();
