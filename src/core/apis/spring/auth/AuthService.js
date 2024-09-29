import AuthRepository from "./AuthRepository";

export default class AuthService {
  #repo;
  #credentials;

  constructor(credentials) {
    this.#repo = new AuthRepository();
    this.#credentials = credentials;
  }

  async login() {
    try {
      const response = await this.#repo.login(this.#credentials);
      if (response && response.id && response.access_token) {
        return response;
      } else {
        throw new Error('Invalid login response. Please check your credentials.');
      }
    } catch (error) {
      console.error("Error during login in AuthService:", error);
      throw error;
    }
  }
}

