# Módulo HTTP e Rotas

## Requisitos de uma aplicação de transações

### Requisitos funcionais - RF

- [X] O usuário deve poder criar uma nova transação;
- [X] O usuário deve poder obter um resumo da sua conta;
- [X] O usuário deve poder listar todas transações que já ocorreram;
- [X] O usuário deve poder visualizar uma transação úncia;

### Requisitos de negócio - RN

- [X] A transação pode ser do tipo crédito que somará ao valor total, ou débito que subtrairá;
- [X] Deve ser possível identificarmos o usuário entre as requisições;
- [X] O usuário só pode visualizar transações o qual ele criou;

## Cookies

Formas da gente manter contexto entre requisições

## Testes

### Unitários -> unidade da sua aplicação

### Integração -> comunicação entre duas ou mais unidades

### E2E - ponta a ponta -> simulam um usuário operando na nossa aplicação

front-end: abre a página de login, digite o texto <nathan@example.com> no campo com Id email, clique no botão
back-end: chamadas HTTP, websockets, camadas que se comunicam com o front-end da aplicação

Pirâmide de testes: E2E (não dependem de nenhuma tecnologia, não dependem de arquitetura)
