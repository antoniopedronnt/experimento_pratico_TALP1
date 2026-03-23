# Sistema de Gerenciamento de Questões de Provas

Sistema web para gerenciamento de questões fechadas de provas, desenvolvido com React + TypeScript no frontend e Node + TypeScript no backend.

## 🚀 Tecnologias

### Backend
- Node.js
- TypeScript
- Express
- CORS
- PDFKit (geração de PDFs)

### Frontend
- React
- TypeScript
- Vite
- Axios

### Testes
- Cucumber
- Gherkin

## 📋 Funcionalidades

- ✅ Criar questões com múltiplas alternativas
- ✅ Editar questões existentes
- ✅ Remover questões
- ✅ Listar todas as questões
- ✅ Marcar alternativas corretas
- ✅ Validação de dados
- ✅ Criar provas selecionando questões
- ✅ Escolher tipo de identificação (letras ou potências)
- ✅ Editar e remover provas
- ✅ Configurar cabeçalho da prova (instituição, disciplina, professor, data)
- ✅ **Gerar PDFs com randomização de questões e alternativas**
- ✅ **Cabeçalho personalizado em cada PDF**
- ✅ **Número único da prova no rodapé de cada página**
- ✅ **Espaço para identificação do aluno (nome, CPF, assinatura)**
- ✅ **Gerar arquivo CSV com gabarito de todas as provas**
- ✅ **Corrigir provas via upload de CSVs**
- ✅ **Modo de correção rigorosa** (erro zera a questão)
- ✅ **Modo de correção proporcional** (nota proporcional aos acertos)
- ✅ **Relatório de notas com estatísticas da turma**
- ✅ **Download de relatório em CSV**

## 🔧 Instalação

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm

### Opção 1: Instalação usando scripts batch (Windows)

Execute os scripts na pasta raiz do projeto:

```bash
# Instala dependências do servidor
install-server-deps.bat

# Instala dependências do cliente
install-client-deps.bat

# Instala dependências dos testes
install-test-deps.bat
```

### Opção 2: Instalação manual

#### Passo 1: Instalar dependências do servidor

```bash
cd server
npm install
cd ..
```

#### Passo 2: Instalar dependências do cliente

```bash
cd client
npm install
cd ..
```

#### Passo 3: Instalar dependências dos testes

```bash
cd features
npm install
cd ..
```

## ▶️ Executando o Sistema

**IMPORTANTE:** Antes de rodar os testes, certifique-se de que o servidor está rodando!

### Iniciar o Backend (Terminal 1)

```bash
cd server
npm run dev
```

O servidor estará disponível em `http://localhost:3001`

### Iniciar o Frontend (Terminal 2)

```bash
cd client
npm run dev
```

O cliente estará disponível em `http://localhost:3000`

## 🧪 Executando os Testes

Certifique-se de que o servidor está rodando antes de executar os testes.

```bash
cd features
npm test
```

## 📁 Estrutura do Projeto

```
at1-3/
├── server/                 # Backend Node + TypeScript
│   ├── src/
│   │   ├── controllers/   # Controladores da API
│   │   ├── repositories/  # Repositórios de dados
│   │   ├── routes/        # Rotas da API
│   │   ├── types/         # Tipos TypeScript
│   │   └── index.ts       # Entrada do servidor
│   └── package.json
├── client/                 # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas
│   │   ├── services/      # Serviços de API
│   │   ├── types/         # Tipos TypeScript
│   │   └── main.tsx       # Entrada do app
│   └── package.json
└── features/               # Testes Cucumber
    ├── step_definitions/  # Definições dos passos
    ├── gerenciamento_questoes.feature
    └── package.json
```

## 🔌 API Endpoints

### Questões
- `GET /api/questions` - Lista todas as questões
- `GET /api/questions/:id` - Busca uma questão específica
- `POST /api/questions` - Cria uma nova questão
- `PUT /api/questions/:id` - Atualiza uma questão
- `DELETE /api/questions/:id` - Remove uma questão

### Provas
- `GET /api/exams` - Lista todas as provas
- `GET /api/exams/:id` - Busca uma prova específica
- `GET /api/exams/:id/preview` - Visualiza preview da prova formatada
- `POST /api/exams` - Cria uma nova prova
- `PUT /api/exams/:id` - Atualiza uma prova
- `DELETE /api/exams/:id` - Remove uma prova
- `POST /api/exams/:id/generate-pdf` - Gera PDFs individuais randomizados
- `POST /api/exams/:id/generate-answer-key` - Gera CSV com gabarito

