import React, { useState, useEffect } from 'react';
import { CreateExamDTO, AlternativeIdentificationType, ExamHeader } from '../types/Exam';
import { Question } from '../types/Question';
import { questionService } from '../services/questionService';

interface ExamFormProps {
  onSubmit: (data: CreateExamDTO) => void;
  onCancel: () => void;
  initialData?: {
    title: string;
    questionIds: string[];
    identificationType: AlternativeIdentificationType;
    header: ExamHeader;
  };
}

export const ExamForm: React.FC<ExamFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData 
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [identificationType, setIdentificationType] = useState<AlternativeIdentificationType>(
    initialData?.identificationType || 'letters'
  );
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(
    initialData?.questionIds || []
  );
  const [header, setHeader] = useState<ExamHeader>(
    initialData?.header || {
      discipline: '',
      professor: '',
      date: new Date().toISOString().split('T')[0],
      institution: ''
    }
  );
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const questions = await questionService.getAll();
      setAvailableQuestions(questions);
    } catch (err) {
      alert('Erro ao carregar questões');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Por favor, insira o título da prova');
      return;
    }

    if (!header.discipline.trim() || !header.professor.trim() || !header.date) {
      alert('Por favor, preencha todos os campos do cabeçalho (disciplina, professor e data)');
      return;
    }

    if (selectedQuestionIds.length === 0) {
      alert('Por favor, selecione pelo menos uma questão');
      return;
    }

    onSubmit({
      title,
      questionIds: selectedQuestionIds,
      identificationType,
      header
    });
  };

  const toggleQuestion = (questionId: string) => {
    if (selectedQuestionIds.includes(questionId)) {
      setSelectedQuestionIds(selectedQuestionIds.filter(id => id !== questionId));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, questionId]);
    }
  };

  const moveQuestionUp = (index: number) => {
    if (index === 0) return;
    const newIds = [...selectedQuestionIds];
    [newIds[index - 1], newIds[index]] = [newIds[index], newIds[index - 1]];
    setSelectedQuestionIds(newIds);
  };

  const moveQuestionDown = (index: number) => {
    if (index === selectedQuestionIds.length - 1) return;
    const newIds = [...selectedQuestionIds];
    [newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]];
    setSelectedQuestionIds(newIds);
  };

  if (loading) {
    return <div style={styles.loading}>Carregando questões...</div>;
  }

  if (availableQuestions.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>Não há questões cadastradas. Por favor, cadastre questões antes de criar uma prova.</p>
        <button onClick={onCancel} style={styles.cancelButton}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Título da Prova:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          placeholder="Digite o título da prova..."
        />
      </div>

      <div style={styles.headerSection}>
        <h3 style={styles.sectionTitle}>Informações do Cabeçalho</h3>
        <div style={styles.headerGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Instituição (opcional):</label>
            <input
              type="text"
              value={header.institution || ''}
              onChange={(e) => setHeader({ ...header, institution: e.target.value })}
              style={styles.input}
              placeholder="Nome da instituição..."
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Disciplina:*</label>
            <input
              type="text"
              value={header.discipline}
              onChange={(e) => setHeader({ ...header, discipline: e.target.value })}
              style={styles.input}
              placeholder="Ex: Matemática"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Professor(a):*</label>
            <input
              type="text"
              value={header.professor}
              onChange={(e) => setHeader({ ...header, professor: e.target.value })}
              style={styles.input}
              placeholder="Nome do professor"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Data:*</label>
            <input
              type="date"
              value={header.date}
              onChange={(e) => setHeader({ ...header, date: e.target.value })}
              style={styles.input}
            />
          </div>
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Tipo de Identificação das Alternativas:</label>
        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="letters"
              checked={identificationType === 'letters'}
              onChange={(e) => setIdentificationType(e.target.value as AlternativeIdentificationType)}
            />
            <span>
              <strong>Letras (A, B, C, D...)</strong>
              <br />
              <small>O aluno marcará as letras das alternativas escolhidas</small>
            </span>
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="powers"
              checked={identificationType === 'powers'}
              onChange={(e) => setIdentificationType(e.target.value as AlternativeIdentificationType)}
            />
            <span>
              <strong>Potências de 2 (1, 2, 4, 8, 16...)</strong>
              <br />
              <small>O aluno somará os valores das alternativas escolhidas</small>
            </span>
          </label>
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Selecione as Questões ({selectedQuestionIds.length} selecionada(s)):
        </label>
        <div style={styles.questionsContainer}>
          {availableQuestions.map((question) => (
            <div
              key={question.id}
              style={{
                ...styles.questionCard,
                ...(selectedQuestionIds.includes(question.id) ? styles.selectedQuestion : {})
              }}
              onClick={() => toggleQuestion(question.id)}
            >
              <input
                type="checkbox"
                checked={selectedQuestionIds.includes(question.id)}
                onChange={() => {}}
                style={styles.checkbox}
              />
              <div style={styles.questionContent}>
                <p style={styles.questionStatement}>{question.statement}</p>
                <small style={styles.questionMeta}>
                  {question.alternatives.length} alternativas
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedQuestionIds.length > 0 && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Ordem das Questões na Prova:</label>
          <div style={styles.orderList}>
            {selectedQuestionIds.map((qId, index) => {
              const question = availableQuestions.find(q => q.id === qId);
              return (
                <div key={qId} style={styles.orderItem}>
                  <span style={styles.orderNumber}>{index + 1}.</span>
                  <span style={styles.orderText}>
                    {question?.statement.substring(0, 60)}...
                  </span>
                  <div style={styles.orderButtons}>
                    <button
                      type="button"
                      onClick={() => moveQuestionUp(index)}
                      disabled={index === 0}
                      style={styles.orderButton}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveQuestionDown(index)}
                      disabled={index === selectedQuestionIds.length - 1}
                      style={styles.orderButton}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={styles.buttonGroup}>
        <button type="submit" style={styles.submitButton}>
          Salvar Prova
        </button>
        <button type="button" onClick={onCancel} style={styles.cancelButton}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  headerSection: {
    marginBottom: '25px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #dee2e6'
  },
  sectionTitle: {
    margin: '0 0 15px 0',
    fontSize: '16px',
    color: '#495057'
  },
  headerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold' as const,
    color: '#333',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '2px solid #ddd',
    cursor: 'pointer'
  },
  questionsContainer: {
    maxHeight: '400px',
    overflowY: 'auto' as const,
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '10px',
    backgroundColor: 'white'
  },
  questionCard: {
    display: 'flex',
    gap: '10px',
    padding: '12px',
    marginBottom: '8px',
    border: '2px solid #e0e0e0',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: 'white'
  },
  selectedQuestion: {
    borderColor: '#007bff',
    backgroundColor: '#e7f3ff'
  },
  checkbox: {
    marginTop: '3px',
    cursor: 'pointer'
  },
  questionContent: {
    flex: 1
  },
  questionStatement: {
    margin: 0,
    fontSize: '14px',
    color: '#333'
  },
  questionMeta: {
    color: '#666',
    fontSize: '12px'
  },
  orderList: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '10px'
  },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    marginBottom: '5px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  orderNumber: {
    fontWeight: 'bold' as const,
    minWidth: '30px'
  },
  orderText: {
    flex: 1,
    fontSize: '14px'
  },
  orderButtons: {
    display: 'flex',
    gap: '5px'
  },
  orderButton: {
    padding: '5px 10px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end'
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center' as const,
    padding: '20px',
    color: '#666'
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  }
};
