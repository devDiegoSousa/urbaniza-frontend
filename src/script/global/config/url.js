const API_BASE_URL = 'http://localhost:8282'; // URL base do seu backend Spring Boot. Ajuste a porta se necessário.

const AUTH_URLS = {
    SIGNIN: `${API_BASE_URL}/auth/signin`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    REFRESH: `${API_BASE_URL}/auth/refresh-token`
};

const PROFILE_URLS = {
    GET_PROFILE: `${API_BASE_URL}/api/v1/user/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/api/v1/user/profile/update`,
    DELETE_ACCOUNT: `${API_BASE_URL}/api/v1/user/delete`
};

const REPORT_URLS = {
    GET_MY_REPORTS: `${API_BASE_URL}/api/v1/reports/my-reports`,
    CREATE_REPORT: `${API_BASE_URL}/api/v1/reports`,
};

export {
    API_BASE_URL,
    AUTH_URLS,
    PROFILE_URLS,
    REPORT_URLS
};