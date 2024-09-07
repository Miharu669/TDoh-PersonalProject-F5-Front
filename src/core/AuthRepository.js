import axios from "axios";

export default class AuthRepository {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_ENDPOINT;
  }

  async login(credentials) {
    try {
      const response = await axios.get(this.baseUrl + "/login", {
        auth: {
          username: credentials.username,
          password: credentials.password,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      return error.toJSON();
    }
  }

  async register(credentialsRegister) {
    try {
      const response = await axios.post(this.baseUrl + "/register", {
        username: credentialsRegister.username,
        password: btoa(credentialsRegister.password),
        email: credentialsRegister.email,
      });
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      return error.toJSON();
    }
  }

  async googleLogin(code) {
    try {
      const response = await axios.get(
        `${import.meta.env.GOOGLE_ENDPOINT}?code=${code}`
      );
      return response.data;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await axios.post(this.baseUrl + "/logout");
      return response.data;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
}
