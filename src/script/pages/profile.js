import {PROFILE_URLS } from '../global/config/url.js';
import { authService } from '../global/service/authService.js';
import { reportService } from '../global/service/ReportService.js';
import TokenService from '../global/service/TokenService.js';


// --- Referências aos Elementos HTML ---
const profileNameElement = document.getElementById('profile-name');
const profileLastNameElement = document.getElementById('profile-lastName');
const profileEmailElement = document.getElementById('profile-email');
const profileRoleElement = document.getElementById('profile-role');
// Seções para editar
const editFirstNameButton = profileNameElement.nextElementSibling;
const editLastNameButton = profileLastNameElement.nextElementSibling;
const editEmailButton = profileEmailElement.nextElementSibling;

// Botões de Ação
const logoutButton = document.getElementById('logout-button');
const deleteAccountButton = document.getElementById('deleteAccount-button'); // Botão de excluir conta

const loadingMessageElement = document.getElementById('loading-message'); // Assumindo que este ID exista, se não, crie-o
const errorMessageElement = document.getElementById('error-message');   // Assumindo que este ID exista, se não, crie-o

const deleteModal = document.getElementById('delete-modal');
const deletePasswordInput = document.getElementById('delete-password');
const confirmDeleteButton = document.getElementById('confirm-delete-button');
const cancelDeleteButton = document.getElementById('cancel-delete-button');
const modalMessageElement = document.getElementById('modal-message');


/**
 * Exibe os dados do perfil na interface do usuário.
 * @param {object} profileData - O objeto com os dados do perfil retornado pela API.
 */
function displayProfile(profileData) {
  profileNameElement.textContent = profileData.firstName || 'N/A';
  profileLastNameElement.textContent = profileData.lastName || 'N/A';
  profileEmailElement.textContent = profileData.email || 'N/A';
  
  switch (TokenService.getUserRole()) {
    case "ROLE_CITIZEN":
      profileRoleElement.textContent = "Cidadão";
      break;
    case "ROLE_DEPARTMENT":
      profileRoleElement.textContent = "DEPARTAMENTO";
    default:
      profileRoleElement.textContent = "N/a"
      break;
  }
}

function redirectToLogin() {
    TokenService.clearTokens();
    window.location.href = '/pages/auth/signin.html';
    alert('Sua sessão expirou ou você não tem permissão. Faça login novamente.');
}

async function fetchProfile() {
    try {
        const response = await authService.authenticatedFetch(PROFILE_URLS.GET_PROFILE, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            const profileData = await response.json();
            displayProfile(profileData);
        } else if (response.status === 401 || response.status === 403) {
            console.error('Sua sessão expirou ou você não tem permissão.', 'error');
            redirectToLogin();
        } else {
            const errorData = await response.json();
            console.error(`Erro ao carregar perfil: ${errorData.message || response.statusText}`, 'error');
        }
    } catch (error) {
        console.error(`Erro de rede: Verifique sua conexão.`, error);
    }
}

/**
 * Envia a requisição para atualizar o perfil.
 * @param {object} updateData - Objeto com firstName e/ou lastName.
 */
async function sendUpdateProfile(updateData) {
    try {
      console.log("deu certo até sendUpdate")
      const response = await authService.authenticatedFetch(PROFILE_URLS.UPDATE_PROFILE, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      console.log("deu certo até sendUpdate 2")
      if (response.ok) {
          const updatedProfileData = await response.json();
          displayProfile(updatedProfileData);
      } else if (response.status === 400) {
          const errorData = await response.json();
      } else if (response.status === 401 || response.status === 403) {
          redirectToLogin();
      } else {
          const errorData = await response.json();
      }
    } catch (error) {
    }
}

async function sendDeleteAccount(password) {
    try {
        const response = await reportService.authenticatedFetch(DELETE_ACCOUNT_API_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ password: password })
        });

        if (response.status === 200) {
            deleteModal.classList.add('hidden'); // Esconde o modal
            redirectToLogin(); // Redireciona após exclusão
        } else if (response.status === 400 || response.status === 401) {
            const errorData = await response.json();
            console.error(`Erro: ${errorData.message || 'Senha incorreta ou dados inválidos.'}`, 'error', modalMessageElement);
        } else {
            const errorData = await response.json();
            console.error(`Erro ao excluir conta: ${errorData.message || response.statusText}`, 'error', modalMessageElement);
        }
    } catch (error) {
        console.error(`Erro de rede ao excluir conta: ${error.message}`, 'error', modalMessageElement);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    fetchProfile();

    logoutButton.addEventListener('click', () => {
        redirectToLogin();
    });

    deleteAccountButton.addEventListener('click', () => {
        deleteModal.classList.remove('hidden'); 
        modalMessageElement.classList.add('hidden');
        deletePasswordInput.value = '';
    });

    // Event Listeners do Modal de delete account
    confirmDeleteButton.addEventListener('click', () => {
        const password = deletePasswordInput.value;
        if (password) {
            sendDeleteAccount(password);
        } else {
        }
    });

    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.classList.add('hidden'); // Esconde o modal
    });

    // Event Listeners para botões de edição (ex: Nome)
    editFirstNameButton.addEventListener('click', async () => {
        const currentName = profileNameElement.textContent;
        const newName = prompt('Digite o novo nome:');
        console.log(newName)
        if (newName !== null && newName !== currentName) {
            await sendUpdateProfile({ firstName: newName });
        }
    });
    
    editLastNameButton.addEventListener('click', async () => {
        const currentLastName = profileLastNameElement.textContent;
        const newLastName = prompt('Digite o novo sobrenome:', currentLastName);
        if (newLastName !== null && newLastName !== currentLastName) {
            await sendUpdateProfile({ lastName: newLastName });
        }
    });

    // Para o Email, se você permitir a edição (geralmente mais complexo, precisa de reautenticação/confirmação)
    editEmailButton.addEventListener('click', async () => {
        alert('A edição de e-mail é uma funcionalidade mais complexa e não está implementada nesta versão de demonstração.');
        // Se fosse implementar, exigiria verificação de email, etc.
    });
});