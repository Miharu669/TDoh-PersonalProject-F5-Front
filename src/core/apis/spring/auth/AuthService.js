import axios from "axios";

export default class AuthService {
  constructor(credentials) {
    this.credentials = credentials;
  }

  login() {
    return axios.post("import.meta.env.VITE_API_ENDPOINT/login", this.credentials);
  }

  googleLogin(googleIdToken) {
    return axios.post("import.meta.env.VITE_GOOGLE_ENDPOINT", { token: googleIdToken });
  }
}