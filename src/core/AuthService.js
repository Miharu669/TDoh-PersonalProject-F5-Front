import AuthRepository from "./AuthRepository";

export default class AuthService {
  constructor(credentials) {
    this.repo = new AuthRepository();
    this.credentials = credentials;
  }

  async register() {
    const response = await this.repo.register(this.credentials);
    return response;
  }

  async login() {
    const response = await this.repo.login(this.credentials);
    return response;
  }

  googleLogin = (code) => this.repo.googleLogin(code);
}
