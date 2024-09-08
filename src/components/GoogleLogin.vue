<script setup> 
// import { ref, reactive } from 'vue';
// import { GoogleAuth } from 'google-auth-library';

// export function useGoogleAuth() {
//   const accessToken = ref(null);
//   const isLoggedIn = ref(false);

//   const login = async () => {
//     try {
//       const auth = new GoogleAuth({
//         clientId: 'import.meta.env.VITE_GOOGLE_CLIENT_ID',
//         scope: 'YOUR_SCOPES',
//       });
//       const authResult = await auth.signIn();
//       accessToken.value = authResult.access_token;
//       isLoggedIn.value = true;
//     } catch (error) {
//       console.error('Login error:', error);
//     }
//   };

//   const logout = () => {
//     accessToken.value = null;
//     isLoggedIn.value = false;
//   };

//   return {
//     accessToken,
//     isLoggedIn,
//     login,
//     logout,
//   };
// }

</script>

<template>
<div id="g_id_onload"
     data-client_id="679412423315-8iu4pug7g2phvovpmn1t49ul4ue3kn5p.apps.googleusercontent.com"
     data-context="use"
     data-ux_mode="popup"
     data-login_uri="http://localhost:8080/login/oauth2/code/google"
     data-nonce=""
     data-auto_prompt="false">
</div>

<div class="g_id_signin"
     data-type="standard"
     data-shape="rectangular"
     data-theme="filled_black"
     data-text="continue_with"
     data-size="large"
     data-locale="en-US"
     data-logo_alignment="left">
</div>
      </template>