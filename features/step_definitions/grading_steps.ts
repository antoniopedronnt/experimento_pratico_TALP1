import { Given, When, Then, Before, setDefaultTimeout } from '@cucumber/cucumber';
import axios from 'axios';
import assert from 'assert';
import FormData from 'form-data';

setDefaultTimeout(30000); // 30 segundos para todos os testes

const API_URL = 'http://localhost:3001/api';

let answerKeyCSV: string = '';
let studentAnswersCSV: string = '';
let gradingMode: string = 'strict';
let identificationType: string = 'letters';
let gradeReport: any = null;
let gradingError: any = null;
let downloadedCSV: string = '';

Before(async function() {
  answerKeyCSV = '';
  studentAnswersCSV = '';
  gradingMode = 'strict';
  identificationType = 'letters';
  gradeReport = null;
  gradingError = null;
  downloadedCSV = '';
});

// Given
Given('que tenho um gabarito de provas em CSV', function() {
  // Placeholder
});

Given('tenho as respostas dos alunos em CSV', function() {
  // Placeholder
});

// Helper function to escape CSV values
function escapeCSVValue(value: string): string {
  // Se o valor contém vírgula, espaço ou aspas, coloque entre aspas
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes(' ')) {
    // Escape aspas duplicando-as
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function createCSV(rows: any[]): string {
  if (rows.length === 0) return '';
  
  const headers = Object.keys(rows[0]);
  let csv = headers.join(',') + '\n';
  
  csv += rows.map((row: any) => 
    headers.map(h => escapeCSVValue(row[h] || '')).join(',')
  ).join('\n');
  
  return csv;
}

Given('que o gabarito contém:', function(dataTable: any) {
  const rows = dataTable.hashes();
  answerKeyCSV = createCSV(rows);
});

Given('as respostas dos alunos contêm:', function(dataTable: any) {
  const rows = dataTable.hashes();
  studentAnswersCSV = createCSV(rows);
});

Given('que envio um CSV de gabarito inválido', function() {
  answerKeyCSV = 'dados,invalidos,sem,estrutura\n1,2,3,4';
  studentAnswersCSV = 'Prova,Q1\n1,A';
});

// When
When('eu corrijo no modo {string} com tipo {string}', async function(modo: string, tipo: string) {
  gradingMode = modo === 'rigoroso' ? 'strict' : 'proportional';
  identificationType = tipo;
  
  try {
    const formData = new FormData();
    formData.append('answerKey', Buffer.from(answerKeyCSV), {
      filename: 'gabarito.csv',
      contentType: 'text/csv'
    });
    formData.append('studentAnswers', Buffer.from(studentAnswersCSV), {
      filename: 'respostas.csv',
      contentType: 'text/csv'
    });
    formData.append('mode', gradingMode);
    formData.append('identificationType', identificationType);

    const response = await axios.post(`${API_URL}/grading/grade`, formData, {
      headers: formData.getHeaders()
    });
    
    gradeReport = response.data;
  } catch (error: any) {
    console.error('Erro ao corrigir provas:', error.response?.data || error.message);
    gradingError = error;
  }
});

When('eu tento corrigir as provas', async function() {
  try {
    const formData = new FormData();
    formData.append('answerKey', Buffer.from(answerKeyCSV), {
      filename: 'gabarito.csv',
      contentType: 'text/csv'
    });
    formData.append('studentAnswers', Buffer.from(studentAnswersCSV), {
      filename: 'respostas.csv',
      contentType: 'text/csv'
    });
    formData.append('mode', 'strict');
    formData.append('identificationType', 'letters');

    const response = await axios.post(`${API_URL}/grading/grade`, formData, {
      headers: formData.getHeaders()
    });
    
    gradeReport = response.data;
  } catch (error) {
    gradingError = error;
  }
});

When('eu solicito o download do relatório em CSV', async function() {
  try {
    const formData = new FormData();
    formData.append('answerKey', Buffer.from(answerKeyCSV), {
      filename: 'gabarito.csv',
      contentType: 'text/csv'
    });
    formData.append('studentAnswers', Buffer.from(studentAnswersCSV), {
      filename: 'respostas.csv',
      contentType: 'text/csv'
    });
    formData.append('mode', 'strict');
    formData.append('identificationType', 'letters');

    const response = await axios.post(`${API_URL}/grading/report`, formData, {
      headers: formData.getHeaders()
    });
    
    downloadedCSV = response.data;
  } catch (error) {
    gradingError = error;
  }
});

// Then
Then('o aluno da prova {int} deve ter nota {int} de {int}', function(provaNum: number, nota: number, notaMax: number) {
  assert.ok(gradeReport, 'Relatório deve existir');
  const studentGrade = gradeReport.studentGrades.find((sg: any) => sg.examNumber === provaNum);
  assert.ok(studentGrade, `Nota do aluno da prova ${provaNum} deve existir`);
  assert.strictEqual(studentGrade.totalScore, nota, `Nota deve ser ${nota}`);
  assert.strictEqual(studentGrade.maxScore, notaMax, `Nota máxima deve ser ${notaMax}`);
});

Then('o aluno da prova {int} deve ter nota maior que {int}', function(provaNum: number, notaMin: number) {
  assert.ok(gradeReport, 'Relatório deve existir');
  const studentGrade = gradeReport.studentGrades.find((sg: any) => sg.examNumber === provaNum);
  assert.ok(studentGrade, `Nota do aluno da prova ${provaNum} deve existir`);
  assert.ok(studentGrade.totalScore > notaMin, `Nota deve ser maior que ${notaMin}, foi ${studentGrade.totalScore}`);
});

Then('o aluno da prova {int} deve ter nota menor que {int}', function(provaNum: number, notaMax: number) {
  assert.ok(gradeReport, 'Relatório deve existir');
  const studentGrade = gradeReport.studentGrades.find((sg: any) => sg.examNumber === provaNum);
  assert.ok(studentGrade, `Nota do aluno da prova ${provaNum} deve existir`);
  assert.ok(studentGrade.totalScore < notaMax, `Nota deve ser menor que ${notaMax}, foi ${studentGrade.totalScore}`);
});

Then('o relatório deve conter média da turma', function() {
  assert.ok(gradeReport, 'Relatório deve existir');
  assert.ok(gradeReport.statistics, 'Estatísticas devem existir');
  assert.ok(typeof gradeReport.statistics.average === 'number', 'Média deve ser um número');
});

Then('o relatório deve conter mediana', function() {
  assert.ok(gradeReport.statistics.median !== undefined, 'Mediana deve existir');
});

Then('o relatório deve conter maior nota', function() {
  assert.ok(gradeReport.statistics.highest !== undefined, 'Maior nota deve existir');
});

Then('o relatório deve conter menor nota', function() {
  assert.ok(gradeReport.statistics.lowest !== undefined, 'Menor nota deve existir');
});

Then('o relatório deve conter taxa de aprovação', function() {
  assert.ok(gradeReport.statistics.passRate !== undefined, 'Taxa de aprovação deve existir');
});

Then('um arquivo CSV deve ser baixado', function() {
  assert.ok(downloadedCSV, 'CSV deve ter sido baixado');
  assert.ok(downloadedCSV.length > 0, 'CSV não deve estar vazio');
});

Then('o CSV deve conter a linha de cabeçalho', function() {
  const lines = downloadedCSV.split('\n');
  assert.ok(lines.length > 0, 'CSV deve ter linhas');
  assert.ok(lines[0].includes('Prova'), 'Cabeçalho deve conter "Prova"');
});

Then('o CSV deve conter dados das notas', function() {
  const lines = downloadedCSV.split('\n').filter((l: string) => l.trim());
  assert.ok(lines.length > 1, 'CSV deve ter dados além do cabeçalho');
});

Then('o CSV deve conter estatísticas', function() {
  assert.ok(downloadedCSV.includes('ESTATÍSTICAS') || downloadedCSV.includes('Média'), 
    'CSV deve conter estatísticas');
});

Then('deve retornar erro de formato inválido', function() {
  assert.ok(gradingError, 'Deve haver erro');
});

Then('o relatório não deve conter notas válidas', function() {
  // Se não houve erro, o relatório deve estar vazio ou sem notas
  if (gradeReport) {
    assert.ok(!gradeReport.studentGrades || gradeReport.studentGrades.length === 0, 
      'Relatório não deve ter notas válidas para CSV inválido');
  }
  // Se houve erro, também é válido
});

Then('a taxa de aprovação deve ser {int} por cento', function(taxaEsperada: number) {
  assert.ok(gradeReport, 'Relatório deve existir');
  assert.strictEqual(gradeReport.statistics.passRate, taxaEsperada, 
    `Taxa de aprovação deve ser ${taxaEsperada}%`);
});
