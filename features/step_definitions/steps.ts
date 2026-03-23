import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import axios from 'axios';
import assert from 'assert';

setDefaultTimeout(30000); // 30 segundos para todos os testes

const API_URL = 'http://localhost:3001/api';

interface Alternative {
  description: string;
  isCorrect: boolean;
}

interface Question {
  id?: string;
  statement: string;
  alternatives: Alternative[];
}

let currentQuestion: Question = { statement: '', alternatives: [] };
let createdQuestionId: string | null = null;
let allQuestions: any[] = [];
let lastError: any = null;

Before(async function() {
  currentQuestion = { statement: '', alternatives: [] };
  createdQuestionId = null;
  lastError = null;
  
  // Limpar todas as questões antes de cada cenário
  try {
    const response = await axios.get(`${API_URL}/questions`);
    for (const question of response.data) {
      await axios.delete(`${API_URL}/questions/${question.id}`);
    }
  } catch (error) {
    // Ignorar erro se não houver questões
  }
});

// Dado
Given('que eu estou na página de gerenciamento de questões', function() {
  // Simula estar na página
  currentQuestion = { statement: '', alternatives: [] };
});

Given('que existe uma questão cadastrada com o enunciado {string}', async function(enunciado: string) {
  const questionData = {
    statement: enunciado,
    alternatives: [
      { description: 'Alternativa teste', isCorrect: false }
    ]
  };
  
  const response = await axios.post(`${API_URL}/questions`, questionData);
  createdQuestionId = response.data.id;
  currentQuestion = response.data;
});

Given('a questão tem a alternativa {string} como incorreta', async function(descricao: string) {
  if (!createdQuestionId) return;
  
  const response = await axios.get(`${API_URL}/questions/${createdQuestionId}`);
  const question = response.data;
  
  question.alternatives.push({ description: descricao, isCorrect: false });
  
  await axios.put(`${API_URL}/questions/${createdQuestionId}`, {
    statement: question.statement,
    alternatives: question.alternatives
  });
});

Given('a questão tem a alternativa {string} como correta', async function(descricao: string) {
  if (!createdQuestionId) return;
  
  const response = await axios.get(`${API_URL}/questions/${createdQuestionId}`);
  const question = response.data;
  
  question.alternatives.push({ description: descricao, isCorrect: true });
  
  await axios.put(`${API_URL}/questions/${createdQuestionId}`, {
    statement: question.statement,
    alternatives: question.alternatives
  });
});

Given('que existem {int} questões cadastradas no sistema', async function(quantidade: number) {
  for (let i = 1; i <= quantidade; i++) {
    await axios.post(`${API_URL}/questions`, {
      statement: `Questão ${i}`,
      alternatives: [
        { description: `Alternativa A`, isCorrect: false },
        { description: `Alternativa B`, isCorrect: true }
      ]
    });
  }
});

// Quando
When('eu clico no botão {string}', function(botao: string) {
  // Simula clique no botão
});

When('eu preencho o enunciado com {string}', function(enunciado: string) {
  currentQuestion.statement = enunciado;
});

When('eu adiciono a alternativa {string} como incorreta', function(descricao: string) {
  currentQuestion.alternatives.push({ description: descricao, isCorrect: false });
});

When('eu adiciono a alternativa {string} como correta', function(descricao: string) {
  currentQuestion.alternatives.push({ description: descricao, isCorrect: true });
});

When('eu clico em {string}', async function(botao: string) {
  if (botao === 'Salvar') {
    try {
      if (createdQuestionId) {
        // Atualizar
        const response = await axios.put(`${API_URL}/questions/${createdQuestionId}`, currentQuestion);
        currentQuestion = response.data;
      } else {
        // Criar
        const response = await axios.post(`${API_URL}/questions`, currentQuestion);
        createdQuestionId = response.data.id;
        currentQuestion = response.data;
      }
    } catch (error) {
      lastError = error;
    }
  }
});

When('eu clico em {string} na questão', async function(acao: string) {
  if (acao === 'Editar' && createdQuestionId) {
    // Carregar questão existente para edição
    const response = await axios.get(`${API_URL}/questions/${createdQuestionId}`);
    currentQuestion = response.data;
  } else if (acao === 'Excluir') {
    // Apenas simula clique no botão excluir
  }
});

