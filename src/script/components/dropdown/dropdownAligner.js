class DropdownPositioner {
  static adjustPosition(dropdownEl, menuEl) {
    requestAnimationFrame(() => {
      const dropdownRect = dropdownEl.getBoundingClientRect();
      const menuRect = menuEl.getBoundingClientRect();

      let left = 0;

      if (menuRect.right > window.innerWidth) {
        left = window.innerWidth - menuRect.width - dropdownRect.left - 8;
      } else if (menuRect.left < 0) {
        left = 8;
      }

      menuEl.style.left = `${left}px`;
    });
  }
}

class DropdownCloser {
  constructor(dropdown, onClose) {
    this.dropdown = dropdown;
    this.onClose = onClose;
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  activate() {
    document.addEventListener('click', this.handleClickOutside);
  }

  deactivate() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (!this.dropdown.contains(event.target)) {
      this.dropdown.removeAttribute('open');
      this.onClose();
    }
  }
}

class Dropdown {
  constructor(detailsElement, isTouch) {
    this.dropdown = detailsElement;
    this.menu = this.dropdown.querySelector('ul');
    this.isTouch = isTouch;
    this.closer = new DropdownCloser(this.dropdown, () => this.closer.deactivate());

    this.init();
  }

  init() {
    if (this.isTouch) {
      this.dropdown.addEventListener('toggle', () => {
        if (this.dropdown.open) {
          DropdownPositioner.adjustPosition(this.dropdown, this.menu);
          this.closer.activate();
        } else {
          this.closer.deactivate();
        }
      });
    } else {
      this.dropdown.addEventListener('mouseenter', () => {
        this.dropdown.setAttribute('open', '');
        DropdownPositioner.adjustPosition(this.dropdown, this.menu);
      });

      this.dropdown.addEventListener('mouseleave', () => {
        this.dropdown.removeAttribute('open');
      });
    }
  }
}

export class DropdownManager {
  static isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  static initAll() {
    const isTouch = this.isTouchDevice();
    const dropdownElements = document.querySelectorAll('details.dropdown');

    dropdownElements.forEach((el) => new Dropdown(el, isTouch));
  }
}