### Correção
- `POST /api/grading/grade` - Corrige provas (upload de 2 CSVs)
- `POST /api/grading/report` - Gera relatório CSV de notas

## 📝 Exemplo de Questão

```json
{
  "statement": "Qual é a capital do Brasil?",
  "alternatives": [
    { "description": "São Paulo", "isCorrect": false },
    { "description": "Rio de Janeiro", "isCorrect": false },
    { "description": "Brasília", "isCorrect": true },
    { "description": "Salvador", "isCorrect": false }
  ]
}
```

## 📄 Exemplo de Prova

```json
{
  "title": "Prova de Geografia",
  "questionIds": ["uuid-questao-1", "uuid-questao-2"],
  "identificationType": "letters",
  "header": {
    "institution": "Universidade XYZ",
    "discipline": "Geografia",
    "professor": "Dr. Silva",
    "date": "2024-06-15"
  }
}
```

**Tipos de identificação:**
- `letters`: Alternativas identificadas por letras (A, B, C, D...). O aluno marca as letras escolhidas.
- `powers`: Alternativas identificadas por potências de 2 (1, 2, 4, 8, 16...). O aluno soma os valores das alternativas escolhidas.

## 📊 Geração de PDFs

Para gerar PDFs randomizados:

```bash
POST /api/exams/{id}/generate-pdf
Body: { "numberOfCopies": 30 }
```

Isso irá:
1. Gerar 30 PDFs individuais
2. Cada PDF terá questões e alternativas em ordem aleatória
3. Cada PDF terá um número único (1 a 30) no rodapé
4. Todos incluirão cabeçalho personalizado e espaço para identificação do aluno

Para gerar o gabarito CSV:

```bash
POST /api/exams/{id}/generate-answer-key  
Body: { "numberOfCopies": 30 }
```

Exemplo de CSV gerado:
```csv
Prova,Q1,Q2,Q3
1,A,B C,D
2,C,A B,D
3,B,C,A D
```

Ou para potências:
```csv
Prova,Q1,Q2,Q3
1,5,3,8
2,2,12,16
3,9,1,4
```

## 📊 Correção de Provas - Guia Completo

### 🎯 Fluxo Completo de Correção

#### 1️⃣ Preparação das Provas
1. Crie as questões no sistema
2. Monte a prova selecionando as questões desejadas
3. Configure o tipo de identificação (`letters` ou `powers`)
4. **Gere os PDFs** - clique em "📄 Gerar" e informe o número de cópias (ex: 30 alunos = 30 cópias)
5. **Baixe o gabarito CSV** - o sistema gera automaticamente com os gabaritos de todas as cópias
6. Imprima e distribua as provas para os alunos

#### 2️⃣ Coleta de Respostas

Você pode coletar as respostas de duas formas:

**Opção A: Manualmente**
- Crie um CSV seguindo o formato exato descrito abaixo

**Opção B: Google Forms (Recomendado)**
- Crie um formulário seguindo o modelo descrito na seção "Integração com Google Forms"

### 📝 Formato dos Arquivos CSV

#### ⚠️ REGRAS CRÍTICAS

1. **Cada aluno DEVE ter um número de prova ÚNICO** correspondente à cópia física que recebeu
2. **O número da prova no CSV de respostas DEVE corresponder ao número da prova no gabarito**
3. Não pode haver números de prova duplicados no CSV de respostas

#### ✅ Formato Correto do CSV de Gabarito

O gabarito é **gerado automaticamente** pelo sistema. Não edite este arquivo!

**Exemplo - Provas com Letras:**
```csv
Prova,Q1,Q2,Q3
1,A,"B,C",D
2,C,A,B
3,"A,D",B,C
```

**Exemplo - Provas com Potências:**
```csv
Prova,Q1,Q2,Q3
1,5,12,8
2,3,7,16
3,9,4,15
```

Cada linha representa o gabarito de UMA cópia específica da prova (com questões/alternativas randomizadas).

#### ✅ Formato Correto do CSV de Respostas dos Alunos

**IMPORTANTE:** O número da prova deve ser o número impresso no rodapé do PDF que o aluno recebeu!

**Provas com LETRAS** (identificationType: "letters"):

```csv
Prova,Q1,Q2,Q3
1,A,"B,C",D
2,C,A,B
3,A,B,C
4,D,C,A
```

