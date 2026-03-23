# language: pt
Funcionalidade: Gerenciamento de Questões
  Como um professor
  Eu quero gerenciar questões de provas
  Para poder criar, editar e remover questões com suas alternativas

  Cenário: Criar uma nova questão com alternativas
    Dado que eu estou na página de gerenciamento de questões
    Quando eu clico no botão "Nova Questão"
    E eu preencho o enunciado com "Qual é a capital do Brasil?"
    E eu adiciono a alternativa "São Paulo" como incorreta
    E eu adiciono a alternativa "Rio de Janeiro" como incorreta
    E eu adiciono a alternativa "Brasília" como correta
    E eu adiciono a alternativa "Salvador" como incorreta
    E eu clico em "Salvar"
    Então a questão deve ser criada com sucesso
    E eu devo ver a questão na lista com 4 alternativas
    E a alternativa "Brasília" deve estar marcada como correta

  Cenário: Editar uma questão existente
    Dado que existe uma questão cadastrada com o enunciado "Qual é 2+2?"
    E a questão tem a alternativa "3" como incorreta
    E a questão tem a alternativa "4" como correta
    Quando eu clico em "Editar" na questão
    E eu altero o enunciado para "Quanto é 2+2?"
    E eu adiciono a alternativa "5" como incorreta
    E eu clico em "Salvar"
    Então a questão deve ser atualizada com sucesso
    E o enunciado deve ser "Quanto é 2+2?"
    E a questão deve ter 3 alternativas

  Cenário: Remover uma questão
    Dado que existe uma questão cadastrada com o enunciado "Teste de remoção"
    Quando eu clico em "Excluir" na questão
    E eu confirmo a exclusão
    Então a questão deve ser removida da lista
    E eu não devo mais ver a questão "Teste de remoção"

  Cenário: Criar questão sem enunciado
    Dado que eu estou na página de gerenciamento de questões
    Quando eu clico no botão "Nova Questão"
    E eu deixo o enunciado vazio
    E eu adiciono a alternativa "Teste" como correta
    E eu clico em "Salvar"
    Então eu devo ver uma mensagem de erro
    E a questão não deve ser criada

  Cenário: Criar questão sem alternativas
    Dado que eu estou na página de gerenciamento de questões
    Quando eu clico no botão "Nova Questão"
    E eu preencho o enunciado com "Questão sem alternativas"
    E eu não adiciono nenhuma alternativa
    E eu clico em "Salvar"
    Então eu devo ver uma mensagem de erro
    E a questão não deve ser criada

  Cenário: Listar todas as questões cadastradas
    Dado que existem 3 questões cadastradas no sistema
    Quando eu acesso a página de gerenciamento de questões
    Então eu devo ver 3 questões na lista
    E cada questão deve exibir seu enunciado
    E cada questão deve exibir suas alternativas
    E as alternativas corretas devem estar destacadas
