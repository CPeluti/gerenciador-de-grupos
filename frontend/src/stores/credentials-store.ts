import { defineStore } from 'pinia';
import axios from 'axios';
import { User } from 'src/components/models';

export const credentialsStore = defineStore('credentials', {
  state: () => ({
    user: null,
  }),
  actions: {
    authenticate: async (user: User) => {
      try {
        console.log('authenticating');
        console.log(user)
        const { data } = await axios.post('http://localhost:3030/login', {usuario: user.matricula, senha: user.senha});
        console.log(data.usuario);
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userInfo', JSON.stringify({...data.usuario}));
        console.log(data.usuario)
        // sessionStorage.setItem("token", "Token temporario");
        return true;
      } catch (error) {
        console.error(error);
        throw new Error('Error ao autenticar usuario', error);
      }
    },
    isAuthenticated: async () => {
      console.log('localstorage4',sessionStorage.getItem('token'));
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.post('http://localhost:3030/login/validate', {token});
          console.log(res)
          const data = { authenticated: true };
          return data.authenticated;
        } catch (err) {
            sessionStorage.removeItem('token');
          console.error(err);
          return false;
        }
      }
      return false;
    },
  },
});
