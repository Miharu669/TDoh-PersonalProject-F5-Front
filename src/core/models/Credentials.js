export default class Credentials {
    #email;
    #password;
  
    constructor(email, password) {
      if (!this.isValidEmail(email)) {
        throw new Error('Invalid email format');
      }
      if (!this.isValidPassword(password)) {
        throw new Error('Password must be at least 8 characters long');
      }
  
      this.#email = email;
      this.#password = password;
    }
  
    getEmail() {
      return this.#email;
    }
  
    getPassword() {
      return this.#password;
    }
  
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  
    isValidPassword(password) {
      return password && password.length >= 8;
    }
  }
  