import React from 'react';
import { Exam } from '../types/Exam';

interface ExamListProps {
  exams: Exam[];
  onView: (exam: Exam) => void;
  onEdit: (exam: Exam) => void;
  onDelete: (id: string) => void;
  onGenerate: (exam: Exam) => void;
}

export const ExamList: React.FC<ExamListProps> = ({ 
  exams, 
  onView,
  onEdit, 
  onDelete,
  onGenerate
}) => {
  if (exams.length === 0) {
    return (
      <div style={styles.empty}>
        <p>Nenhuma prova cadastrada ainda.</p>
      </div>
    );
  }

  return (
    <div style={styles.list}>
      {exams.map((exam) => (
        <div key={exam.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.title}>{exam.title}</h3>
              <div style={styles.metadata}>
                <span style={styles.badge}>
                  {exam.questionIds.length} {exam.questionIds.length === 1 ? 'questão' : 'questões'}
                </span>
                <span style={styles.badge}>
                  {exam.identificationType === 'letters' ? 'Letras (A, B, C...)' : 'Potências (1, 2, 4...)'}
                </span>
                {exam.header?.discipline && (
                  <span style={styles.badge}>
                    {exam.header.discipline}
                  </span>
                )}
              </div>
            </div>
            <div style={styles.actions}>
              <button onClick={() => onGenerate(exam)} style={styles.generateButton} title="Gerar PDFs">
                📄 Gerar
              </button>
              <button onClick={() => onView(exam)} style={styles.viewButton}>
                Visualizar
              </button>
              <button onClick={() => onEdit(exam)} style={styles.editButton}>
                Editar
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja excluir esta prova?')) {
                    onDelete(exam.id);
                  }
                }} 
                style={styles.deleteButton}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '15px'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '20px',
    color: '#333'
  },
  metadata: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#e9ecef',
    borderRadius: '12px',
    fontSize: '13px',
    color: '#495057'
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
    flexWrap: 'wrap' as const
  },
  generateButton: {
    padding: '8px 16px',
    backgroundColor: '#6f42c1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const
  },
  viewButton: {
    padding: '8px 16px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  empty: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#666',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  }
};
