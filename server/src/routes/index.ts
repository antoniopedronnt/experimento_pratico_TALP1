import { Router } from 'express';
import multer from 'multer';
import questionController from '../controllers/QuestionController';
import examController from '../controllers/ExamController';
import gradingController from '../controllers/GradingController';

const routes = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Question routes
routes.get('/questions', questionController.index);
routes.get('/questions/:id', questionController.show);
routes.post('/questions', questionController.create);
routes.put('/questions/:id', questionController.update);
routes.delete('/questions/:id', questionController.delete);

// Exam routes
routes.get('/exams', examController.index);
routes.get('/exams/:id', examController.show);
routes.get('/exams/:id/preview', examController.preview);
routes.post('/exams', examController.create);
routes.put('/exams/:id', examController.update);
routes.delete('/exams/:id', examController.delete);

// PDF Generation routes
routes.post('/exams/:id/generate-pdf', examController.generatePDF);
routes.post('/exams/:id/generate-answer-key', examController.generateAnswerKey);

// Grading routes
routes.post('/grading/grade', upload.fields([
  { name: 'answerKey', maxCount: 1 },
  { name: 'studentAnswers', maxCount: 1 }
]), gradingController.gradeExams);

routes.post('/grading/report', upload.fields([
  { name: 'answerKey', maxCount: 1 },
  { name: 'studentAnswers', maxCount: 1 }
]), gradingController.downloadGradeReport);

export default routes;
