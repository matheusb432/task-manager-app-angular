# TMA SPA

Aplicação de página única (SPA) para o projeto Task Manager App.

## Pré-requisitos

- [Node.js v16](https://nodejs.org/en/)

- [(Opcional) Visual Studio Code](https://code.visualstudio.com/)

- [(Opcional) Angular CLI](https://angular.io/cli)

- [(Opcional) Docker](https://www.docker.com/products/docker-desktop)

## Configuração

Execute `npm install` para instalar todas as dependências.

## Arquitetura

Este projeto foi construído usando [Angular](https://angular.io/).

A solução de gerenciamento de estado aplicada é RxJS Observable Data Services.

### Estrutura de Pastas

As seguintes pastas estão no subdiretório `src/app`:

- `directives`
  - Diretivas personalizadas para casos de uso comuns.
- `guards`
  - Guards de rota para verificar se um usuário está autenticado antes de acessar uma rota e para prevenir alterações não salvas quando usuários saem de uma página de formulário.
- `helpers`
  - Funções auxiliares e classes gerais.
- `interceptors`
  - Interceptadores HTTP para lidar com autenticação, erros e carregamento.
- `models`
  - Interfaces, modelos, DTOs e objetos de configuração para entidades e serviços.
- `pages`
  - Componentes de rota e componentes específicos de recursos.
- `pipes`
  - Pipes personalizados para casos de uso comuns.
- `services`
  - Serviços para acesso a dados, lógica de negócios e gerenciamento de estado.
- `shared`
  - Componentes e módulos compartilhados.
- `util`
  - Serviços Angular estáticos para casos de uso comuns, principalmente apenas funções puras.
  - Os métodos desses serviços são os mais importantes para adicionar testes unitários, pois eles fornecem uma maneira fácil e previsível de testar o aplicativo, os testes estão em `/util/__tests__`.
  - `/util/constants`
    - Valores constantes usados em toda a aplicação.

## Servidor de Desenvolvimento

Execute `npm run start` para um servidor de desenvolvimento. Acesse `http://localhost:4200/`.

## (Opcional) Configuração do Docker

Execute `docker-compose up --build -d` para construir e executar o contêiner Docker. Acesse `http://localhost:4200/`.

## Executando Testes

Execute `ng test` para executar os testes unitários via [Karma](https://karma-runner.github.io).

## Formatação

Para formatar o código, execute `npm run format`.

## Melhorias Possíveis de Baixa Prioridade

Estas são algumas melhorias arquiteturais e de performance que eventualmente poderiam ser feitas na aplicação, mas não são necessárias para o funcionamento da aplicação.

- Adicionar mais testes unitários e revisar a cobertura.
- Converter serviços Angular estáticos para funções.
- Converter estrutura de pastas para Feature Slices.
- Adicionar TanStack Query para melhorar o gerenciamento de estado no lado do servidor.
  - Configurar cache via setQueryData() e configurações staleTime.

## Contribuições

Sinta-se à vontade para enviar um pull request com quaisquer melhorias que você achar adequadas, sugestões também são bem-vindas!