⚠️ **Atenção para múltiplas alternativas:**
- Se a resposta tem vírgulas (ex: A,C), coloque entre aspas: `"A,C"`
- OU separe com espaço ao invés de vírgula: `A C`

**Provas com POTÊNCIAS** (identificationType: "powers"):

```csv
Prova,Q1,Q2,Q3
1,5,12,8
2,3,7,16
3,9,4,15
4,2,1,8
```

O aluno deve **somar** os valores das alternativas escolhidas. Por exemplo:
- Marcou alternativas 1 e 4 → resposta é `5` (1+4)
- Marcou alternativas 2 e 8 → resposta é `10` (2+8)

#### ❌ Erros Comuns a Evitar

**Erro 1: Números de prova duplicados**
```csv
Prova,Q1,Q2
1,A,B
1,C,D    ← ERRO! Número 1 duplicado
2,A,C
```

**Erro 2: Números que não correspondem ao gabarito**
```csv
# Gabarito tem provas 1, 2, 3, 4
# Respostas tem:
Prova,Q1,Q2
5,A,B    ← ERRO! Não existe prova 5 no gabarito
6,C,D    ← ERRO! Não existe prova 6 no gabarito
```

**Erro 3: Alternativas sem aspas quando há vírgulas**
```csv
Prova,Q1,Q2
1,A,B,C    ← ERRO! O sistema interpretará como 3 colunas (A, B, C)
```

Correto:
```csv
Prova,Q1,Q2
1,A,"B,C"  ← CORRETO! Valor entre aspas
```

Ou:
```csv
Prova,Q1,Q2
1,A,B C    ← CORRETO! Espaço ao invés de vírgula
```

### 🔧 Processo de Correção no Sistema

1. Acesse a página **"Correção de Provas"**
2. Faça upload do **arquivo de gabarito CSV** (gerado pelo sistema)
3. Faça upload do **arquivo de respostas CSV** (criado por você)
4. Selecione o **tipo de identificação** (letters ou powers)
5. Escolha o **modo de correção**:
   - **Rigorosa**: Qualquer erro zera a questão completamente
   - **Proporcional**: Nota proporcional ao percentual de acertos
6. Clique em **"Corrigir Provas"**

### 📊 Modos de Correção

#### Modo Rigoroso (Strict)
- **Tudo ou nada**: A questão só vale pontos se estiver 100% correta
- Qualquer alternativa marcada incorretamente ou deixada de marcar = 0 pontos
- Útil para avaliações onde precisão total é necessária

**Exemplo:**
- Gabarito: `A,B,C`
- Aluno marcou: `A,B` → **0 pontos** (faltou C)
- Aluno marcou: `A,B,C,D` → **0 pontos** (D está errada)
- Aluno marcou: `A,B,C` → **10 pontos** ✓

#### Modo Proporcional (Proportional)
- **Nota proporcional** ao percentual de alternativas corretas
- Fórmula: `(corretas_marcadas / total_corretas) - (incorretas_marcadas / total_alternativas)`
- Nota mínima: 0 (não pode ser negativa)

**Exemplo:**
- Gabarito: `A,B,C` (3 alternativas corretas, 4 alternativas no total)
- Aluno marcou: `A,B` → **~6.67 pontos** (marcou 2 de 3, faltou 1)
- Aluno marcou: `A,B,C,D` → **~5.00 pontos** (marcou 3 de 3, mas 1 errada)
- Aluno marcou: `A,B,C` → **10 pontos** ✓

### 📈 Relatório de Notas

Após a correção, o sistema gera um relatório completo com:

**Para cada aluno:**
- Número da prova
- Nota de cada questão
- Nota total e percentual
- Detalhes: resposta do aluno vs. gabarito

**Estatísticas da turma:**
- Média geral
- Mediana
- Maior nota
- Menor nota
- Taxa de aprovação (alunos com ≥60%)

**Ações disponíveis:**
- Visualizar relatório interativo na tela
- Baixar relatório em formato CSV

### 🌐 Integração com Google Forms

Para coletar respostas via Google Forms e depois importar no sistema:

#### Passo 1: Criar o Formulário

1. Crie um novo Google Forms
2. **Primeira pergunta (obrigatória):**
   - Tipo: **Resposta curta**
   - Pergunta: `Qual o número da sua prova?`
   - Descrição: `Veja o número no rodapé da folha da prova`
   - Validação: Número entre 1 e [quantidade de cópias]

