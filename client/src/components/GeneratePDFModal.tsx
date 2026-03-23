import React, { useState } from 'react';
import { examService } from '../services/examService';

interface GeneratePDFModalProps {
  examId: string;
  examTitle: string;
  onClose: () => void;
}

export const GeneratePDFModal: React.FC<GeneratePDFModalProps> = ({ 
  examId, 
  examTitle, 
  onClose 
}) => {
  const [numberOfCopies, setNumberOfCopies] = useState<number>(1);
  const [generating, setGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    if (numberOfCopies < 1 || numberOfCopies > 100) {
      alert('O número de cópias deve estar entre 1 e 100');
      return;
    }

    try {
      setGenerating(true);
      const pdfBlob = await examService.generatePDF(examId, numberOfCopies);
      
      // Download do PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `provas_${examTitle.replace(/\s/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert(`${numberOfCopies} ${numberOfCopies === 1 ? 'prova gerada' : 'provas geradas'} com sucesso!`);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao gerar PDFs';
      alert(message);
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateAnswerKey = async () => {
    if (numberOfCopies < 1 || numberOfCopies > 100) {
      alert('O número de cópias deve estar entre 1 e 100');
      return;
    }

    try {
      setGenerating(true);
      const csvBlob = await examService.generateAnswerKey(examId, numberOfCopies);
      
      // Download do CSV
      const url = window.URL.createObjectURL(csvBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gabarito_${examTitle.replace(/\s/g, '_')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert('Gabarito CSV gerado com sucesso!');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao gerar gabarito';
      alert(message);
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Gerar Provas - {examTitle}</h2>
          <button onClick={onClose} style={styles.closeButton} disabled={generating}>
            ✕
          </button>
        </div>

        <div style={styles.content}>
          <div style={styles.infoBox}>
            <p><strong>ℹ️ Informação:</strong></p>
            <ul style={styles.infoList}>
              <li>Cada cópia terá as questões e alternativas em ordem aleatória</li>
              <li>Cada prova terá um número único no rodapé</li>
              <li>O gabarito CSV conterá as respostas corretas de cada cópia</li>
            </ul>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Número de Cópias (1-100):</label>
            <input
              type="number"
              min="1"
              max="100"
              value={numberOfCopies}
              onChange={(e) => setNumberOfCopies(parseInt(e.target.value) || 1)}
              style={styles.input}
              disabled={generating}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              onClick={handleGeneratePDF}
              style={styles.generateButton}
              disabled={generating}
            >
              {generating ? '⏳ Gerando...' : '📄 Gerar PDFs'}
            </button>
            <button
              onClick={handleGenerateAnswerKey}
              style={styles.answerKeyButton}
              disabled={generating}
            >
              {generating ? '⏳ Gerando...' : '📊 Gerar Gabarito CSV'}
            </button>
            <button
              onClick={onClose}
              style={styles.cancelButton}
              disabled={generating}
            >
              Fechar
            </button>
          </div>
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
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
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
    fontSize: '20px',
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
    padding: '20px'
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    border: '1px solid #b3d9ff',
    borderRadius: '4px',
    padding: '15px',
    marginBottom: '20px'
  },
  infoList: {
    margin: '10px 0 0 0',
    paddingLeft: '20px',
    fontSize: '14px',
    color: '#333'
  },
  formGroup: {
    marginBottom: '20px'
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
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  generateButton: {
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const
  },
  answerKeyButton: {
    padding: '12px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const
  },
  cancelButton: {
    padding: '12px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};