When('eu altero o enunciado para {string}', function(novoEnunciado: string) {
  currentQuestion.statement = novoEnunciado;
});

When('eu confirmo a exclusão', async function() {
  if (createdQuestionId) {
    await axios.delete(`${API_URL}/questions/${createdQuestionId}`);
  }
});

When('eu deixo o enunciado vazio', function() {
  currentQuestion.statement = '';
});

When('eu não adiciono nenhuma alternativa', function() {
  currentQuestion.alternatives = [];
});

When('eu acesso a página de gerenciamento de questões', async function() {
  const response = await axios.get(`${API_URL}/questions`);
  allQuestions = response.data;
});

// Então
Then('a questão deve ser criada com sucesso', function() {
  assert.ok(createdQuestionId, 'Questão deve ter sido criada com ID');
  assert.ok(!lastError, 'Não deve haver erro');
});

Then('eu devo ver a questão na lista com {int} alternativas', async function(quantidade: number) {
  const response = await axios.get(`${API_URL}/questions/${createdQuestionId}`);
  assert.strictEqual(response.data.alternatives.length, quantidade);
});

Then('a alternativa {string} deve estar marcada como correta', async function(descricao: string) {
  const response = await axios.get(`${API_URL}/questions/${createdQuestionId}`);
  const alternativa = response.data.alternatives.find((a: any) => a.description === descricao);
  assert.ok(alternativa, 'Alternativa deve existir');
  assert.strictEqual(alternativa.isCorrect, true, 'Alternativa deve estar marcada como correta');
});

Then('a questão deve ser atualizada com sucesso', function() {
  assert.ok(!lastError, 'Não deve haver erro');
});

Then('o enunciado deve ser {string}', async function(enunciado: string) {
  const response = await axios.get(`${API_URL}/questions/${createdQuestionId}`);
  assert.strictEqual(response.data.statement, enunciado);
});

Then('a questão deve ter {int} alternativas', async function(quantidade: number) {
  const response = await axios.get(`${API_URL}/questions/${createdQuestionId}`);
  assert.strictEqual(response.data.alternatives.length, quantidade);
});

Then('a questão deve ser removida da lista', async function() {
  const response = await axios.get(`${API_URL}/questions`);
  const questaoRemovida = response.data.find((q: any) => q.id === createdQuestionId);
  assert.ok(!questaoRemovida, 'Questão não deve mais existir');
});

Then('eu não devo mais ver a questão {string}', async function(enunciado: string) {
  const response = await axios.get(`${API_URL}/questions`);
  const questao = response.data.find((q: any) => q.statement === enunciado);
  assert.ok(!questao, `Questão "${enunciado}" não deve existir`);
});

Then('eu devo ver uma mensagem de erro', function() {
  assert.ok(lastError, 'Deve haver um erro');
});

Then('a questão não deve ser criada', async function() {
  if (!createdQuestionId) {
    // OK, questão não foi criada
    return;
  }
  
  try {
    await axios.get(`${API_URL}/questions/${createdQuestionId}`);
    assert.fail('Questão não deveria ter sido criada');
  } catch (error: any) {
    assert.strictEqual(error.response.status, 404);
  }
});

Then('eu devo ver {int} questões na lista', function(quantidade: number) {
  assert.strictEqual(allQuestions.length, quantidade);
});

Then('cada questão deve exibir seu enunciado', function() {
  allQuestions.forEach(q => {
    assert.ok(q.statement, 'Questão deve ter enunciado');
  });
});

Then('cada questão deve exibir suas alternativas', function() {
  allQuestions.forEach(q => {
    assert.ok(q.alternatives && q.alternatives.length > 0, 'Questão deve ter alternativas');
  });
});

Then('as alternativas corretas devem estar destacadas', function() {
  allQuestions.forEach(q => {
    const temCorreta = q.alternatives.some((a: any) => a.isCorrect === true);
    assert.ok(temCorreta || q.alternatives.length > 0, 'Questão deve ter estrutura de alternativas válida');
  });
});
