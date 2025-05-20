const TokenService = {
  saveTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  // Recupera os tokens
  getAccessToken: () => localStorage.getItem("accessToken"),
  getRefreshToken: () => localStorage.getItem("refreshToken"),

  // Remove os tokens (por exemplo, no logout)
  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  // Atualiza só o accessToken (por exemplo, via refresh)
  updateAccessToken: (newAccessToken) => {
    localStorage.setItem("accessToken", newAccessToken);
  }
};

export default TokenService;
