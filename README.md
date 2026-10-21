# Frontend Montadora XPTO

![Static Badge](https://img.shields.io/badge/github-repo-blue?logo=git)
![Static Badge](https://img.shields.io/badge/build-passing-brightgreen)

![git](https://www.readmecodegen.com/api/social-icon?name=git&size=32) 
![angular](https://www.readmecodegen.com/api/social-icon?name=angular&size=32) 
![vite](https://www.readmecodegen.com/api/social-icon?name=vite&size=32)
![tailwindcss](https://www.readmecodegen.com/api/social-icon?name=tailwindcss&size=32)
![aws](https://www.readmecodegen.com/api/social-icon?name=aws&size=32) 

Frontend da montadora XPTO, sistema de gerenciamento de números de série de veículos, neste sistema é possivel:

- Adicionar digito verificador com base nos primeiros 14 digitos. (gerado na raiz do backend serieComDv.txt)
- Verificar uma lista de series com digito verificador. (gerado na raiz do backend serieVerificada.txt)
- Gerar relátorio de vendas por países. (gerado na raiz do backend listaTotais.txt)

## Tecnologias usadas

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.25.

PrimeNG foi escolhida como a biblioteca de interface de usuário, usando a biblioteca de componentes avançados.

TailwindCSS é o framework CSS escolhido para esse projeto.

Para os testes a ferramenta usada é o vitest.

## Estrutura de arquivos

```
src/
├── app/
│   ├── app.ts                          
│   ├── app.html                        
│   ├── tab-adicionar/
│   │   └── tab-adicionar.component.ts
│   ├── tab-verificar/
│   │   └── tab-verificar.component.ts
│   └── tab-relatorio/
│       └── tab-relatorio.component.ts
├── domain/
│   ├── serie.ts
│   ├── serie-verificada.ts
│   └── relatorio.ts
└── service/
    └── transacao.service.ts          
```

- Abas com sua lógica fica dentro do próprio componente
- A pasta domain, é a pasta de domínio, onde constam os tipos/interfaces.
- A pasta service, é a pasta com todas as requisições para o backend.
- Todos os testes constam nas suas respectivas páginas, como arquivo specs.


## Development server

Instale as dependencias, acesse a raiz do projeto, e digite:

```bash
npm install
```

Para iniciar o servidor de desenvolvimento:

```bash
ng s
```

Com as dependencias instaladas, e iniciando o servidor de desenvolvimento, o projeto rodará na url `http://localhost:4200/`. O projeto se atualiza quando os arquivos do projeto são alterados.


## Fazer build para deploy

Para buildar o projeto execute:

```bash
ng build
```

Isto compilará o projeto e salvara o artefato em: `dist/`. Por padrão, o processo de build otimiza o projeto de frontend, o desempenho é melhor que o desempenho do servidor de desenvolvimento.

## Executar testes 

Para rodar os testes com [Vitest](https://vitest.dev/) o test runner, execute:

```bash
ng test
```

## Configurações

- A porta usada pelo frontend é a 4200
- A porta usada pelo backend é a 8080
- CORS está liberado apenas para localhost:4200
- base_url é configurável no projeto



