import axios from 'axios';
import { Exam, CreateExamDTO, UpdateExamDTO } from '../types/Exam';

const API_BASE_URL = '/api';

export const examService = {
  async getAll(): Promise<Exam[]> {
    const response = await axios.get(`${API_BASE_URL}/exams`);
    return response.data;
  },

  async getById(id: string): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/exams/${id}`);
    return response.data;
  },

  async create(data: CreateExamDTO): Promise<Exam> {
    const response = await axios.post(`${API_BASE_URL}/exams`, data);
    return response.data;
  },

  async update(id: string, data: UpdateExamDTO): Promise<Exam> {
    const response = await axios.put(`${API_BASE_URL}/exams/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/exams/${id}`);
  },

  async preview(id: string): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/exams/${id}/preview`);
    return response.data;
  },

  async generatePDF(id: string, numberOfCopies: number): Promise<Blob> {
    const response = await axios.post(
      `${API_BASE_URL}/exams/${id}/generate-pdf`,
      { numberOfCopies },
      { responseType: 'blob' }
    );
    return response.data;
  },

  async generateAnswerKey(id: string, numberOfCopies: number): Promise<Blob> {
    const response = await axios.post(
      `${API_BASE_URL}/exams/${id}/generate-answer-key`,
      { numberOfCopies },
      { responseType: 'blob' }
    );
    return response.data;
  }
};
