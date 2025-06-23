# Projeto Urbaniza - Front-end (JavaScript e Tailwind CSS)

Este é um projeto frontend utilizando **JavaScript** para a lógica de interação do site e **Tailwind CSS** para o estilo. A estrutura de pastas foi projetada para ser modular e escalável, permitindo fácil manutenção e adição de novas funcionalidades.

---

## ✅ Itens necessários

Para rodar este projeto, você precisa ter os seguintes itens instalados na sua máquina:
- Visual Studio Code (VSCode)
- Extensão Live Server no VSCode
- Node.js

---

## 🚀 Como rodar o projeto

1. **Abra o projeto no VSCode.**
2. **Execute o Live Server**:
   - Clique com o botão direito no arquivo `index.html` ou na tela que deseja visualizar e selecione **"Open with Live Server"**.
3. **Inicie o Tailwind CSS:**
   - No terminal, rode o comando:
     ```bash
     npm run dev
     ```
   - Isso vai gerar o CSS automaticamente para o projeto.

---

## 🖥️ Telas funcionando

- Signin (Login)
urbaniza-frontend\pages\auth\signin.html

- Signup (Cadastro)
urbaniza-frontend\pages\auth\signup.html

- My Reports (Cidadão)
urbaniza-frontend\pages\dashboard\citizen\my-reports.html

- Profile (Ambos os usuários)
urbaniza-frontend\pages\user\profile.html

- Denúncias Públicas (Órgãos Públicos)
urbaniza-frontend\pages\dashboard\department\my-reports.html
---

## ✅ Observação
Testem todas as telas antes de confirmar as que realmente estão funcionando e atualizem essa lista se necessário.

## Estrutura de Pastas

### `assets/`
- **`fonts/`**: Contém fontes personalizadas.
- **`images/`**: Contém imagens do projeto (ex: logo, banners).
- **`icons/`**: Contém ícones usados em várias partes do site.

### `pages/`
- **`home/`**: Arquivos relacionados à página inicial.
- **`about/`**: Arquivos relacionados à página "Sobre".
- **`contact/`**: Arquivos relacionados à página de contato.

### `src/`
- **`script/`**: Scripts JavaScript para a lógica de interação.
  - **`global/`**: Scripts globais que afetam o site inteiro (ex: manipulação de DOM, funções utilitárias).
  - **`pages/`**: Scripts específicos para cada página.
  
- **`style/`**: Arquivos CSS ou Tailwind CSS.
  - **`global/`**: Estilos globais para o site, incluindo a configuração do **Tailwind CSS**.
  - **`pages/`**: Estilos específicos para cada página, mantendo os estilos isolados.

### `index.html`
- Arquivo HTML principal que estrutura a página inicial.

### `tailwind.config.js`
- Arquivo de configuração do Tailwind CSS, onde você pode personalizar a instalação do Tailwind e adicionar temas, cores, fontes, etc.
