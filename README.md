# 🏛️ Huari Web — Inteligência Cívica e Transparência Política

<p align="center">
  <img src="src/assets/images/logoHuari.svg" alt="Logo Huari" width="120" />
</p>

<p align="center">
  <strong>Plataforma cívica independente de código aberto voltada para auditoria fiscal, acompanhamento de proposições legislativas e educação política no Brasil.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React_Router_DOM-7.x-CA4245?logo=reactrouter&logoColor=white" alt="React Router DOM" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
  <img src="https://img.shields.io/badge/Atomic_Design-Strict-F15A24" alt="Atomic Design" />
</p>

---

## 📌 Visão Geral do Projeto

No cenário político contemporâneo, jornalistas, pesquisadores, consultores, advogados e cidadãos enfrentam três desafios estruturais:

1. **Sobrecarga e pulverização de informações:** Dados públicos da Câmara dos Deputados, Senado Federal e TCU encontram-se dispersos, em formatos complexos e de difícil cruzamento.
2. **Ausência de ferramentas especializadas:** Soluções genéricas de IA desconhecem termos e ritos específicos do processo legislativo brasileiro (ex.: PECs, MPVs, quociente eleitoral, cotas CEAP).
3. **Escassez de capacitação prática e sequencial:** Poucas trilhas combinam teoria institucional, dados abertos e aplicação prática de fiscalização cidadã.

### 🎯 Nosso Objetivo
A **Huari** transforma dados abertos da administração pública em inteligência acessível através de uma interface intuitiva, auditoria em tempo real, assistente cívico de IA e cursos formativos gratuitos.

---

## 💻 Arquitetura e Módulos Implementados

A aplicação foi desenvolvida aplicando rigorosamente os princípios de **Atomic Design**, componentização desacoplada e **roteamento declarativo absoluto**.

### 🌟 Telas da Aplicação (`/src/pages`)

| Rota | Tela / Módulo | Descrição |
| :--- | :--- | :--- |
| `/` | **Login / Autenticação** | Login seguro com validação de campos, credenciais salvas, acesso rápido como visitante e login social (Google, GitHub, Apple). |
| `/register` | **Criação de Conta** | Cadastro de usuário com validação de força de senha e termos de privacidade. |
| `/recover-password` | **Recuperação de Senha** | Envio de código de verificação por e-mail institucional/pessoal. |
| `/reset-password` | **Redefinição de Senha** | Criação e confirmação segura de nova credencial. |
| `/dashboard` | **Painel Geral (Home)** | Indicadores do Congresso (594 mandatos, R$ 29,2M gastos, 88,4% presença, 1.240 PLs), grelha 2x2 de destaques, banner educativo e rodapé completo. |
| `/lawmakers` | **Pesquisa de Parlamentares** | Listagem paginada com busca em tempo real (`debounce`), filtros de Estado (UF), Partido e Ordenação (CEAP, Presença, Projetos). |
| `/lawmakers/:id` | **Análise do Parlamentar** | Perfil com status em exercício, barras de despesas por cota (2026), últimas votações em plenário e botão seguir. |
| `/chat` | **Chat Huari (IA Cívica)** | Assistente com respostas embasadas em dados oficiais da Câmara/Senado/TCU, sugestões rápidas, cópia e avaliação de respostas. |
| `/profile` | **Perfil do Usuário / Config** | Edição de dados pessoais, gestão de parlamentares favoritos, alertas de votações e segurança. |
| `/learn` | **Academia Cívica (Catálogo)** | Catálogo de trilhas com filtros em pílulas (*Iniciantes*, *Economia*, *Direito*) e barras de progresso. |
| `/learn/:courseId/:lessonId` | **Player de Aula (Split 70/30)** | Layout com player de vídeo responsivo 16:9 à esquerda e acordeão de módulos/aulas à direita com indicação de conclusão. |

---

## 🧩 Biblioteca de Componentes (Atomic Design)

A camada de componentes em `src/components/` foi construída para permitir reuso extremo e futura integração com API REST em Spring Boot:

