import axios from 'axios';
import { GradeReport, GradingMode } from '../types/Grading';

const API_BASE_URL = '/api';

export const gradingService = {
  async gradeExams(
    answerKeyFile: File,
    studentAnswersFile: File,
    mode: GradingMode,
    identificationType: 'letters' | 'powers'
  ): Promise<GradeReport> {
    const formData = new FormData();
    formData.append('answerKey', answerKeyFile);
    formData.append('studentAnswers', studentAnswersFile);
    formData.append('mode', mode);
    formData.append('identificationType', identificationType);

    const response = await axios.post(`${API_BASE_URL}/grading/grade`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  },

  async downloadGradeReport(
    answerKeyFile: File,
    studentAnswersFile: File,
    mode: GradingMode,
    identificationType: 'letters' | 'powers'
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append('answerKey', answerKeyFile);
    formData.append('studentAnswers', studentAnswersFile);
    formData.append('mode', mode);
    formData.append('identificationType', identificationType);

    const response = await axios.post(`${API_BASE_URL}/grading/report`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'blob'
    });

    return response.data;
  }
};
