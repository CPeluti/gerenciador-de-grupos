import { defineStore } from "pinia";
import axios from "axios";
import { User } from "src/components/models";

export const credentialsStore = defineStore("credentials", {
  state: () => ({
    user: null,
  }),
  actions: {
    authenticate: async (user: User) => {
      try {
        // const { data } = await axios.post("http://localhost:3030/login", user);
        // localStorage.setItem("token", data.token);
        sessionStorage.setItem("token", "Token temporario");
        return true;
      } catch (error) {
        console.error(error);
        throw new Error("Error ao autenticar usuario", error);
      }
    },
    isAuthenticated: async () => {
      console.log(sessionStorage.getItem("token"));
      const token = sessionStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.post("http://localhost:3030/auth", token);
          console.log(res)
          const data = { authenticated: true };
          return data.authenticated;
        } catch (err) {
            sessionStorage.removeItem("token");
          console.error(err);
          return false;
        }
      }
      return false;
    },
  },
});
