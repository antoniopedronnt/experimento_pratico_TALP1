import React, { useState, useEffect } from 'react';
import { Exam, CreateExamDTO } from '../types/Exam';
import { examService } from '../services/examService';
import { ExamForm } from '../components/ExamForm';
import { ExamList } from '../components/ExamList';
import { ExamPreview } from '../components/ExamPreview';
import { GeneratePDFModal } from '../components/GeneratePDFModal';

export const ExamsPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<any | null>(null);
  const [previewExamId, setPreviewExamId] = useState<string | null>(null);
  const [generateExam, setGenerateExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await examService.getAll();
      setExams(data);
    } catch (err) {
      setError('Erro ao carregar provas. Verifique se o servidor está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateExamDTO) => {
    try {
      await examService.create(data);
      await loadExams();
      setShowForm(false);
      alert('Prova criada com sucesso!');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao criar prova';
      alert(message);
      console.error(err);
    }
  };

  const handleUpdate = async (data: CreateExamDTO) => {
    if (!editingExam) return;

    try {
      await examService.update(editingExam.id, data);
      await loadExams();
      setEditingExam(null);
      setShowForm(false);
      alert('Prova atualizada com sucesso!');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao atualizar prova';
      alert(message);
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await examService.delete(id);
      await loadExams();
      alert('Prova excluída com sucesso!');
    } catch (err) {
      alert('Erro ao excluir prova');
      console.error(err);
    }
  };

  const handleView = (exam: Exam) => {
    setPreviewExamId(exam.id);
  };

  const handleGenerate = (exam: Exam) => {
    setGenerateExam(exam);
  };

  const handleEdit = async (exam: Exam) => {
    try {
      const examWithQuestions = await examService.getById(exam.id);
      setEditingExam(examWithQuestions);
      setShowForm(true);
    } catch (err) {
      alert('Erro ao carregar dados da prova');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExam(null);
  };

  const handleNewExam = () => {
    setEditingExam(null);
    setShowForm(true);
  };

  if (loading) {
    return <div style={styles.container}>Carregando...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Gerenciamento de Provas</h1>
        {!showForm && (
          <button onClick={handleNewExam} style={styles.newButton}>
            + Nova Prova
          </button>
        )}
      </header>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {showForm && (
        <ExamForm
          onSubmit={editingExam ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          initialData={editingExam ? {
            title: editingExam.title,
            questionIds: editingExam.questionIds,
            identificationType: editingExam.identificationType,
            header: editingExam.header
          } : undefined}
        />
      )}

      <ExamList
        exams={exams}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onGenerate={handleGenerate}
      />

      {previewExamId && (
        <ExamPreview
          examId={previewExamId}
          onClose={() => setPreviewExamId(null)}
        />
      )}

      {generateExam && (
        <GeneratePDFModal
          examId={generateExam.id}
          examTitle={generateExam.title}
          onClose={() => setGenerateExam(null)}
        />
      )}
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
    borderBottom: '2px solid #28a745'
  },
  title: {
    margin: 0,
    color: '#333',
    fontSize: '28px'
  },
  newButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
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