3. **Para cada questão da prova:**

   **Se for tipo LETRAS:**
   - Tipo: **Resposta curta**
   - Pergunta: `Questão 1: Quais alternativas você marcou?`
   - Descrição: `Exemplos: A ou A,C ou A B C (separe com vírgula ou espaço)`
   
   **Se for tipo POTÊNCIAS:**
   - Tipo: **Resposta curta**
   - Pergunta: `Questão 1: Qual a soma das alternativas?`
   - Descrição: `Some os números das alternativas escolhidas. Ex: se marcou 1 e 4, responda 5`
   - Validação: Número

#### Passo 2: Exportar Respostas

1. Vá em **Respostas** → ⋮ (três pontos) → **Fazer download das respostas (.csv)**
2. O arquivo virá neste formato:
```csv
Carimbo de data/hora,Número da Prova,Q1,Q2,Q3
2026-03-23 10:30:00,1,A,B,C
2026-03-23 10:31:00,2,C,D,A
```

#### Passo 3: Ajustar o CSV

Você precisa **remover a coluna de timestamp** e **renomear a segunda coluna**:

**No Excel/LibreOffice:**
1. Abra o CSV
2. Delete a coluna A (Carimbo de data/hora)
3. Renomeie a coluna A (agora é "Número da Prova") para `Prova`
4. Salve como CSV

**Resultado final:**
```csv
Prova,Q1,Q2,Q3
1,A,B,C
2,C,D,A
```

#### Passo 4: Importar no Sistema

Agora use este CSV ajustado como arquivo de respostas no sistema!

### 🎓 Exemplo Completo

#### Cenário: Prova de Matemática com 3 questões, 30 alunos

1. **Criação:**
   - Professor cria 3 questões no sistema
   - Cria prova "Matemática Básica" tipo `letters`
   - Gera 30 cópias em PDF
   - Baixa gabarito CSV (30 linhas, uma para cada cópia)

2. **Aplicação:**
   - Distribui provas impressas (numeradas 1 a 30)
   - Alunos resolvem

3. **Coleta:**
   - Cria Google Forms com 4 perguntas:
     - Número da prova: 1-30
     - Q1, Q2, Q3: Letras das alternativas
   - Alunos preenchem o formulário
   - Exporta para CSV

4. **Ajuste:**
   - Remove coluna de timestamp
   - Renomeia para "Prova,Q1,Q2,Q3"
   - Verifica se todos os números estão entre 1-30

5. **Correção:**
   - Upload do gabarito (30 linhas)
   - Upload das respostas (30 linhas)
   - Seleciona modo "Proporcional"
   - Clica em "Corrigir Provas"

6. **Resultado:**
   - Relatório com nota de cada aluno
   - Estatísticas da turma
   - Download em CSV para lançamento no sistema acadêmico

### 💡 Dicas Importantes

1. **Sempre teste com 2-3 alunos primeiro** antes de usar com a turma toda
2. **Guarde o gabarito CSV** junto com os PDFs gerados - você vai precisar dele!
3. **Oriente os alunos** sobre o formato correto de resposta no Google Forms
4. **Verifique o CSV ajustado** antes de fazer upload - abra e confirme visualmente
5. **Use modo proporcional** para avaliações formativas, **rigoroso** para somativas

### ❓ FAQ - Perguntas Frequentes

**P: Posso usar o mesmo gabarito para corrigir múltiplas vezes?**
R: Sim! O gabarito não muda. Você pode corrigir quantas vezes quiser.

**P: E se um aluno perdeu a prova e fez uma reposição?**
R: Gere uma nova cópia (ex: cópia 31), baixe o gabarito, e corrija junto com as outras.

**P: Posso misturar letras e potências na mesma prova?**
R: Não. Cada prova deve ter um único tipo de identificação.

**P: O sistema aceita questões com peso diferente?**
R: Atualmente não. Todas as questões valem 10 pontos. Para pesos diferentes, ajuste manualmente após exportar o relatório CSV.

**P: Como tratar questões anuladas?**
R: Remova a coluna da questão anulada do CSV antes de fazer upload, ou ajuste as notas manualmente após a correção.

## ✨ Características Implementadas

1. **Gerenciamento Completo de Questões**
   - Inclusão de questões com enunciado e alternativas
   - Alteração de questões existentes
   - Remoção de questões

