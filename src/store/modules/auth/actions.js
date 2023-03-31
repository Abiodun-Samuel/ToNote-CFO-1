import User from "@/api/Auth";
import router from "@/router/router";
import { useToast } from "vue-toast-notification";
const toast = useToast();

export const logoutUser = ({ commit }, formData) => {
  User.logout(formData)
    .then(() => {
      commit("SET_TOKEN", null);
      window.localStorage.clear();
      if (process.env.NODE_ENV == "development") {
        router.push({ name: "Login" });
      } else {
        window.location.href = process.env.VUE_APP_URL_AUTH_STAGING;
      }
    })
    .catch((error) => {
      if (error.response.status === 401 || error.response.status == 422) {
        commit("SET_TOKEN", null);
        router.push({ name: "Login" });
      }
    });
};

export const userVerifyOTP = ({ commit }, formData) => {
  formData.flag == 0
    ? commit("SET_FLAG", { data: formData.payload })
    : commit("SET_FLAG", {});

  commit("SET_LOADER", true);
  User.verifyOTP(formData.payload)
    .then((response) => {
      commit("SET_TOKEN", response.data.token);
      commit("SET_TOKEN_TYPE", "Bearer");
      User.show().then((response) => {
        commit("SET_USER_PROFILE", response.data.data);

        router.push({
          name: "document.edit",
          params: { document_id: router.currentRoute.value.query.di },
        });

        setTimeout(() => {
          commit("SET_LOADER", false);
        }, 1000);
      });
    })
    .catch((error) => {
      commit("SET_LOADER", false);
      if (error.response.status == 422) {
        toast.error(error.response.data.message, {
          timeout: 5000,
          position: "top-right",
        });
      } else if (error.response.status == 401) {
        let hasError = "";
        if (error.response.data?.data?.error != "") {
          hasError = error.response.data?.data?.error;
        }
        if (error.response.data?.errors?.root) {
          hasError = error.response.data?.errors?.root;
        }

        if (hasError == "You are not a participant in this document") {
          router.push({ name: "Error" });
        }

        toast.error(hasError, {
          timeout: 5000,
          position: "top-right",
        });
      }
    });
};

export const resetPassword = ({ commit }, formData) => {
  User.changePassword(formData)
    .then(() => {
      commit("SET_FLAG", {});

      toast.success("Account created successfully", {
        timeout: 5000,
        position: "top-right",
      });

      setTimeout(() => {
        window.location.href = process.env.VUE_APP_URL_WEBSITE_STAGING;
      }, 2000);
    })
    .catch((error) => {
      if (error.response.status == 422) {
        console.log(error.response);
      }
    });
};

export const userResendVerifyOTP = ({ commit }, formData) => {
  User.resendVerifyOTP(formData).then(() => {
    commit("SET_RESEND_OTP", true);
    toast.success("OTP has been sent to your email", {
      timeout: 5000,
      position: "top-right",
    });
  });
};

export const setAuthentication = ({ commit }, data) => {
  commit("SET_TOKEN", data.token);
  commit("SET_TOKEN_TYPE", "Bearer");

  User.show()
    .then((response) => {
      commit("SET_USER_PROFILE", response.data.data);
      if (data.documentId != undefined && data.edit == 1) {
        return router.push({
          name: "document.edit",
          params: { document_id: data.documentId },
        });
      }
      if (data.documentId != undefined && data.edit == 0) {
        return router.push({
          name: "document.audit",
          params: { document_id: data.documentId },
        });
      }
      if (data.status != "") {
        return router.push({
          name: "Dashboard",
          query: { status: data.status },
        });
      }
    })
    .catch((error) => {
      if (error.response.status == 401 || error.response.status == 404) {
        window.location.href = process.env.VUE_APP_URL_AUTH_STAGING;
      }
    });
};

export const setAuthForDocumentUpload = ({ commit }, token) => {
  commit("SET_TOKEN", token);
  commit("SET_TOKEN_TYPE", "Bearer");
  User.show().then((response) => {
    commit("SET_USER_PROFILE", response.data.data);
    router.push({ name: "document.upload" });
  });
};

export const loginFromDashboard = ({ commit }, token) => {
  commit("SET_LOGIN_LOADER", true);
  commit("SET_TOKEN", token);
  commit("SET_TOKEN_TYPE", "Bearer");

  User.show()
    .then((response) => {
      commit("SET_USER_PROFILE", response.data.data);
      commit("SET_LOGIN_LOADER", false);
    })
    .catch((error) => {
      if (error.response.status === 401 || error.response.status == 422) {
        commit("SET_TOKEN", null);
        router.push({ name: "Login" });
      }
      commit("SET_USER_PROFILE", null);
      commit("SET_LOGIN_LOADER", false);
    });
};

export const loginUser = ({ commit }, formData) => {
  User.login(formData)
    .then((response) => {
      commit("SET_TOKEN", response.data.token);
      // console.log(response.data.token);
      commit("SET_TOKEN_TYPE", response.data.token_type);

      User.show().then((response) => {
        commit("SET_USER_PROFILE", response.data.data);
        router.push({ name: "document.dashboard" });

        toast.success("Welcome to ToNote ", {
          timeout: 5000,
          position: "top-right",
        });
      });
    })
    .catch((error) => {
      if (error?.response?.status == 401 || error?.response?.status == 404) {
        commit("SET_AUTH_ERROR", error?.response?.data?.message);
        toast.error(`${error?.response?.data?.errors?.root}`, {
          timeout: 5000,
          position: "top-right",
        });
      }
    });
};

export const verifyUserByPassword = ({ commit, state }, formData) => {
  commit("SET_VERIFY_LOADER", true);

  User.ScheduleSessionVerifyApi(formData)
    .then((response) => {
      commit("SET_TOKEN", response.data.token);
      commit("SET_TOKEN_TYPE", response.data.token_type);

      return User.show().then((response) => {
        commit("SET_USER_PROFILE", response.data.data);
        commit("SET_VERIFY_LOADER", false);

        router.push({
          name: "session-prep",
          params: { session_id: formData.session_id },
          query: { token: state.token },
        });
        toast.success("Welcome to ToNote ", {
          timeout: 5000,
          position: "top-right",
        });
      });
    })
    .catch((error) => {
      commit("SET_VERIFY_LOADER", false);

      if (error.response.status == 401 || error.response.status == 404) {
        commit("SET_AUTH_ERROR", error.response.data.message);
        toast.error(`${error.response.data.errors.root}`, {
          timeout: 5000,
          position: "top-right",
        });
      }
      if (error.response.status == 422) {
        commit("SET_AUTH_ERROR", error.response.data.message);
        toast.error(`${error.response.data.message}`, {
          timeout: 5000,
          position: "top-right",
        });
      }
    });
};
