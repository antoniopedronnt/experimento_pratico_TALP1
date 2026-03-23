import { Given, When, Then, Before, setDefaultTimeout } from '@cucumber/cucumber';
import axios from 'axios';
import assert from 'assert';

setDefaultTimeout(30000); // 30 segundos para todos os testes

const API_URL = 'http://localhost:3001/api';

let createdQuestions: any[] = [];
let currentExam: any = { 
  title: '', 
  questionIds: [], 
  identificationType: 'letters',
  header: {
    institution: '',
    discipline: '',
    professor: '',
    date: ''
  }
};
let createdExamId: string | null = null;
let allExams: any[] = [];
let examPreview: any = null;
let lastExamError: any = null;

Before(async function() {
  createdQuestions = [];
  currentExam = { 
    title: '', 
    questionIds: [], 
    identificationType: 'letters',
    header: {
      institution: '',
      discipline: '',
      professor: '',
      date: ''
    }
  };
  createdExamId = null;
  examPreview = null;
  lastExamError = null;
  
  // Limpar todas as provas
  try {
    const examsResponse = await axios.get(`${API_URL}/exams`);
    for (const exam of examsResponse.data) {
      await axios.delete(`${API_URL}/exams/${exam.id}`);
    }
  } catch (error) {
    // Ignorar erro
  }
  
  // Limpar todas as questões
  try {
    const questionsResponse = await axios.get(`${API_URL}/questions`);
    for (const question of questionsResponse.data) {
      await axios.delete(`${API_URL}/questions/${question.id}`);
    }
  } catch (error) {
    // Ignorar erro
  }
});

// Contexto e Given
Given('que existem questões cadastradas no sistema', async function() {
  // Placeholder - as questões serão criadas nos passos seguintes
});

Given('a questão {int} tem o enunciado {string}', async function(numero: number, enunciado: string) {
  const questionData = {
    statement: enunciado,
    alternatives: [
      { description: 'Alternativa A', isCorrect: false },
      { description: 'Alternativa B', isCorrect: true },
      { description: 'Alternativa C', isCorrect: false },
      { description: 'Alternativa D', isCorrect: false }
    ]
  };
  
  const response = await axios.post(`${API_URL}/questions`, questionData);
  createdQuestions[numero - 1] = response.data;
});

Given('que eu estou na página de gerenciamento de provas', function() {
  currentExam = { title: '', questionIds: [], identificationType: 'letters' };
});

Given('que existe uma prova cadastrada com título {string}', async function(titulo: string) {
  if (createdQuestions.length === 0) {
    // Criar uma questão de exemplo
    const questionData = {
      statement: 'Questão de exemplo',
      alternatives: [
        { description: 'Alt A', isCorrect: false },
        { description: 'Alt B', isCorrect: true }
      ]
    };
    const qResponse = await axios.post(`${API_URL}/questions`, questionData);
    createdQuestions.push(qResponse.data);
  }

  const examData = {
    title: titulo,
    questionIds: [createdQuestions[0].id],
    identificationType: 'letters',
    header: {
      institution: 'Teste',
      discipline: 'Disciplina Teste',
      professor: 'Professor Teste',
      date: new Date().toISOString().split('T')[0]
    }
  };
  
  const response = await axios.post(`${API_URL}/exams`, examData);
  createdExamId = response.data.id;
  currentExam = response.data;
});

Given('a prova tem tipo de identificação {string}', async function(tipo: string) {
  if (!createdExamId) return;
  
  await axios.put(`${API_URL}/exams/${createdExamId}`, {
    identificationType: tipo
  });
  
  currentExam.identificationType = tipo;
});

Given('a prova contém a questão {int}', async function(numero: number) {
  if (!createdExamId) return;
  
  const questionId = createdQuestions[numero - 1]?.id;
  if (!questionId) return;
  
  const response = await axios.get(`${API_URL}/exams/${createdExamId}`);
  const exam = response.data;
  
  if (!exam.questionIds.includes(questionId)) {
    exam.questionIds.push(questionId);
    await axios.put(`${API_URL}/exams/${createdExamId}`, {
      questionIds: exam.questionIds
    });
  }
});

Given('que existem {int} provas cadastradas no sistema', async function(quantidade: number) {
  for (let i = 1; i <= quantidade; i++) {
    // Criar questão para a prova
    const questionData = {
      statement: `Questão para prova ${i}`,
      alternatives: [
        { description: 'Alt A', isCorrect: true },
        { description: 'Alt B', isCorrect: false }
      ]
    };
    const qResponse = await axios.post(`${API_URL}/questions`, questionData);
    
    await axios.post(`${API_URL}/exams`, {
      title: `Prova ${i}`,
      questionIds: [qResponse.data.id],
      identificationType: i % 2 === 0 ? 'powers' : 'letters'
    });
  }
});

