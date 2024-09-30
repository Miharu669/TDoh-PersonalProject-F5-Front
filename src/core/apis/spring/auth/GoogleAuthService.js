// import axios from 'axios';

// export default class GoogleAuthService {
//   constructor() {
//     this.baseUrl = import.meta.env.VITE_API_ENDPOINT;
//   }

//   async login(code) {
//     try {
//       const response = await axios.post(`${this.baseUrl}/auth/login/oauth2/idToken`, null, {
//         headers: {
//           'Content-Type': 'application/json',
//           idToken: code,  
//         },
//       });

//       return response.data;
//     } catch (error) {
//       console.error("Google login error:", error);
//       throw error;
//     }
//   }
// }
