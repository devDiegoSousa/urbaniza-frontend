import { API_BASE_URL, AUTH_URLS } from "../config/url.js";
import TokenService from "./TokenService.js";

const authService = {
  async signin(email, password) {
    try {
      const response = await fetch(`${AUTH_URLS.SIGNIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erro desconhecido ao fazer login"
        );
      }
      const data = await response.json();
      TokenService.saveTokens(data.accessToken, data.refreshToken);
      TokenService.setUserRole(data.role);
      return data;
    } catch (error) {
      console.error("Erro na chamada signIn da API:", error);
      throw new Error(
        error.message || "Não foi possível conectar ao servidor."
      );
    }
  },
  async signup(firstName, lastName, email, password) {
    try {
      const response = await fetch(`${AUTH_URLS.SIGNUP}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          throw new Error("Email já registrado.");
        }
        throw new Error(errorData.message || "Erro desconhecido ao cadastrar.");
      }
      return { message: "Cadastro realizado com sucesso! Faça seu login." };
    } catch (error) {
      console.error("Erro na chamada signUp da API:", error);
      throw new Error(
        error.message || "Não foi possível conectar ao servidor."
      );
    }
  },
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.error(
        "Erro: Refresh token não encontrado. Por favor, faça login novamente."
      );
      this.clearAuthTokens();
      throw new Error("Sessão expirada. Faça login novamente.");
    }
    try {
      const response = await fetch(`${AUTH_URLS.REFRESH}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          Accept: "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        TokenService.updateAccessToken(data.accessToken);
        console.log("Token de acesso renovado com sucesso!");
        return data.accessToken;
      }

      if (response.status === 401 || response.status === 403) {
        console.error("Refresh token inválido ou expirado. Sessão encerrada.");
        this.clearAuthTokens(); // Limpa tokens e força logout
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const errorData = await response.json();
      console.error(
        "Erro ao renovar token da API:",
        errorData.message || response.statusText
      );
      throw new Error(
        `Erro ao renovar token: ${errorData.message || response.statusText}`
      );
    } catch (error) {
      console.error("Erro na requisição refreshAccessToken:", error);
      this.clearAuthTokens();
      throw error;
    }
  },
  async authenticatedFetch(url, options = {}) {
    let accessToken = TokenService.getAccessToken();

    if (!accessToken) {
      console.error(
        "Erro: Access token não encontrado. Faça login para acessar."
      );
      this.clearAuthTokens(); // Limpa se por algum motivo não tem access token mas tem refresh
      throw new Error("Você não está autenticado. Faça login para continuar.");
    }

    options.headers = options.headers || {};
    options.headers["Authorization"] = `Bearer ${accessToken}`;

    try {
      let response = await fetch(url, options);

      if (response.status === 401 && !options._retryCount) {
        console.warn("Access token expirado. Tentando renovar...");

        try {
          const newAccessToken = await this.refreshAccessToken();
          options.headers["Authorization"] = `Bearer ${newAccessToken}`;
          options._retryCount = 1;
          response = await fetch(url, options);
        } catch (refreshError) {
          console.error(
            "Falha ao renovar token, redirecionando para login:",
            refreshError
          );
          throw refreshError;
        }
      }

      if (response.status === 401 || response.status === 403) {
        this.clearAuthTokens();
        const errorData = await response.json();
        throw new Error(
          `Acesso negado: ${errorData.message || response.statusText}`
        );
      }
      return response;
    } catch (error) {
      console.error("Erro em authenticatedFetch:", error);
      throw error;
    }
  },

  clearAuthTokens() {
    TokenService.clearTokens();
    console.log("Tokens de autenticação limpos.");
  },

  isAuthenticated() {
    return TokenService.getAccessToken() !== null;
  },
};

export { authService };
