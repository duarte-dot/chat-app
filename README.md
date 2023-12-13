# Chat App

Bem-vindo ao Chat App! Este aplicativo oferece uma plataforma intuitiva e sem complicações para conectar e se comunicar com amigos e colegas.

## Descrição

O Chat App permite que você se comunique sem esforço, compartilhando ideias e construindo conexões mais fortes. O aplicativo é criado com ❤️, combinando uma interface amigável com a potência das últimas tecnologias.

## Principais Recursos

- **Comunicação Sem Esforço:** Conecte-se com outros e comunique-se de maneira fluida.
- **Interface Intuitiva:** Design amigável para uma experiência de chat suave.
- **Compartilhamento de Ideias:** Compartilhe e discuta ideias com facilidade.
- **Tecnologias Modernas:** Construído com as últimas tecnologias para desempenho otimizado.

## Problemas com Erro 404?

Se, ao acessar o Chat App, você se deparar com o erro 404, não se preocupe! Isso pode ser facilmente resolvido limpando os cookies do seu navegador. Siga as etapas abaixo para corrigir o problema:

1. **Limpe os Cookies 🍪:**

   - Acesse as configurações do seu navegador.
   - Procure a seção de privacidade ou configurações avançadas.
   - Encontre a opção para limpar cookies ou dados de navegação.
   - Selecione essa opção e confirme a limpeza dos cookies.

2. **Recarregue a Página:**
   - Após limpar os cookies, recarregue a página do Chat App.

Isso geralmente resolverá o problema do erro 404 e permitirá que você acesse o aplicativo normalmente. Se o problema persistir, sinta-se à vontade para abrir uma issue ou entrar em contato para obter suporte. Caso não resolva, tente o acesso por uma aba anônima 👤

Agradecemos por sua compreensão e paciência! 🛠️

## Dependências

Aqui estão algumas das principais dependências usadas neste projeto:

- **next:** Framework React para construir aplicações web.
- **typescript:** Superset tipado do JavaScript.
- **@upstash-redis:** Ferramenta de controle de banco de dados.
- **@tailwindcss:** Estilização de CSS.
- **axios:** Cliente HTTP para fazer requisições.
- **react:** Biblioteca JavaScript para construir interfaces de usuário.
- **zod:** Declaração e validação de esquemas com foco em TypeScript.
- **@headlessui/react:** Componentes de interface para React sem estilos.

Certifique-se de verificar o arquivo `package.json` para obter a lista completa de dependências e suas versão.

# Como Começar

Para começar com o Chat App, siga estas etapas:

## 1. Clone o repositório.

## 2. Instale as dependências com `npm install`.

## 3. Configure as dependências:

### a. Configuração do Upstash Redis:

<b>Certifique-se de que você tem uma conta no Upstash e crie um banco de dados Redis. Preencha as variáveis no arquivo .env:<b><br>
UPSTASH_REDIS_REST_URL=sua_url <br>
UPSTASH_REDIS_REST_TOKEN=seu_token

### b. Configuração do Google OAuth:

<b>Crie um projeto no Google Developers Console, ative a API do Google+ e obtenha suas credenciais. Preencha as variáveis no arquivo .env:<b><br>
GOOGLE_CLIENT_ID=seu_id <br>
GOOGLE_CLIENT_SECRET=seu_secret

### c. Configuração do JWT:

<b>Preencha a variável no arquivo .env com uma string secreta para assinar os tokens JWT: <b> <br>
JWT_SECRET=secret

### d. Configuração do NextAuth:

<b>Preencha as variáveis no arquivo .env com a URL do seu aplicativo e uma string secreta para NextAuth: <b> <br>
NEXTAUTH_URL=http://localhost:3000 <br>
NEXTAUTH_SECRET=secret

### e. Configuração do Pusher:

<b>Crie uma conta no Pusher e obtenha as credenciais. Preencha as variáveis no arquivo .env: <b> <br>
PUSHER_APP_ID=seu_pusher_id <br>
NEXT_PUBLIC_PUSHER_APP_KEY=sua_chave_pusher <br>
PUSHER_APP_SECRET=seu_pusher_secret

## 4. Execute o aplicativo com `npm run dev`.

Sinta-se à vontade para explorar e personalizar o aplicativo de acordo com suas necessidades!

# Escolhas tecnológicas feitas durante o desenvolvimento.

### Upstash (Redis)

Utilizei o Upstash para armazenamento em cache e dados em tempo real. Sua facilidade de uso e integração eficiente tornam-no uma escolha ideal.

### NextAuth com Google Provider

NextAuth oferece uma solução simples e segura para autenticação social, enquanto a integração com o Google proporciona familiaridade aos usuários.

### Next.js

Next.js, uma estrutura React, oferece SSR e pré-renderização estática para melhor desempenho e experiência do usuário.

### Tailwind CSS

Tailwind CSS simplifica a estilização com sua abordagem "utility-first", proporcionando flexibilidade e eficiência.

### React Hook Form

React Hook Form simplifica a gestão de formulários em React, tornando a validação e manipulação de dados mais eficientes.

### Axios

Axios para requisições HTTP

### Zod

Zod, uma biblioteca de validação TypeScript, aprimora a integridade e confiabilidade dos dados.

### Vercel

Vercel fornece uma plataforma eficiente e escalável para hospedagem, com integração contínua e deploy automatizado.

# Contribuições

Contribuições são bem-vindas! Se encontrar problemas ou tiver sugestões de melhorias, abra uma issue ou crie uma pull request.

Bons bate-papos! 🚀
