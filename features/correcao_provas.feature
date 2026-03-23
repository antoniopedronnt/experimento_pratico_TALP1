# language: pt
Funcionalidade: Correção de Provas
  Como um professor
  Eu quero corrigir as provas dos alunos
  Para gerar um relatório de notas da turma

  Contexto:
    Dado que tenho um gabarito de provas em CSV
    E tenho as respostas dos alunos em CSV

  Cenário: Correção rigorosa com identificação por letras
    Dado que o gabarito contém:
      | Prova | Q1  | Q2 | Q3    |
      | 1     | A,C | B  | A,B,D |
      | 2     | B   | A  | C,D   |
    E as respostas dos alunos contêm:
      | Prova | Q1  | Q2 | Q3    |
      | 1     | A,C | B  | A,B,D |
      | 2     | B   | C  | C,D   |
    Quando eu corrijo no modo "rigoroso" com tipo "letters"
    Então o aluno da prova 1 deve ter nota 30 de 30
    E o aluno da prova 2 deve ter nota 20 de 30

  Cenário: Correção proporcional com identificação por letras
    Dado que o gabarito contém:
      | Prova | Q1  | Q2 |
      | 1     | A,B | C  |
    E as respostas dos alunos contêm:
      | Prova | Q1 | Q2 |
      | 1     | A  | C  |
    Quando eu corrijo no modo "proporcional" com tipo "letters"
    Então o aluno da prova 1 deve ter nota maior que 0
    E o aluno da prova 1 deve ter nota menor que 20

  Cenário: Correção rigorosa com identificação por potências
    Dado que o gabarito contém:
      | Prova | Q1 | Q2 |
      | 1     | 5  | 8  |
      | 2     | 3  | 4  |
    E as respostas dos alunos contêm:
      | Prova | Q1 | Q2 |
      | 1     | 5  | 8  |
      | 2     | 3  | 2  |
    Quando eu corrijo no modo "rigoroso" com tipo "powers"
    Então o aluno da prova 1 deve ter nota 20 de 20
    E o aluno da prova 2 deve ter nota 10 de 20

  Cenário: Correção proporcional com identificação por potências
    Dado que o gabarito contém:
      | Prova | Q1 |
      | 1     | 5  |
    E as respostas dos alunos contêm:
      | Prova | Q1 |
      | 1     | 1  |
    Quando eu corrijo no modo "proporcional" com tipo "powers"
    Então o aluno da prova 1 deve ter nota maior que 0
    E o aluno da prova 1 deve ter nota menor que 10

  Cenário: Gerar relatório com estatísticas da turma
    Dado que o gabarito contém:
      | Prova | Q1 | Q2 |
      | 1     | A  | B  |
      | 2     | B  | A  |
      | 3     | C  | D  |
    E as respostas dos alunos contêm:
      | Prova | Q1 | Q2 |
      | 1     | A  | B  |
      | 2     | B  | A  |
      | 3     | C  | C  |
    Quando eu corrijo no modo "rigoroso" com tipo "letters"
    Então o relatório deve conter média da turma
    E o relatório deve conter mediana
    E o relatório deve conter maior nota
    E o relatório deve conter menor nota
    E o relatório deve conter taxa de aprovação

  Cenário: Questão totalmente errada no modo rigoroso
    Dado que o gabarito contém:
      | Prova | Q1 |
      | 1     | A  |
    E as respostas dos alunos contêm:
      | Prova | Q1 |
      | 1     | B  |
    Quando eu corrijo no modo "rigoroso" com tipo "letters"
    Então o aluno da prova 1 deve ter nota 0 de 10

  Cenário: Múltiplas alternativas corretas no modo rigoroso
    Dado que o gabarito contém:
      | Prova | Q1    |
      | 1     | A,B,C |
    E as respostas dos alunos contêm:
      | Prova | Q1  |
      | 1     | A,B |
    Quando eu corrijo no modo "rigoroso" com tipo "letters"
    Então o aluno da prova 1 deve ter nota 0 de 10

  Cenário: Download do relatório em CSV
    Dado que o gabarito contém:
      | Prova | Q1 |
      | 1     | A  |
    E as respostas dos alunos contêm:
      | Prova | Q1 |
      | 1     | A  |
    Quando eu solicito o download do relatório em CSV
    Então um arquivo CSV deve ser baixado
    E o CSV deve conter a linha de cabeçalho
    E o CSV deve conter dados das notas
    E o CSV deve conter estatísticas

  Cenário: Modo proporcional não zera questão parcialmente correta
    Dado que o gabarito contém:
      | Prova | Q1    |
      | 1     | A,B,C |
    E as respostas dos alunos contêm:
      | Prova | Q1  |
      | 1     | A,B |
    Quando eu corrijo no modo "proporcional" com tipo "letters"
    Então o aluno da prova 1 deve ter nota maior que 0

  Cenário: Validar formato do CSV de gabarito
    Dado que envio um CSV de gabarito inválido
    Quando eu tento corrigir as provas
    Então o relatório não deve conter notas válidas

  Cenário: Calcular taxa de aprovação corretamente
    Dado que o gabarito contém:
      | Prova | Q1 |
      | 1     | A  |
      | 2     | A  |
      | 3     | A  |
      | 4     | A  |
      | 5     | A  |
    E as respostas dos alunos contêm:
      | Prova | Q1 |
      | 1     | A  |
      | 2     | A  |
      | 3     | A  |
      | 4     | B  |
      | 5     | B  |
    Quando eu corrijo no modo "rigoroso" com tipo "letters"
    Então a taxa de aprovação deve ser 60 por cento
