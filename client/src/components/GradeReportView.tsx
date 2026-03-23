import React, { useState } from 'react';
import { GradeReport, GradingMode } from '../types/Grading';

interface GradeReportViewProps {
  report: GradeReport;
  onClose: () => void;
}

export const GradeReportView: React.FC<GradeReportViewProps> = ({ report, onClose }) => {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  const getModeLabel = (mode: GradingMode) => {
    return mode === 'strict' ? 'Rigorosa' : 'Proporcional';
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return '#28a745';
    if (percentage >= 70) return '#17a2b8';
    if (percentage >= 60) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Relatório de Notas</h2>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>

        <div style={styles.content}>
          {/* Estatísticas */}
          <div style={styles.statsSection}>
            <h3 style={styles.sectionTitle}>
              Estatísticas da Turma - Modo: {getModeLabel(report.gradingMode)}
            </h3>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Média</div>
                <div style={styles.statValue}>{report.statistics.average.toFixed(2)}%</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Mediana</div>
                <div style={styles.statValue}>{report.statistics.median.toFixed(2)}%</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Maior Nota</div>
                <div style={styles.statValue}>{report.statistics.highest.toFixed(2)}%</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Menor Nota</div>
                <div style={styles.statValue}>{report.statistics.lowest.toFixed(2)}%</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Taxa de Aprovação</div>
                <div style={styles.statValue}>{report.statistics.passRate.toFixed(2)}%</div>
              </div>
            </div>
          </div>

          {/* Lista de alunos */}
          <div style={styles.studentsSection}>
            <h3 style={styles.sectionTitle}>Notas Individuais</h3>
            <div style={styles.studentsList}>
              {report.studentGrades.map((student) => (
                <div key={student.examNumber} style={styles.studentCard}>
                  <div 
                    style={styles.studentHeader}
                    onClick={() => setSelectedStudent(
                      selectedStudent === student.examNumber ? null : student.examNumber
                    )}
                  >
                    <div style={styles.studentInfo}>
                      <strong>Prova Nº {student.examNumber}</strong>
                      <div style={styles.scoreInfo}>
                        <span>{student.totalScore.toFixed(2)} / {student.maxScore}</span>
                        <span 
                          style={{
                            ...styles.percentage,
                            color: getGradeColor(student.percentage)
                          }}
                        >
                          {student.percentage.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <button style={styles.expandButton}>
                      {selectedStudent === student.examNumber ? '▼' : '▶'}
                    </button>
                  </div>

                  {selectedStudent === student.examNumber && (
                    <div style={styles.questionDetails}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Questão</th>
                            <th style={styles.th}>Resposta do Aluno</th>
                            <th style={styles.th}>Gabarito</th>
                            <th style={styles.th}>Nota</th>
                          </tr>
                        </thead>
                        <tbody>
                          {student.questionGrades.map((qg) => (
                            <tr key={qg.questionNumber}>
                              <td style={styles.td}>Q{qg.questionNumber}</td>
                              <td style={styles.td}>{qg.studentAnswer || '-'}</td>
                              <td style={styles.td}>{qg.correctAnswer}</td>
                              <td style={{
                                ...styles.td,
                                fontWeight: 'bold',
                                color: qg.score === qg.maxScore ? '#28a745' : 
                                       qg.score === 0 ? '#dc3545' : '#ffc107'
                              }}>
                                {qg.score.toFixed(2)} / {qg.maxScore}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.closeBtn}>
            Fechar
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
    maxWidth: '1000px',
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
  statsSection: {
    marginBottom: '30px'
  },
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#333',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px'
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    border: '1px solid #dee2e6'
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '5px',
    textTransform: 'uppercase' as const
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    color: '#007bff'
  },
  studentsSection: {
    marginTop: '20px'
  },
  studentsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  studentCard: {
    backgroundColor: '#fff',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  studentHeader: {
    padding: '15px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    transition: 'background-color 0.2s'
  },
  studentInfo: {
    flex: 1
  },
  scoreInfo: {
    marginTop: '5px',
    display: 'flex',
    gap: '15px',
    fontSize: '14px',
    color: '#666'
  },
  percentage: {
    fontWeight: 'bold' as const,
    fontSize: '16px'
  },
  expandButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#666',
    padding: '5px 10px'
  },
  questionDetails: {
    padding: '15px',
    backgroundColor: '#fff'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const
  },
  th: {
    textAlign: 'left' as const,
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    fontWeight: 'bold' as const,
    fontSize: '14px'
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #dee2e6',
    fontSize: '14px'
  },
  footer: {
    padding: '20px',
    borderTop: '2px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'center'
  },
  closeBtn: {
    padding: '10px 30px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};
