import axios from "https://esm.sh/axios";

let accessToken = null;

/**
 * Função para registrar um novo usuário.
 * @param {object} userDetails - Objeto contendo os dados do novo usuário.
 * @param {string} userDetails.firstName - O primeiro nome do usuário.
 * @param {string} userDetails.lastName - O sobrenome do usuário.
 * @param {string} userDetails.email - O email do usuário.
 * @param {string} userDetails.password - A senha do usuário.
 * @returns {Promise<object>} A resposta do servidor.
 */
export async function signupService(userDetails) {
  try {
    const response = await axios.post(
      "http://localhost:8282/auth/signup",
      userDetails
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Função para autenticar um usuário.
 * @param {object} userDetails - Objeto contendo os dados do novo usuário.
 * @param {string} userDetails.email - O email do usuário.
 * @param {string} userDetails.password - A senha do usuário.
 * @returns {Promise<object>} A resposta do servidor.
 */
export async function signinService(userDetails) {
  try {
    const response = await axios.post(
      "http://localhost:8282/auth/signin",
      userDetails
    );

    const data = response.data;

    if (data && data.accessToken) {
      setToken(data.accessToken);
      return true;
    } else {
      console.error(
        "Erro: O token não foi encontrado na resposta do servidor."
      );
      return false;
    }
  } catch (error) {
    // Trata erros de rede ou respostas com status de erro (4xx, 5xx)
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error("Erro de autenticação:", error.response.data);
    } else if (error.request) {
      // A requisição foi feita, mas não houve resposta
      console.error(
        "Erro: O servidor não respondeu. Verifique se ele está rodando no endereço correto."
      );
    } else {
      // Erro ao configurar a requisição
      console.error("Erro ao configurar a requisição:", error.message);
    }
    return false;
  }
}

/**
 * Armazena o token de acesso na memória.
 * @param {string} token - O JWT recebido da API.
 */
function setToken(token) {
  accessToken = token;
}

/**
 * Retorna o token de acesso armazenado.
 * @returns {string|null} O token ou null se não houver nenhum.
 */
export function getToken() {
  return accessToken;
}
