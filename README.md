# 🏛️ hu-web

## 📌 Visão Geral

No cenário político contemporâneo, analistas, pesquisadores, assessores parlamentares, consultores eleitorais e estudantes enfrentam três desafios estruturais:

* **Sobrecarga e pulverização de informações:** Pesquisas eleitorais, relatórios de conjuntura, discursos, propostas e dados públicos estão dispersos, sem padronização e de difícil cruzamento.
* **Ausência de ferramentas especializadas:** Soluções genéricas de Inteligência Artificial não possuem o contexto, o vocabulário nem os filtros necessários para análises políticas, eleitorais e de políticas públicas, e as poucas ferramentas existentes possuem uma visão enviesada.
* **Escassez de capacitação prática e sequencial:** Há poucas trilhas estruturadas, ministradas por especialistas e institutos de referência, que combinem teoria, interpretação de dados e aplicação estratégica.

### Nosso Objetivo

A nossa plataforma tem a função de integrar dados públicos a análises estruturadas para garantir uma fácil interpretação por parte de jornalistas políticos, membros de órgãos oficiais e toda a sociedade civil. Além disso, oferece, por meio de conteúdos educativos e cursos, uma educação política inicial para qualquer utilizador da Huari.

---

## 💻 Sobre este Repositório

Este repositório é responsável por todo o desenvolvimento da camada de **front-end** da plataforma Huari. O seu objetivo principal é construir a interface de utilizador (UI), gerir a experiência visual (UX) e integrar os serviços e APIs da aplicação, garantindo uma navegação fluida, interativa e acessível.

## 🛠️ Tecnologias utilizadas

- React
- JavaScript
- Vite
- CSS
- ESLint

## 🚀 Instalação e execução

### Pré-requisitos

- Node.js
- npm

### Instalar as dependências

```bash
npm install
```

### Executar em ambiente de desenvolvimento

```bash
npm run dev
```

### Gerar a versão de produção

```bash
npm run build
```

### Verificar o código com ESLint

```bash
npm run lint
```

## 📁 Estrutura do projeto

```text
hu-web/
├── public/
│   ├── images/
│   │   └── icons/
│   └── fonts/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── fonts/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   │   ├── base/
│   │   ├── layout/
│   │   ├── components/
│   │   └── pages/
│   ├── App.jsx
│   └── main.jsx
├── docs/
│   └── wireframes/
├── index.html
├── package.json
└── README.md
```

## 📐 Convenções do projeto

- Utilizar `src/components/` para componentes React reutilizáveis.
- Utilizar `src/pages/` para componentes que representam páginas.
- Centralizar as importações globais de CSS em `src/styles/main.css`, importado uma única vez em `src/main.jsx`.
- Organizar os estilos compartilhados em `src/styles/`.
- Manter imagens e fontes em `src/assets/` quando forem importadas pelos componentes.
- Utilizar `public/` para arquivos estáticos servidos diretamente.
- Utilizar nomes de arquivos e diretórios em inglês, com letras minúsculas e hífens para separar palavras.
- Utilizar `.jsx` para arquivos de componentes que contenham JSX.

## 👥 Equipe

• Andre – Tech Lead
• Gabriel – Design
• Igor – Banco de dados
• Lucas – Back-end
• Kauã – Front-end

## páginas que serão criadas nesse projeto:

Login, criar conta, nova senha, recuperar senha, home, pesquisa parlamentar, aprenda, aprenda aula, paramentar card, perfil do úsuario, chat huari
