const TokenService = {
  saveTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
  },
  
  setUserRole: (role) => {localStorage.setItem("userRole", role)},
  getUserRole: () => localStorage.getItem("userRole"),

  getAccessToken: () => localStorage.getItem("accessToken"),
  getRefreshToken: () => localStorage.getItem("refreshToken"),

  updateAccessToken: (newAccessToken) => {
    localStorage.setItem("accessToken", newAccessToken);
  }

};

export default TokenService;
