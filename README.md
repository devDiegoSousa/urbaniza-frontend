# Projeto Urbaniza - Front-end (JavaScript e Tailwind CSS)

Este é um projeto frontend utilizando **JavaScript** para a lógica de interação do site e **Tailwind CSS** para o estilo. A estrutura de pastas foi projetada para ser modular e escalável, permitindo fácil manutenção e adição de novas funcionalidades.

---

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
