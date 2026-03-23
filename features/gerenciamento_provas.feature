# language: pt
Funcionalidade: Gerenciamento de Provas
  Como um professor
  Eu quero gerenciar provas
  Para poder criar, editar e remover provas a partir de questões cadastradas

  Contexto:
    Dado que existem questões cadastradas no sistema
    E a questão 1 tem o enunciado "Qual é a capital do Brasil?"
    E a questão 2 tem o enunciado "Quanto é 2+2?"
    E a questão 3 tem o enunciado "Qual é a cor do céu?"

  Cenário: Criar uma nova prova com identificação por letras
    Dado que eu estou na página de gerenciamento de provas
    Quando eu clico no botão "Nova Prova"
    E eu preencho o título com "Prova de Geografia"
    E eu seleciono o tipo de identificação "letters"
    E eu seleciono a questão 1
    E eu seleciono a questão 3
    E eu clico em "Salvar Prova" na prova
    Então a prova deve ser criada com sucesso
    E a prova deve ter 2 questões
    E o tipo de identificação deve ser "letters"

  Cenário: Criar uma nova prova com identificação por potências de 2
    Dado que eu estou na página de gerenciamento de provas
    Quando eu clico no botão "Nova Prova"
    E eu preencho o título com "Prova de Matemática"
    E eu seleciono o tipo de identificação "powers"
    E eu seleciono a questão 2
    E eu clico em "Salvar Prova" na prova
    Então a prova deve ser criada com sucesso
    E a prova deve ter 1 questão
    E o tipo de identificação deve ser "powers"

  Cenário: Visualizar preview de prova com letras
    Dado que existe uma prova cadastrada com título "Prova A"
    E a prova tem tipo de identificação "letters"
    E a prova contém a questão 1
    Quando eu visualizo o preview da prova
    Então eu devo ver o título "Prova A"
    E as alternativas devem estar identificadas com letras
    E deve haver espaço para marcar as letras das alternativas

  Cenário: Visualizar preview de prova com potências
    Dado que existe uma prova cadastrada com título "Prova B"
    E a prova tem tipo de identificação "powers"
    E a prova contém a questão 2
    Quando eu visualizo o preview da prova
    Então eu devo ver o título "Prova B"
    E as alternativas devem estar identificadas com potências de 2
    E deve haver espaço para indicar a soma das alternativas

  Cenário: Editar uma prova existente
    Dado que existe uma prova cadastrada com título "Prova Original"
    E a prova contém a questão 1
    Quando eu edito a prova
    E eu altero o título para "Prova Atualizada"
    E eu adiciono a questão 2
    E eu clico em "Salvar Prova" na prova
    Então a prova deve ser atualizada com sucesso
    E o título deve ser "Prova Atualizada"
    E a prova deve ter 2 questões

  Cenário: Remover uma prova
    Dado que existe uma prova cadastrada com título "Prova para Remover"
    Quando eu excluo a prova
    E eu confirmo a exclusão da prova
    Então a prova deve ser removida da lista
    E eu não devo mais ver a prova "Prova para Remover"

  Cenário: Criar prova sem título
    Dado que eu estou na página de gerenciamento de provas
    Quando eu clico no botão "Nova Prova"
    E eu deixo o título da prova vazio
    E eu seleciono a questão 1
    E eu clico em "Salvar Prova" na prova
    Então eu devo ver uma mensagem de erro na criação da prova
    E a prova não deve ser criada no sistema

  Cenário: Criar prova sem selecionar questões
    Dado que eu estou na página de gerenciamento de provas
    Quando eu clico no botão "Nova Prova"
    E eu preencho o título com "Prova Sem Questões"
    E eu não seleciono nenhuma questão
    E eu clico em "Salvar Prova" na prova
    Então eu devo ver uma mensagem de erro na criação da prova
    E a prova não deve ser criada no sistema

  Cenário: Listar todas as provas cadastradas
    Dado que existem 3 provas cadastradas no sistema
    Quando eu acesso a página de gerenciamento de provas
    Então eu devo ver 3 provas na lista de provas
    E cada prova deve exibir seu título
    E cada prova deve exibir a quantidade de questões
    E cada prova deve exibir o tipo de identificação

  Cenário: Preview mostra alternativas com letras corretamente
    Dado que existe uma prova de teste com tipo "letters"
    E a prova contém uma questão com 4 alternativas
    Quando eu visualizo o preview da prova
    Então a primeira alternativa deve ser identificada como "A"
    E a segunda alternativa deve ser identificada como "B"
    E a terceira alternativa deve ser identificada como "C"
    E a quarta alternativa deve ser identificada como "D"

  Cenário: Preview mostra alternativas com potências corretamente
    Dado que existe uma prova de teste com tipo "powers"
    E a prova contém uma questão com 5 alternativas
    Quando eu visualizo o preview da prova
    Então a primeira alternativa deve ser identificada como "1"
    E a segunda alternativa deve ser identificada como "2"
    E a terceira alternativa deve ser identificada como "4"
    E a quarta alternativa deve ser identificada como "8"
    E a quinta alternativa deve ser identificada como "16"