2. **Gerenciamento Completo de Provas**
   - Criação de provas selecionando questões cadastradas
   - Escolha entre dois tipos de identificação:
     - **Letras (A, B, C, D...)**: Aluno marca as letras das alternativas
     - **Potências de 2 (1, 2, 4, 8...)**: Aluno soma os valores das alternativas
   - Alteração e remoção de provas
   - Preview visual da prova formatada
   - Ordenação das questões na prova
   - Configuração de cabeçalho (instituição, disciplina, professor, data)

3. **Geração de PDFs Individuais** ⭐ NOVO
   - Geração de múltiplas cópias (1-100) de uma prova
   - **Randomização automática**:
     - Ordem das questões varia em cada cópia
     - Ordem das alternativas varia em cada cópia
   - **Cabeçalho personalizado** com:
     - Nome da instituição
     - Disciplina
     - Professor
     - Data da prova
   - **Rodapé com número único** da prova em todas as páginas
   - **Espaço para identificação do aluno**:
     - Nome completo
     - CPF
     - Assinatura
   - Instruções específicas para cada tipo de prova

4. **Gabarito em CSV** ⭐ NOVO
   - Arquivo CSV com gabarito de todas as cópias geradas
   - Formato: `Prova,Q1,Q2,Q3,...`
   - Para provas com **letras**: mostra as letras corretas (ex: "A, C")
   - Para provas com **potências**: mostra a soma esperada (ex: "5" = 1+4)

5. **Interface Intuitiva**
   - Navegação entre Questões e Provas
   - Formulários para criação/edição
   - Listas visuais de questões e provas
   - Indicação visual de alternativas corretas
   - Preview de provas com formatação para impressão
   - **Modal para geração de PDFs e gabarito**
   - Download automático de arquivos gerados
   - Confirmação antes de excluir

6. **Testes de Aceitação**
   - Cenários em Gherkin (português)
   - Cobertura completa das funcionalidades
   - Testes automatizados com Cucumber
   - Testes específicos para geração de PDFs

## 👨‍💻 Desenvolvimento

O sistema utiliza armazenamento em memória (in-memory) para os dados. Para persistência em banco de dados, seria necessário adicionar uma camada de persistência adicional.

## 🐛 Troubleshooting - Problemas Comuns

### Testes falhando com "Relatório deve existir"

**Problema:** Os testes Cucumber falham com erro `AssertionError: Relatório deve existir`

**Causa:** O servidor backend não está rodando ou não está acessível em `http://localhost:3001`

**Solução:**
1. Certifique-se de que instalou as dependências do servidor:
   ```bash
   install-server-deps.bat
   # ou
   cd server && npm install
   ```

2. Inicie o servidor em um terminal separado ANTES de rodar os testes:
   ```bash
   cd server
   npm run dev
   ```

3. Aguarde a mensagem: `Server is running on port 3001`

4. Agora rode os testes:
   ```bash
   run-tests.bat
   # ou
   cd features && npm test
   ```

### Testes mostrando "0 scenarios, 0 steps"

**Problema:** Cucumber não encontra os arquivos `.feature`

**Solução:** Verifique se está executando o comando na pasta correta:
```bash
cd features
npm test
```

### Erro ao instalar dependências

**Problema:** `npm install` falha

**Solução:**
1. Certifique-se de ter Node.js versão 18 ou superior instalado
2. Execute como administrador se necessário
3. Limpe o cache: `npm cache clean --force`
4. Tente novamente

### Servidor não inicia

**Problema:** Erro ao rodar `npm run dev` no servidor

**Solução:**
1. Verifique se a porta 3001 não está em uso
2. Compile o TypeScript: `npm run build`
3. Verifique se todas as dependências estão instaladas

### Cliente não conecta ao servidor

**Problema:** Erros de CORS ou conexão recusada

**Solução:**
1. Verifique se o servidor está rodando em `http://localhost:3001`
2. Verifique se o cliente está configurado para usar a porta 5173
3. O proxy no `vite.config.ts` deve estar configurado corretamente

## 📦 Scripts Batch Disponíveis (Windows)

- `install-all.bat` - Instala todas as dependências (servidor + cliente + testes)
- `install-server-deps.bat` - Instala apenas dependências do servidor
- `install-client-deps.bat` - Instala apenas dependências do cliente
- `install-test-deps.bat` - Instala apenas dependências dos testes
- `run-tests.bat` - Executa os testes Cucumber
