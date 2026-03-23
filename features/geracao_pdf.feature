# language: pt
Funcionalidade: Geração de PDFs de Provas
  Como um professor
  Eu quero gerar PDFs de provas individuais
  Para imprimir e distribuir aos alunos com questões e alternativas randomizadas

  Contexto:
    Dado que existem questões cadastradas para geração
    E existe uma prova configurada com questões

  Cenário: Gerar PDFs com questões e alternativas randomizadas
    Dado que existe uma prova com 3 questões
    Quando eu solicito a geração de 5 cópias da prova
    Então 5 PDFs individuais devem ser gerados
    E cada PDF deve ter questões em ordem diferente
    E cada PDF deve ter alternativas em ordem diferente

  Cenário: PDFs contém cabeçalho completo
    Dado que existe uma prova com cabeçalho configurado
    E o cabeçalho tem instituição "UNIFOR"
    E o cabeçalho tem disciplina "Matemática"
    E o cabeçalho tem professor "Dr. Silva"
    E o cabeçalho tem data "2024-06-15"
    Quando eu solicito a geração de 1 cópia da prova
    Então o PDF deve conter o título da prova
    E o PDF deve conter "UNIFOR"
    E o PDF deve conter "Matemática"
    E o PDF deve conter "Dr. Silva"
    E o PDF deve conter "2024-06-15"

  Cenário: Cada página do PDF tem número da prova no rodapé
    Dado que existe uma prova com 10 questões
    Quando eu solicito a geração de 3 cópias da prova
    Então cada PDF deve ter número único no rodapé
    E o primeiro PDF deve ter "Prova Nº 1" no rodapé
    E o segundo PDF deve ter "Prova Nº 2" no rodapé
    E o terceiro PDF deve ter "Prova Nº 3" no rodapé

  Cenário: PDF contém espaço para identificação do aluno
    Dado que existe uma prova configurada
    Quando eu solicito a geração de 1 cópia da prova
    Então o PDF deve conter espaço para nome do aluno
    E o PDF deve conter espaço para CPF do aluno
    E o PDF deve conter espaço para assinatura

  Cenário: Gerar gabarito CSV com respostas corretas
    Dado que existe uma prova com tipo "letters"
    E a prova tem 2 questões configuradas
    Quando eu solicito a geração do gabarito para 3 cópias
    Então um arquivo CSV deve ser gerado
    E o CSV deve ter cabeçalho "Prova,Q1,Q2"
    E o CSV deve ter 3 linhas de dados
    E cada linha deve conter o número da prova e as respostas

  Cenário: Gabarito CSV com identificação por letras
    Dado que existe uma prova com tipo "letters"
    E a primeira questão tem alternativas corretas "A" e "C"
    Quando eu solicito a geração do gabarito para 2 cópias
    Então o gabarito deve conter letras das alternativas corretas
    E as letras devem corresponder à ordem randomizada de cada cópia

  Cenário: Gabarito CSV com identificação por potências
    Dado que existe uma prova com tipo "powers"
    E a primeira questão tem alternativas corretas nas posições 0 e 2
    Quando eu solicito a geração do gabarito para 2 cópias
    Então o gabarito deve conter a soma das potências corretas
    E a soma deve corresponder à ordem randomizada de cada cópia

  Cenário: Validar número mínimo de cópias
    Dado que existe uma prova configurada
    Quando eu solicito a geração de 0 cópias
    Então deve retornar erro "Number of copies must be between 1 and 100"

  Cenário: Validar número máximo de cópias
    Dado que existe uma prova configurada
    Quando eu solicito a geração de 150 cópias
    Então deve retornar erro "Number of copies must be between 1 and 100"

  Cenário: PDFs com alternativas identificadas por letras
    Dado que existe uma prova com tipo "letters"
    E a prova tem uma questão com 4 alternativas
    Quando eu solicito a geração de 1 cópia da prova
    Então o PDF deve mostrar alternativas como "A)", "B)", "C)", "D)"
    E deve ter espaço para "Alternativas marcadas:"

  Cenário: PDFs com alternativas identificadas por potências
    Dado que existe uma prova com tipo "powers"
    E a prova tem uma questão com 4 alternativas
    Quando eu solicito a geração de 1 cópia da prova
    Então o PDF deve mostrar alternativas como "(1)", "(2)", "(4)", "(8)"
    E deve ter espaço para "Soma das alternativas:"

  Cenário: Instruções específicas para cada tipo de prova
    Dado que existe uma prova com tipo "letters"
    Quando eu solicito a geração de 1 cópia da prova
    Então o PDF deve conter instruções sobre marcar letras

  Cenário: Randomização garante cópias diferentes
    Dado que existe uma prova com 5 questões
    Quando eu solicito a geração de 10 cópias da prova
    Então pelo menos 8 cópias devem ter ordem de questões diferente
    E as alternativas devem estar em ordem diferente entre cópias
