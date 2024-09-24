import AuthRepository from "./AuthRepository";

class AuthService {
  constructor() {
    this.repository = new AuthRepository();
  }

  login(username, password) {
    return this.repository.login(username, password);
  }

  register(params) {
    return this.repository.register(params);
  }
}

export default AuthService;
