import React, { useState, useEffect } from 'react';
import { Question, CreateQuestionDTO } from '../types/Question';
import { questionService } from '../services/questionService';
import { QuestionForm } from '../components/QuestionForm';
import { QuestionList } from '../components/QuestionList';

export const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await questionService.getAll();
      setQuestions(data);
    } catch (err) {
      setError('Erro ao carregar questões. Verifique se o servidor está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateQuestionDTO) => {
    try {
      await questionService.create(data);
      await loadQuestions();
      setShowForm(false);
      alert('Questão criada com sucesso!');
    } catch (err) {
      alert('Erro ao criar questão');
      console.error(err);
    }
  };

  const handleUpdate = async (data: CreateQuestionDTO) => {
    if (!editingQuestion) return;

    try {
      await questionService.update(editingQuestion.id, data);
      await loadQuestions();
      setEditingQuestion(null);
      setShowForm(false);
      alert('Questão atualizada com sucesso!');
    } catch (err) {
      alert('Erro ao atualizar questão');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await questionService.delete(id);
      await loadQuestions();
      alert('Questão excluída com sucesso!');
    } catch (err) {
      alert('Erro ao excluir questão');
      console.error(err);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingQuestion(null);
  };

  const handleNewQuestion = () => {
    setEditingQuestion(null);
    setShowForm(true);
  };

  if (loading) {
    return <div style={styles.container}>Carregando...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Sistema de Gerenciamento de Questões</h1>
        {!showForm && (
          <button onClick={handleNewQuestion} style={styles.newButton}>
            + Nova Questão
          </button>
        )}
      </header>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {showForm && (
        <QuestionForm
          onSubmit={editingQuestion ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          initialData={editingQuestion ? {
            statement: editingQuestion.statement,
            alternatives: editingQuestion.alternatives.map(alt => ({
              description: alt.description,
              isCorrect: alt.isCorrect
            }))
          } : undefined}
        />
      )}

      <QuestionList
        questions={questions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #007bff'
  },
  title: {
    margin: 0,
    color: '#333',
    fontSize: '28px'
  },
  newButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  error: {
    padding: '15px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  }
};