* **Átomos:**
  * `SearchInput`: Campo de busca por texto com lógica de **debounce** integrada (`350ms`) e botão de limpeza rápida.
  * `SelectFilter`: Dropdown customizado acessível (`ARIA listbox`) com fechamento automático em clique externo e tecla `Esc`.
  * `Pagination`: Paginação visual inteligente com cálculo dinâmico de páginas adjacentes e elipses (`...`).
  * `ProgressBar`: Barra horizontal com preenchimento em gradiente oficial Huari e percentual dinâmico.
  * `VideoPlayer`: Player de vídeo responsivo 16:9 com suporte a iframes do YouTube, tags HTML5 e capa interativa.
  * `Button`, `InputText`: Elementos de entrada de dados e botões de ação padronizados.
* **Moléculas:**
  * `LawmakerFilters`: Agrupador de busca textual e múltiplos seletores suspensos (Estado, Partido, Ordenação) com botão de reset.
  * `ParliamentarianCard`: Cartão de exibição de parlamentar com avatar, badges de partido/UF, métricas de gabinete e favoritos.
  * `CourseCard`: Cartão de curso com capa, categoria, nível, duração, número de aulas e barra de progresso.
  * `LessonAccordion`: Lista expansível de módulos e aulas com status de conclusão (visto verde) e destaque da aula ativa.
* **Organismos & Layout:**
  * `SideBar`: Barra lateral de navegação com `<NavLink>`, indicador de rota ativa, perfil e ações de logout.
  * `Footer`: Rodapé em 4 colunas com links institucionais, fontes oficiais (Câmara, TCU, CGU) e redes sociais.
  * `ProtectedRoute`: Guardião de autenticação para proteção de rotas privadas.

---

## 🛠️ Tecnologias e Ferramentas

* **Framework Principal:** [React 19](https://react.dev/)
* **Roteamento:** [React Router DOM v7](https://reactrouter.com/) (`BrowserRouter`, `NavLink`, `useNavigate`, `useParams`)
* **Build Tool:** [Vite](https://vitejs.dev/) (Fast HMR & ESM Bundle)
* **Iconografia:** [React Icons (Remix Icons)](https://react-icons.github.io/react-icons/)
* **Design & Estilo:** CSS3 Modular com Variáveis Globais (Design Tokens) e Tipografia *Plus Jakarta Sans*
* **Padronização de Código:** ESLint 10 com regras para React Hooks e Refresh

---

## 🚀 Instalação e Execução

### Pré-requisitos
* **Node.js** (versão 18+ recomendada)
* **npm** ou gerenciador de pacotes equivalente

### 1. Clonar o repositório
```bash
git clone https://github.com/ProHuari/hu-web.git
cd hu-web
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Executar o ambiente de desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:5173` no seu navegador.

### 4. Gerar build para produção
```bash
npm run build
```

---

## 📁 Estrutura de Pastas

```text
hu-web/
├── public/                 # Favicons e arquivos estáticos públicos
├── src/
│   ├── assets/             # Fontes (Plus Jakarta Sans) e imagens da marca
│   ├── components/         # Biblioteca de componentes atômicos e moléculas
│   │   ├── course-card/
│   │   ├── educational-banner/
│   │   ├── footer/
│   │   ├── lawmaker-filters/
│   │   ├── lesson-accordion/
│   │   ├── pagination/
│   │   ├── parliamentarian-card/
│   │   ├── progress-bar/
│   │   ├── protected-route/
│   │   ├── search-input/
│   │   ├── select-filter/
│   │   ├── sidebar/
│   │   ├── user-profile-header/
│   │   ├── user-settings-form/
│   │   └── video-player/
│   ├── pages/              # Páginas e views da aplicação
│   │   ├── chat-huari/
│   │   ├── create-an-account/
│   │   ├── create-new-password/
│   │   ├── dashboard/
│   │   ├── learn/
│   │   ├── lesson-details/
│   │   ├── login/
│   │   ├── parliamentarian-analysis/
│   │   ├── parliamentarians/
│   │   ├── recover-password/
│   │   └── user-profile/
│   ├── styles/             # Tokens, variáveis, tipografia e reset CSS
│   ├── routes.jsx          # Configuração centralizada de rotas (React Router)
│   ├── App.jsx             # Root Provider da aplicação
│   └── main.jsx            # Ponto de entrada do React
├── package.json
└── README.md
```

---

## 👥 Equipe do Projeto

* **Andre** — Tech Lead
* **Gabriel** — UI/UX Design
* **Igor** — Banco de Dados
* **Lucas** — Back-end (Spring Boot)
* **Kauã** — Front-end (React)

---

<p align="center">
  Desenvolvido com dedicação pela equipe <strong>Huari</strong> © 2026.
</p>