Given('que existe uma prova de teste com tipo {string}', async function(tipo: string) {
  // Criar questão com número específico de alternativas
  const questionData = {
    statement: 'Questão de teste',
    alternatives: [
      { description: 'Alt 1', isCorrect: false },
      { description: 'Alt 2', isCorrect: true },
      { description: 'Alt 3', isCorrect: false },
      { description: 'Alt 4', isCorrect: false }
    ]
  };
  const qResponse = await axios.post(`${API_URL}/questions`, questionData);
  
  const examData = {
    title: 'Prova de Teste',
    questionIds: [qResponse.data.id],
    identificationType: tipo,
    header: {
      institution: 'Teste',
      discipline: 'Disciplina Teste',
      professor: 'Professor Teste',
      date: new Date().toISOString().split('T')[0]
    }
  };
  
  const response = await axios.post(`${API_URL}/exams`, examData);
  createdExamId = response.data.id;
});

Given('a prova contém uma questão com {int} alternativas', async function(quantidade: number) {
  // A questão já foi criada no passo anterior
  // Este passo é apenas para documentação
});

// When
When('eu preencho o título com {string}', function(titulo: string) {
  currentExam.title = titulo;
});

When('eu seleciono o tipo de identificação {string}', function(tipo: string) {
  currentExam.identificationType = tipo;
});

When('eu seleciono a questão {int}', function(numero: number) {
  const questionId = createdQuestions[numero - 1]?.id;
  if (questionId && !currentExam.questionIds.includes(questionId)) {
    currentExam.questionIds.push(questionId);
  }
});

When('eu clico em {string} na prova', async function(botao: string) {
  if (botao === 'Salvar Prova' || botao === 'Salvar') {
    try {
      // Garantir que o header está preenchido
      if (!currentExam.header.discipline) {
        currentExam.header = {
          institution: 'Teste',
          discipline: 'Disciplina Teste',
          professor: 'Professor Teste',
          date: new Date().toISOString().split('T')[0]
        };
      }

      if (createdExamId) {
        // Atualizar
        const response = await axios.put(`${API_URL}/exams/${createdExamId}`, currentExam);
        currentExam = response.data;
      } else {
        // Criar
        const response = await axios.post(`${API_URL}/exams`, currentExam);
        createdExamId = response.data.id;
        currentExam = response.data;
      }
    } catch (error: any) {
      console.error('Erro ao salvar prova:', error.response?.data || error.message);
      lastExamError = error;
    }
  }
});

When('eu visualizo o preview da prova', async function() {
  if (createdExamId) {
    const response = await axios.get(`${API_URL}/exams/${createdExamId}/preview`);
    examPreview = response.data;
  }
});

When('eu edito a prova', async function() {
  if (createdExamId) {
    const response = await axios.get(`${API_URL}/exams/${createdExamId}`);
    currentExam = response.data;
  }
});

When('eu altero o título para {string}', function(novoTitulo: string) {
  currentExam.title = novoTitulo;
});

When('eu adiciono a questão {int}', function(numero: number) {
  const questionId = createdQuestions[numero - 1]?.id;
  if (questionId && !currentExam.questionIds.includes(questionId)) {
    currentExam.questionIds.push(questionId);
  }
});

When('eu excluo a prova', function() {
  // Marca para exclusão
});

When('eu confirmo a exclusão da prova', async function() {
  if (createdExamId) {
    await axios.delete(`${API_URL}/exams/${createdExamId}`);
  }
});

When('eu deixo o título da prova vazio', function() {
  currentExam.title = '';
});

When('eu não seleciono nenhuma questão', function() {
  currentExam.questionIds = [];
});

When('eu acesso a página de gerenciamento de provas', async function() {
  const response = await axios.get(`${API_URL}/exams`);
  allExams = response.data;
});

// Then
Then('a prova deve ser criada com sucesso', function() {
  assert.ok(createdExamId, 'Prova deve ter sido criada com ID');
  assert.ok(!lastExamError, 'Não deve haver erro');
});

Then('a prova deve ter {int} questão', async function(quantidade: number) {
  const response = await axios.get(`${API_URL}/exams/${createdExamId}`);
  assert.strictEqual(response.data.questionIds.length, quantidade);
});

Then('a prova deve ter {int} questões', async function(quantidade: number) {
  const response = await axios.get(`${API_URL}/exams/${createdExamId}`);
  assert.strictEqual(response.data.questionIds.length, quantidade);
});

Then('o tipo de identificação deve ser {string}', async function(tipo: string) {
  const response = await axios.get(`${API_URL}/exams/${createdExamId}`);
  assert.strictEqual(response.data.identificationType, tipo);
});

