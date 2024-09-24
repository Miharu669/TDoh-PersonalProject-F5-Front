import axios from "axios";

export default class AuthRepository {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_ENDPOINT;
  }

  async login(username, password) {
    const token = btoa(`${username}:${password}`);
    const headers = {
      Authorization: `Basic ${token}`,
    };
    try {
      const { data, status } = await axios.get(`${this.baseUrl}/auth/login`, {
        headers,
        validateStatus: () => true,
      });
      if (status === 200) {
        return data;
      } else {
        return { error: "Incorrect username or password" };
      }
    } catch (error) {
      console.error("Error during basic login:", error);
      return { error: "An error occurred during login" };
    }
  }

  async register({ username, password, email }) {
    try {
      const response = await axios.post(`${this.baseUrl}/register`, {
        username,
        password: btoa(password),
        email,
      });

      return response.data;
    } catch (error) {
      console.error("Error during registration:", error.response);
      return { error: "Registration failed" };
    }
  }
}
