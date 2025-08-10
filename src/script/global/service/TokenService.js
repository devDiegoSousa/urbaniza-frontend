/**
 * Decodifica um token JWT e retorna seu payload como um objeto JSON.
 * @param {string} token - O token JWT a ser decodificado.
 * @returns {object|null} O payload do token como um objeto, ou null se o token for inválido.
 */
export function parseJwt(token) {
  if (!token) {
    return null;
  }

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
}