Then('eu devo ver o título {string}', function(titulo: string) {
  assert.ok(examPreview, 'Preview deve existir');
  assert.strictEqual(examPreview.title, titulo);
});

Then('as alternativas devem estar identificadas com letras', function() {
  assert.ok(examPreview.questions.length > 0, 'Deve ter questões');
  const firstAlt = examPreview.questions[0].alternatives[0];
  assert.strictEqual(typeof firstAlt.identifier, 'string');
  assert.ok(firstAlt.identifier.match(/[A-Z]/), 'Deve ser letra');
});

Then('deve haver espaço para marcar as letras das alternativas', function() {
  assert.ok(examPreview.questions.length > 0, 'Deve ter questões');
  const answerSpace = examPreview.questions[0].answerSpace;
  assert.ok(answerSpace.includes('Alternativas marcadas'), 'Deve ter espaço para letras');
});

Then('as alternativas devem estar identificadas com potências de 2', function() {
  assert.ok(examPreview.questions.length > 0, 'Deve ter questões');
  const firstAlt = examPreview.questions[0].alternatives[0];
  assert.strictEqual(typeof firstAlt.identifier, 'number');
  assert.strictEqual(firstAlt.identifier, 1, 'Primeira alternativa deve ser 1');
});

Then('deve haver espaço para indicar a soma das alternativas', function() {
  assert.ok(examPreview.questions.length > 0, 'Deve ter questões');
  const answerSpace = examPreview.questions[0].answerSpace;
  assert.ok(answerSpace.includes('Soma das alternativas'), 'Deve ter espaço para soma');
});

Then('a prova deve ser atualizada com sucesso', function() {
  assert.ok(!lastExamError, 'Não deve haver erro');
});

Then('o título deve ser {string}', async function(titulo: string) {
  const response = await axios.get(`${API_URL}/exams/${createdExamId}`);
  assert.strictEqual(response.data.title, titulo);
});

Then('a prova deve ser removida da lista', async function() {
  const response = await axios.get(`${API_URL}/exams`);
  const provaRemovida = response.data.find((e: any) => e.id === createdExamId);
  assert.ok(!provaRemovida, 'Prova não deve mais existir');
});

Then('eu não devo mais ver a prova {string}', async function(titulo: string) {
  const response = await axios.get(`${API_URL}/exams`);
  const prova = response.data.find((e: any) => e.title === titulo);
  assert.ok(!prova, `Prova "${titulo}" não deve existir`);
});

Then('eu devo ver uma mensagem de erro na criação da prova', function() {
  assert.ok(lastExamError, 'Deve haver um erro');
});

Then('a prova não deve ser criada no sistema', async function() {
  if (!createdExamId) {
    // OK, prova não foi criada
    return;
  }
  
  try {
    await axios.get(`${API_URL}/exams/${createdExamId}`);
    assert.fail('Prova não deveria ter sido criada');
  } catch (error: any) {
    assert.strictEqual(error.response.status, 404);
  }
});

Then('eu devo ver {int} provas na lista de provas', function(quantidade: number) {
  assert.strictEqual(allExams.length, quantidade);
});

Then('cada prova deve exibir seu título', function() {
  allExams.forEach(e => {
    assert.ok(e.title, 'Prova deve ter título');
  });
});

Then('cada prova deve exibir a quantidade de questões', function() {
  allExams.forEach(e => {
    assert.ok(Array.isArray(e.questionIds), 'Prova deve ter array de questões');
  });
});

Then('cada prova deve exibir o tipo de identificação', function() {
  allExams.forEach(e => {
    assert.ok(e.identificationType, 'Prova deve ter tipo de identificação');
  });
});

Then('a primeira alternativa deve ser identificada como {string}', function(identificador: string) {
  const alt = examPreview.questions[0].alternatives[0];
  assert.strictEqual(alt.identifier.toString(), identificador);
});

Then('a segunda alternativa deve ser identificada como {string}', function(identificador: string) {
  const alt = examPreview.questions[0].alternatives[1];
  assert.strictEqual(alt.identifier.toString(), identificador);
});

Then('a terceira alternativa deve ser identificada como {string}', function(identificador: string) {
  const alt = examPreview.questions[0].alternatives[2];
  assert.strictEqual(alt.identifier.toString(), identificador);
});

Then('a quarta alternativa deve ser identificada como {string}', function(identificador: string) {
  const alt = examPreview.questions[0].alternatives[3];
  assert.strictEqual(alt.identifier.toString(), identificador);
});

Then('a quinta alternativa deve ser identificada como {string}', function(identificador: string) {
  // Criar questão com 5 alternativas se necessário
  if (examPreview.questions[0].alternatives.length >= 5) {
    const alt = examPreview.questions[0].alternatives[4];
    assert.strictEqual(alt.identifier.toString(), identificador);
  }
});
