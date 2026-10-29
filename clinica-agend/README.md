# Sistema de Agendamento de Consultas

Aplicação para gerenciar pacientes, médicos e consultas da Clínica Saúde & Bem-estar.

## Requisitos

- Node.js 20.9 ou superior
- MongoDB local ou uma instância MongoDB Atlas

## Configuração

1. Na pasta do projeto, instale as dependências:

   ```bash
   npm install
   ```

2. Crie ou ajuste `.env.local` na raiz do projeto:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/clinica_saude
   JWT_SECRET=defina-uma-chave-segura
   ```

   Para MongoDB Atlas, use a URI de conexão fornecida pelo Atlas. Não compartilhe nem versione o `.env.local`.

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse [http://localhost:3000](http://localhost:3000).

## Comandos

- `npm run dev`: inicia o servidor de desenvolvimento.
- `npm run build`: valida e prepara a versão de produção.
- `npm start`: inicia o servidor de produção após `npm run build`.

Os mesmos comandos também podem ser executados na pasta pai `frontend/clinica`; eles serão encaminhados automaticamente para este projeto.

## Funcionalidades

- Cadastro, edição, listagem e remoção de pacientes e médicos.
- Agendamento de consultas e atualização de status.
- Bloqueio de agendamentos no mesmo horário para o mesmo médico.
- Proteção contra remoção de pacientes e médicos que já possuem consultas.