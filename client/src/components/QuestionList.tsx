import React from 'react';
import { Question } from '../types/Question';

interface QuestionListProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({ 
  questions, 
  onEdit, 
  onDelete 
}) => {
  if (questions.length === 0) {
    return (
      <div style={styles.empty}>
        <p>Nenhuma questão cadastrada ainda.</p>
      </div>
    );
  }

  return (
    <div style={styles.list}>
      {questions.map((question) => (
        <div key={question.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.statement}>{question.statement}</h3>
            <div style={styles.actions}>
              <button onClick={() => onEdit(question)} style={styles.editButton}>
                Editar
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja excluir esta questão?')) {
                    onDelete(question.id);
                  }
                }} 
                style={styles.deleteButton}
              >
                Excluir
              </button>
            </div>
          </div>
          <div style={styles.alternatives}>
            {question.alternatives.map((alt, index) => (
              <div 
                key={alt.id} 
                style={{
                  ...styles.alternative,
                  ...(alt.isCorrect ? styles.correctAlternative : {})
                }}
              >
                <span style={styles.alternativeLetter}>
                  {String.fromCharCode(65 + index)})
                </span>
                <span>{alt.description}</span>
                {alt.isCorrect && (
                  <span style={styles.correctBadge}>✓ Correta</span>
                )}
              </div>
            ))}
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
    gap: '20px'
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
    marginBottom: '15px'
  },
  statement: {
    margin: 0,
    fontSize: '18px',
    color: '#333',
    flex: 1,
    marginRight: '20px'
  },
  actions: {
    display: 'flex',
    gap: '10px'
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
  alternatives: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  alternative: {
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  correctAlternative: {
    backgroundColor: '#d4edda',
    borderLeft: '3px solid #28a745'
  },
  alternativeLetter: {
    fontWeight: 'bold',
    minWidth: '25px'
  },
  correctBadge: {
    marginLeft: 'auto',
    padding: '4px 8px',
    backgroundColor: '#28a745',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  empty: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#666',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  }
};
