import React, { useState } from 'react';
import { CreateQuestionDTO } from '../types/Question';

interface QuestionFormProps {
  onSubmit: (data: CreateQuestionDTO) => void;
  onCancel: () => void;
  initialData?: {
    statement: string;
    alternatives: { description: string; isCorrect: boolean }[];
  };
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData 
}) => {
  const [statement, setStatement] = useState(initialData?.statement || '');
  const [alternatives, setAlternatives] = useState(
    initialData?.alternatives || [
      { description: '', isCorrect: false },
      { description: '', isCorrect: false },
      { description: '', isCorrect: false },
      { description: '', isCorrect: false }
    ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!statement.trim()) {
      alert('Por favor, insira o enunciado da questão');
      return;
    }

    const validAlternatives = alternatives.filter(alt => alt.description.trim());
    
    if (validAlternatives.length === 0) {
      alert('Por favor, adicione pelo menos uma alternativa');
      return;
    }

    onSubmit({
      statement,
      alternatives: validAlternatives
    });
  };

  const handleAlternativeChange = (index: number, field: 'description' | 'isCorrect', value: string | boolean) => {
    const newAlternatives = [...alternatives];
    newAlternatives[index] = {
      ...newAlternatives[index],
      [field]: value
    };
    setAlternatives(newAlternatives);
  };

  const addAlternative = () => {
    setAlternatives([...alternatives, { description: '', isCorrect: false }]);
  };

  const removeAlternative = (index: number) => {
    if (alternatives.length > 1) {
      setAlternatives(alternatives.filter((_, i) => i !== index));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Enunciado da Questão:</label>
        <textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          style={styles.textarea}
          rows={4}
          placeholder="Digite o enunciado da questão..."
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Alternativas:</label>
        {alternatives.map((alt, index) => (
          <div key={index} style={styles.alternativeRow}>
            <input
              type="text"
              value={alt.description}
              onChange={(e) => handleAlternativeChange(index, 'description', e.target.value)}
              style={styles.input}
              placeholder={`Alternativa ${index + 1}`}
            />
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={alt.isCorrect}
                onChange={(e) => handleAlternativeChange(index, 'isCorrect', e.target.checked)}
              />
              Correta
            </label>
            {alternatives.length > 1 && (
              <button
                type="button"
                onClick={() => removeAlternative(index)}
                style={styles.removeButton}
              >
                Remover
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addAlternative} style={styles.addButton}>
          + Adicionar Alternativa
        </button>
      </div>

      <div style={styles.buttonGroup}>
        <button type="submit" style={styles.submitButton}>
          Salvar
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
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontFamily: 'inherit'
  },
  input: {
    flex: 1,
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  alternativeRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
    alignItems: 'center'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    whiteSpace: 'nowrap' as const
  },
  removeButton: {
    padding: '8px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  addButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px'
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
  }
};
