import React, { useState } from 'react';
import { QuestionsPage } from './pages/QuestionsPage';
import { ExamsPage } from './pages/ExamsPage';
import { GradingPage } from './pages/GradingPage';
import './App.css';

type Page = 'questions' | 'exams' | 'grading';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('questions');

  return (
    <div className="App">
      <nav style={styles.nav}>
        <button
          onClick={() => setCurrentPage('questions')}
          style={{
            ...styles.navButton,
            ...(currentPage === 'questions' ? styles.navButtonActive : {})
          }}
        >
          📝 Questões
        </button>
        <button
          onClick={() => setCurrentPage('exams')}
          style={{
            ...styles.navButton,
            ...(currentPage === 'exams' ? styles.navButtonActive : {})
          }}
        >
          📄 Provas
        </button>
        <button
          onClick={() => setCurrentPage('grading')}
          style={{
            ...styles.navButton,
            ...(currentPage === 'grading' ? styles.navButtonActive : {})
          }}
        >
          ✅ Correção
        </button>
      </nav>

      {currentPage === 'questions' && <QuestionsPage />}
      {currentPage === 'exams' && <ExamsPage />}
      {currentPage === 'grading' && <GradingPage />}
    </div>
  );
}

const styles = {
  nav: {
    backgroundColor: '#343a40',
    padding: '15px 20px',
    display: 'flex',
    gap: '10px',
    marginBottom: '0'
  },
  navButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#adb5bd',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 500,
    transition: 'all 0.2s'
  },
  navButtonActive: {
    backgroundColor: '#495057',
    color: 'white'
  }
};

export default App;
