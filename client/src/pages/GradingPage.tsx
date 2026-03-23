import React, { useState } from 'react';
import { GradeReport, GradingMode } from '../types/Grading';
import { gradingService } from '../services/gradingService';
import { GradeReportView } from '../components/GradeReportView';

export const GradingPage: React.FC = () => {
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null);
  const [studentAnswersFile, setStudentAnswersFile] = useState<File | null>(null);
  const [gradingMode, setGradingMode] = useState<GradingMode>('strict');
  const [identificationType, setIdentificationType] = useState<'letters' | 'powers'>('letters');
  const [gradeReport, setGradeReport] = useState<GradeReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAnswerKeyFile(e.target.files[0]);
    }
  };

  const handleStudentAnswersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStudentAnswersFile(e.target.files[0]);
    }
  };

  const handleGradeExams = async () => {
    if (!answerKeyFile || !studentAnswersFile) {
      alert('Por favor, selecione ambos os arquivos CSV');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const report = await gradingService.gradeExams(
        answerKeyFile,
        studentAnswersFile,
        gradingMode,
        identificationType
      );
      setGradeReport(report);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao corrigir provas';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!answerKeyFile || !studentAnswersFile) {
      alert('Por favor, selecione ambos os arquivos CSV');
      return;
    }

    try {
      setLoading(true);
      const blob = await gradingService.downloadGradeReport(
        answerKeyFile,
        studentAnswersFile,
        gradingMode,
        identificationType
      );

      // Download do CSV
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'relatorio_notas.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao gerar relatório';
      alert(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Correção de Provas</h1>
      </header>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Upload de Arquivos</h2>
        
        <div style={styles.infoBox}>
          <p><strong>ℹ️ Formato dos arquivos CSV:</strong></p>
          <ul style={styles.infoList}>
            <li><strong>Gabarito:</strong> Prova,Q1,Q2,Q3,... (gerado pelo sistema)</li>
            <li><strong>Respostas dos alunos:</strong> Prova,Q1,Q2,Q3,... (coletado via formulário)</li>
            <li><strong>IMPORTANTE:</strong> Cada aluno deve ter um número de prova ÚNICO (1, 2, 3, 4...)</li>
            <li>Exemplo correto:<br/>
              <code style={styles.code}>
                Prova,Q1,Q2<br/>
                1,A,B<br/>
                2,C,D<br/>
                3,A,C
              </code>
            </li>
          </ul>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Arquivo do Gabarito (CSV):</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleAnswerKeyChange}
            style={styles.fileInput}
          />
          {answerKeyFile && (
            <div style={styles.fileName}>✓ {answerKeyFile.name}</div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Arquivo com Respostas dos Alunos (CSV):</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleStudentAnswersChange}
            style={styles.fileInput}
          />
          {studentAnswersFile && (
            <div style={styles.fileName}>✓ {studentAnswersFile.name}</div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tipo de Identificação das Alternativas:</label>
          <select
            value={identificationType}
            onChange={(e) => setIdentificationType(e.target.value as 'letters' | 'powers')}
            style={styles.select}
          >
            <option value="letters">Letras (A, B, C...)</option>
            <option value="powers">Potências de 2 (1, 2, 4, 8...)</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Modo de Correção:</label>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="strict"
                checked={gradingMode === 'strict'}
                onChange={(e) => setGradingMode(e.target.value as GradingMode)}
              />
              <div>
                <strong>Rigorosa</strong>
                <br />
                <small>
                  Qualquer erro na questão zera a nota dela completamente
                </small>
              </div>
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="proportional"
                checked={gradingMode === 'proportional'}
                onChange={(e) => setGradingMode(e.target.value as GradingMode)}
              />
              <div>
                <strong>Proporcional</strong>
                <br />
                <small>
                  A nota é proporcional ao percentual de alternativas marcadas corretamente
                </small>
              </div>
            </label>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            onClick={handleGradeExams}
            disabled={!answerKeyFile || !studentAnswersFile || loading}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              ...((!answerKeyFile || !studentAnswersFile || loading) && styles.disabledButton)
            }}
          >
            {loading ? '⏳ Processando...' : '📊 Corrigir Provas'}
          </button>
          <button
            onClick={handleDownloadReport}
            disabled={!answerKeyFile || !studentAnswersFile || loading}
            style={{
              ...styles.button,
              ...styles.secondaryButton,
              ...((!answerKeyFile || !studentAnswersFile || loading) && styles.disabledButton)
            }}
          >
            {loading ? '⏳ Gerando...' : '📥 Baixar Relatório CSV'}
          </button>
        </div>
      </div>

      {gradeReport && (
        <GradeReportView
          report={gradeReport}
          onClose={() => setGradeReport(null)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #dc3545'
  },
  title: {
    margin: 0,
    color: '#333',
    fontSize: '28px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0'
  },
  cardTitle: {
    fontSize: '20px',
    marginTop: 0,
    marginBottom: '20px',
    color: '#333'
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    border: '1px solid #b3d9ff',
    borderRadius: '4px',
    padding: '15px',
    marginBottom: '25px'
  },
  infoList: {
    margin: '10px 0 0 0',
    paddingLeft: '20px',
    fontSize: '14px'
  },
  code: {
    display: 'block',
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '12px',
    marginTop: '5px',
    border: '1px solid #ddd'
  },
  formGroup: {
    marginBottom: '25px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold' as const,
    color: '#333',
    fontSize: '14px'
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    cursor: 'pointer'
  },
  fileName: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#28a745',
    fontWeight: 'bold' as const
  },
  select: {
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
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '2px solid #ddd',
    cursor: 'pointer'
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px'
  },
  button: {
    flex: 1,
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    transition: 'opacity 0.2s'
  },
  primaryButton: {
    backgroundColor: '#007bff',
    color: 'white'
  },
  secondaryButton: {
    backgroundColor: '#28a745',
    color: 'white'
  },
  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed'
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
