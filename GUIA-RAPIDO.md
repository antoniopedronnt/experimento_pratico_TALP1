# 🚀 Guia Rápido - Passo a Passo

## Para começar do ZERO

### 1️⃣ Instalar Dependências

Execute o script que instala tudo de uma vez:
```bash
install-all.bat
```

OU instale manualmente:
```bash
# Servidor
cd server
npm install
cd ..

# Cliente
cd client  
npm install
cd ..

# Testes
cd features
npm install
cd ..
```

### 2️⃣ Iniciar o Sistema

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Aguarde a mensagem: `Server is running on port 3001`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Aguarde a mensagem com o endereço (geralmente `http://localhost:5173`)

**Terminal 3 - Testes (OPCIONAL):**

⚠️ **IMPORTANTE:** Só rode os testes DEPOIS que o servidor estiver rodando!

```bash
run-tests.bat
```

OU

```bash
cd features
npm test
```

## 📋 Usando o Sistema

### Criar Questões

1. Acesse `http://localhost:5173`
2. Vá para a aba "Questões"
3. Clique em "Adicionar Nova Questão"
4. Preencha o enunciado
5. Adicione alternativas (mínimo 2)
6. Marque as alternativas corretas ✓
7. Clique em "Salvar Questão"

### Criar Provas

1. Vá para a aba "Provas"
2. Clique em "Criar Nova Prova"
3. Preencha os dados do cabeçalho:
   - Instituição
   - Disciplina
   - Professor
   - Data
4. Escolha o tipo de identificação:
   - **Letras**: A, B, C, D... (aluno marca letras)
   - **Potências**: 1, 2, 4, 8... (aluno soma valores)
5. Selecione as questões que farão parte da prova
6. Reordene se necessário (arrastar e soltar)
7. Clique em "Salvar Prova"

### Gerar PDFs

1. Na lista de provas, clique em "Gerar PDF"
2. Informe o número de cópias (1-100)
3. Clique em "Gerar PDFs"
4. Aguarde o download do arquivo ZIP
5. Clique em "Baixar Gabarito CSV" para obter as respostas corretas

### Corrigir Provas

1. Vá para a aba "Correção"
2. Faça upload do gabarito (CSV gerado pelo sistema)
3. Faça upload das respostas dos alunos (CSV coletado via formulário)
4. Escolha o modo de correção:
   - **Rigorosa**: Erro zera a questão
   - **Proporcional**: Nota proporcional aos acertos
5. Escolha o tipo de identificação (mesmo da prova)
6. Clique em "Corrigir Provas"
7. Visualize o relatório com notas e estatísticas
8. Baixe o relatório em CSV se desejar

## 📊 Formato do CSV de Respostas

O CSV de respostas dos alunos deve seguir o formato:

**Para provas com LETRAS:**
```csv
Prova,Q1,Q2,Q3
1,A,B C,D
2,C,A B,D
3,B,C,A D
```

**Para provas com POTÊNCIAS:**
```csv
Prova,Q1,Q2,Q3
1,5,8,12
2,3,4,7
3,9,2,15
```

💡 **Dica:** Você pode coletar essas respostas usando Google Forms e exportar como CSV!

## 🧪 Executar Testes

⚠️ **OBRIGATÓRIO:** O servidor DEVE estar rodando antes dos testes!

```bash
# Terminal 1 - Servidor
cd server
npm run dev

# Terminal 2 - Testes (aguarde servidor iniciar)
run-tests.bat
```

Os testes cobrem:
- ✅ Gerenciamento de questões (6 cenários)
- ✅ Gerenciamento de provas (12 cenários)
- ✅ Geração de PDFs (13 cenários)
- ✅ Correção de provas (11 cenários)

**Total: 42 cenários de teste em português (Gherkin)**

## ❌ Problemas Comuns

### Testes falhando
- ✅ Certifique-se que o servidor está rodando
- ✅ Aguarde a mensagem "Server is running on port 3001"
- ✅ Verifique se a porta 3001 não está em uso

### Servidor não inicia
- ✅ Rode `install-server-deps.bat` para garantir que as dependências estão instaladas
- ✅ Verifique se tem Node.js versão 18+

### Cliente não conecta
- ✅ Verifique se o servidor está rodando
- ✅ Acesse `http://localhost:3001/api/questions` para testar a API

### Erro ao gerar PDF
- ✅ Certifique-se de que instalou as dependências do servidor (pdfkit)
- ✅ Verifique se a prova tem questões selecionadas

## 🎯 Ordem Recomendada de Teste

1. Criar 5-10 questões variadas
2. Criar uma prova com essas questões
3. Gerar 3 PDFs da prova
4. Baixar o gabarito CSV
5. Criar um CSV de respostas simulando alunos
6. Corrigir as provas e visualizar o relatório

## 📝 Exemplo Completo

### Passo 1: Criar questões
```
Questão 1: "Qual é a capital do Brasil?"
- A) São Paulo ❌
- B) Rio de Janeiro ❌
- C) Brasília ✅
- D) Salvador ❌

Questão 2: "Quais são cores primárias?"
- A) Vermelho ✅
- B) Verde ❌
- C) Azul ✅
- D) Amarelo ✅
```

### Passo 2: Criar prova
```
Título: Prova de Geografia e Artes
Tipo: Letras
Instituição: Escola ABC
Disciplina: Conhecimentos Gerais
Professor: João Silva
Data: 2024-12-01
Questões: [Questão 1, Questão 2]
```

### Passo 3: Gerar 2 PDFs
- Sistema gera PDF da Prova 1 (ordem randomizada)
- Sistema gera PDF da Prova 2 (ordem randomizada diferente)
- Baixar gabarito.csv

### Passo 4: Gabarito gerado
```csv
Prova,Q1,Q2
1,C,A C D
2,A C D,C
```

### Passo 5: Criar respostas.csv
```csv
Prova,Q1,Q2
1,C,A C D
2,A C D,B
```

### Passo 6: Corrigir
- Upload gabarito.csv
- Upload respostas.csv
- Modo: Rigoroso
- Tipo: Letras
- Resultado:
  - Prova 1: 20/20 (100%) ✅
  - Prova 2: 10/20 (50%) ⚠️

---

**✨ Pronto! Agora você tem um sistema completo de gerenciamento de provas!**
