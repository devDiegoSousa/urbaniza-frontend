export function alignDropdowns() {
  const dropdowns = document.querySelectorAll('details.dropdown');

  dropdowns.forEach((dropdown) => {
    const menu = dropdown.querySelector('.dropdownMenu');
    if (!menu) return;

    // Ajusta posição se estourar a tela
    const fixDropdownPosition = () => {
      const rect = dropdown.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();

      // Reset antes de medir
      menu.style.left = '';
      menu.style.right = '';

      // Ultrapassa à direita
      if (menuRect.right > window.innerWidth) {
        const overflowRight = menuRect.right - window.innerWidth;
        menu.style.left = `-${overflowRight + 8}px`;
      }

      // Ultrapassa à esquerda
      if (menuRect.left < 0) {
        const overflowLeft = Math.abs(menuRect.left);
        menu.style.left = `${overflowLeft + 8}px`;
      }
    };

    // Aplica correção ao abrir
    dropdown.addEventListener('toggle', () => {
      console.log(dropdown.open)
      if (dropdown.open) {
        requestAnimationFrame(fixDropdownPosition); // espera o render
      }
    });
  });   

  // Fecha dropdowns ao clicar fora
  document.addEventListener('click', (e) => {
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.removeAttribute('open');
      }
    });
  });
}
