import React, { useState, useEffect } from 'react';
import { examService } from '../services/examService';

interface ExamPreviewProps {
  examId: string;
  onClose: () => void;
}

export const ExamPreview: React.FC<ExamPreviewProps> = ({ examId, onClose }) => {
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreview();
  }, [examId]);

  const loadPreview = async () => {
    try {
      const data = await examService.preview(examId);
      setPreview(data);
    } catch (err) {
      alert('Erro ao carregar preview da prova');
      console.error(err);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Carregando preview...</div>;
  }

  if (!preview) {
    return null;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Preview da Prova</h2>
          <button onClick={onClose} style={styles.closeButton}>
            ✕
          </button>
        </div>

        <div style={styles.content}>
          <div style={styles.examHeader}>
            <h1 style={styles.examTitle}>{preview.title}</h1>
            <p style={styles.instructions}>
              {preview.identificationType === 'letters' 
                ? 'Marque as letras das alternativas corretas no espaço indicado.'
                : 'Some os valores das alternativas corretas e escreva o resultado no espaço indicado.'}
            </p>
          </div>

          {preview.questions.map((question: any) => (
            <div key={question.number} style={styles.question}>
              <div style={styles.questionHeader}>
                <strong>Questão {question.number}:</strong> {question.statement}
              </div>

              <div style={styles.alternatives}>
                {question.alternatives.map((alt: any) => (
                  <div 
                    key={alt.identifier} 
                    style={{
                      ...styles.alternative,
                      ...(alt.isCorrect ? styles.correctAlternative : {})
                    }}
                  >
                    <span style={styles.identifier}>
                      {preview.identificationType === 'letters' 
                        ? `${alt.identifier})` 
                        : `(${alt.identifier})`}
                    </span>
                    {alt.description}
                    {alt.isCorrect && (
                      <span style={styles.correctBadge}> ✓ CORRETA</span>
                    )}
                  </div>
                ))}
              </div>

              <div style={styles.answerSpace}>
                {question.answerSpace}
              </div>
            </div>
          ))}

          {preview.identificationType === 'powers' && (
            <div style={styles.helpBox}>
              <strong>Lembre-se:</strong> Para questões com potências de 2, some apenas os valores 
              das alternativas que você considerar corretas. Por exemplo, se você marcar as alternativas 
              (2) e (8), a resposta seria 10.
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.backButton}>
            Fechar Preview
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '2px solid #e0e0e0'
  },
  title: {
    margin: 0,
    fontSize: '24px',
    color: '#333'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '0',
    width: '30px',
    height: '30px'
  },
  content: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '20px'
  },
  examHeader: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #007bff'
  },
  examTitle: {
    fontSize: '28px',
    margin: '0 0 10px 0',
    color: '#333'
  },
  instructions: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic'
  },
  question: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #dee2e6'
  },
  questionHeader: {
    fontSize: '16px',
    marginBottom: '15px',
    lineHeight: '1.5'
  },
  alternatives: {
    marginLeft: '20px',
    marginBottom: '15px'
  },
  alternative: {
    padding: '8px 0',
    fontSize: '14px',
    lineHeight: '1.5'
  },
  correctAlternative: {
    color: '#28a745',
    fontWeight: 500
  },
  identifier: {
    fontWeight: 'bold',
    marginRight: '8px',
    minWidth: '30px',
    display: 'inline-block'
  },
  correctBadge: {
    color: '#28a745',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  answerSpace: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: 'white',
    border: '2px dashed #007bff',
    borderRadius: '4px',
    fontStyle: 'italic',
    color: '#666'
  },
  helpBox: {
    padding: '15px',
    backgroundColor: '#d1ecf1',
    border: '1px solid #bee5eb',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#0c5460',
    marginTop: '20px'
  },
  footer: {
    padding: '20px',
    borderTop: '2px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'center'
  },
  backButton: {
    padding: '10px 30px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center' as const,
    padding: '40px',
    fontSize: '16px',
    color: '#666'
  }
};
