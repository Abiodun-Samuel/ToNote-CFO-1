// import User from "@/api/Auth";
// import router from "@/router/router";
// import { useToast } from "vue-toast-notification";
// const toast = useToast();

// export const logoutUser = ({ commit }, formData) => {
//   User.logout(formData)
//     .then(() => {
//       commit("SET_USER_PROFILE", null);
//       window.localStorage.removeItem("vuex");
//       window.localStorage.clear();
//       window.sessionStorage.clear();
//       router.push({ name: "Login" });
//     })
//     .catch((error) => {
//       if (error.response.status === 401 || error.response.status == 422) {
//         commit("SET_TOKEN", null);
//         router.push({ name: "Login" });
//       }
//     });
// };
