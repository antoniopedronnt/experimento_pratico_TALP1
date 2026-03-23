import axios from 'axios';
import { Question, CreateQuestionDTO, UpdateQuestionDTO } from '../types/Question';

const API_BASE_URL = '/api';

export const questionService = {
  async getAll(): Promise<Question[]> {
    const response = await axios.get(`${API_BASE_URL}/questions`);
    return response.data;
  },

  async getById(id: string): Promise<Question> {
    const response = await axios.get(`${API_BASE_URL}/questions/${id}`);
    return response.data;
  },

  async create(data: CreateQuestionDTO): Promise<Question> {
    const response = await axios.post(`${API_BASE_URL}/questions`, data);
    return response.data;
  },

  async update(id: string, data: UpdateQuestionDTO): Promise<Question> {
    const response = await axios.put(`${API_BASE_URL}/questions/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/questions/${id}`);
  }
};
