import axios from "axios"

export default class AuthRepository {

    constructor() {
        this.baseUrl = import.meta.env.VITE_API_ENDPOINT
    }

    async login(credentials) {
        const { data, status } = await axios.get(this.baseUrl + '/login', {
            auth: {
                username: credentials.getUsername(),
                password: credentials.getPassword()
            },
            validateStatus: () => true
        });
        return status === 200 ? data : { error: 'Incorrect username or password' };
    }
    async register({ username, password, email }) {
        try {
            const response = await axios.post(this.baseUrl + '/register', {
                username,
                password: btoa(password),
                email,
            });

            return response.data;

        } catch (error) {
            console.error('Error during registration:', error.toJSON());
            return error;
        }
    }
}