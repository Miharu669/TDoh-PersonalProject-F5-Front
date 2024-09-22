import apiClient from "./../../axiosConfig";


class AuthService {
  constructor(credentials) {
    this.credentials = credentials;
  }

  async login() {
    return apiClient.post("/login", this.credentials);
  }

  googleLogin(googleIdToken) {
    return apiClient.post("/google-login", { idToken: googleIdToken });
  }
}

export default AuthService;