import Schedule from "@/api/Schedule";
import { useToast } from "vue-toast-notification";

const toast = useToast();
// import router from "@/router/router";

export const TimeSlotsAction = ({ commit, state }) => {
  if (state?.time_slots?.length === 0) {
    Schedule.TimeSlotsApi()
      .then((response) => {
        commit("SET_SCHEDULE_TIME_SLOTS", response.data);
      })
      .catch((error) => {
        if (error.response.status == 401 || error.response.status == 404) {
          commit("SET_SCHEDULE_TIME_SLOTS", null);
          toast.error(`${error.response.data.errors.root}`);
        }
      });
  }
};

export const PaymentGatewaysAction = ({ commit, state }) => {
  if (state.payment_gateways.length === 0) {
    Schedule.PaymentGatewaysApi()
      .then((response) => {
        commit("SET_PAYMENT_GATEWAYS", response.data.data);
      })
      .catch((error) => {
        if (error) {
          commit("SET_PAYMENT_GATEWAYS", []);
        }
      });
  }
};

export const CountriesAction = ({ commit }) => {
  // if (state?.time_slots?.length === 0) {
  return Schedule.CountriesApi()
    .then((response) => {
      commit("SET_SCHEDULE_COUNTRY", response.data.data);
      return response.data.data[0].id;
    })
    .catch((error) => {
      if (error.response.status == 401 || error.response.status == 404) {
        commit("SET_SCHEDULE_COUNTRY", []);
        toast.error(`${error.response.data.errors.root}`);
      }
      return false;
    });
  // }
};

export const StatesAction = ({ commit }, country_id) => {
  // if (state?.time_slots?.length === 0) {
  Schedule.StatesApi(country_id)
    .then((response) => {
      commit("SET_SCHEDULE_STATES", response.data.data);
    })
    .catch((error) => {
      if (error.response.status == 401 || error.response.status == 404) {
        commit("SET_SCHEDULE_STATES", []);
        toast.error(`${error.response.data.errors.root}`);
      }
    });
  // }
};

export const ScheduleVirtualSessionAction = ({ commit }, formData) => {
  commit("SET_SCHEDULE_DETAILS_LOADER", true);
  return new Promise((resolve, reject) => {
    Schedule.ScheduleVirtualSessionApi(formData)
      .then((response) => {
        commit("SET_SCHEDULE_DETAILS_LOADER", false);
        commit("SET_SCHEDULE_DETAILS", response.data.data);
        commit(
          "transactions/SET_SCHEDULE_TRANSACTION_ID",
          response.data.data.transactions[0].id,
          { root: true }
        );
        resolve();
      })
      .catch((error) => {
        // if (error) {
        commit("SET_SCHEDULE_DETAILS_LOADER", false);
        commit("SET_SCHEDULE_DETAILS", null);
        toast.error(`${error.response.data.message}`);
        commit("transactions/SET_SCHEDULE_TRANSACTION_ID", null, {
          root: true,
        });
        reject();
        // }
        // if (error.response.status == 422) {
        // }
      });
  });
};

// for notary request payment
export const ScheduleTransactionAction = (
  { commit, state },
  payment_gateway
) => {
  Schedule.ScheduleTransactionApi({ id: state.transaction_id, payment_gateway })
    .then(() => {
      commit("transactions/SET_SCHEDULE_TRANSACTION_STATUS", true, {
        root: true,
      });
      toast.success("Congratulations, your request was success");
    })
    .catch((error) => {
      if (error.response.status == 401 || error.response.status == 404) {
        commit("transactions/SET_SCHEDULE_TRANSACTION_STATUS", false, {
          root: true,
        });
        toast.error(`${error.response.data.errors.root}`);
      }
    });
};

// agora
export const GenAgoraTokenAction = ({ commit }, payload) => {
  return Schedule.GenerateAgoraToken(payload)
    .then((response) => {
      commit("SET_AGORA_DETAILS", true);
      window.sessionStorage.setItem(
        "agora",
        JSON.stringify(response.data.data)
      );
      // window.sessionStorage.setItem(
      //   "agora",
      //   JSON.stringify(response.data.data)
      // );
      return response;
    })
    .catch((error) => {
      if (error) sessionStorage.setItem("agora", null);
    });
};

// get VIRTUAL SESSION details validate shchedule
export const VirtualSessionDetailsAction = ({ commit }, id) => {
  commit("SET_VIRTUAL_SESSION_LOADER", true);
  return Schedule.VirtualSessionDetailsApi(id)
    .then((response) => {
      commit("SET_VIRTUAL_SESSION_DETAILS", response.data);
      commit("SET_VIRTUAL_SESSION_LOADER", false);
    })
    .catch(() => {
      commit("SET_VIRTUAL_SESSION_DETAILS", null);
      commit("SET_VIRTUAL_SESSION_LOADER", false);
    });
};
