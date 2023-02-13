import Notary from "@/api/Notary";
import { useToast } from "vue-toast-notification";
const toast = useToast();

export const GetNotariesAction = ({ commit }) => {
  commit("SET_RESET_LOADING", true);
  Notary.GetNotariesApi()
    .then((response) => {
      commit("SET_NOTARY_LIST", response.data.data);
      commit("SET_RESET_LOADING", false);
    })
    .catch((error) => {
      if (error) {
        commit("SET_NOTARY_LIST", []);
        commit("SET_RESET_LOADING", false);
      }
    });
};

export const GetNotaryDetailsAction = ({ commit }, id) => {
  commit("SET_NOTARY_DETAILS_LOADER", true);
  Notary.GetNotaryDetailsApi(id)
    .then((response) => {
      commit("SET_NOTARY_DETAILS", response.data.data);
      commit("SET_NOTARY_DETAILS_LOADER", false);
    })
    .catch((error) => {
      if (error) {
        commit("SET_NOTARY_DETAILS", {});
        commit("SET_NOTARY_DETAILS_LOADER", false);
      }
    });
};

export const FilterNotariesAction = ({ commit }, data) => {
  commit("SET_FILTER_LOADING", true);
  Notary.FilterNotariesApi(data)
    .then((response) => {
      commit("SET_NOTARY_LIST", response.data.data);
      commit("SET_FILTER_LOADING", false);
    })
    .catch((error) => {
      if (error) {
        commit("SET_NOTARY_LIST", []);
        commit("SET_FILTER_LOADING", false);
      }
    });
};

export const ComplianceQuesAction = ({ commit }, id) => {
  // if (state.compliance_questionnaire.length == 0) {
  commit("SET_COMPLIANCE_QUES_LOADER", true);
  Notary.ComplianceQuesApi(id)
    .then((response) => {
      commit("SET_COMPLIANCE_QUES", response.data.data);
      commit("SET_COMPLIANCE_QUES_LOADER", false);
    })
    .catch((error) => {
      if (error) {
        commit("SET_COMPLIANCE_QUES", []);
        commit("SET_COMPLIANCE_QUES_LOADER", false);
      }
    });
  // }
};

export const ComplianceRespAction = ({ commit, dispatch }, answers) => {
  commit("SET_COMPLIANCE_RESP_LOADER", true);
  return Notary.ComplianceRespApi(answers)
    .then(() => {
      dispatch(
        "schedule/VirtualSessionDetailsAction",
        answers.answers[0].schedule_id,
        {
          root: true,
        }
      );
      commit("SET_COMPLIANCE_RESP_LOADER", false);
      return true;
    })
    .catch((error) => {
      if (error) {
        commit("SET_COMPLIANCE_RESP_LOADER", false);
      }
      return false;
    });
};

// cancel notary session
export const CancelNotarySession = ({ commit }, payload) => {
  commit("SET_CANCEL_LOADER", true);
  return Notary.UpdateNotarySessionApi(payload)
    .then(() => {
      commit("SET_CANCEL_LOADER", false);
      return true;
    })
    .catch((error) => {
      if (error) {
        commit("SET_CANCEL_LOADER", false);
        return false;
      }
    });
};
// completed notary session
export const CompleteNotarySession = ({ commit }, payload) => {
  commit("SET_COMPLETE_LOADER", true);
  return Notary.UpdateNotarySessionApi(payload)
    .then((response) => {
      console.log(response.data);
      commit("SET_COMPLETE_LOADER", false);
      commit("SET_SESSION_COMPLETE", response.data.data);
      return true;
    })
    .catch((error) => {
      if (error) {
        commit("SET_COMPLETE_LOADER", false);
        return false;
      }
    });
};

// export const clearSession = ({ commit }) => {
//   commit("SET_SESSION_COMPLETE", null);
// };

// leave notary session
export const LeaveNotarySession = ({ commit }, payload) => {
  commit("SET_LEAVE_LOADER", true);
  return Notary.UpdateNotarySessionApi(payload)
    .then(() => {
      commit("SET_LEAVE_LOADER", false);
      return true;
    })
    .catch((error) => {
      if (error) {
        commit("SET_LEAVE_LOADER", false);
        return false;
      }
    });
};
// notary session feedbacks
export const notaryFeedbackAction = ({ commit }, payload) => {
  commit("SET_NOTARY_FEEDBACK_LOADER", true);
  return Notary.notaryFeedbackApi(payload)
    .then(() => {
      commit("SET_NOTARY_FEEDBACK_LOADER", false);
      toast.success("Feedback was sent successfully", {
        timeout: 5000,
        position: "top-right",
      });
      return true;
    })
    .catch((error) => {
      if (error) {
        commit("SET_NOTARY_FEEDBACK_LOADER", false);
        toast.error(error.response.data.data.error, {
          timeout: 5000,
          position: "top-right",
        });
      }
    });

  // try {

  //   return true;
  // } catch (error) {

  // }

  // Notary.notaryFeedbackApi(payload)
  //   .then(() => {
  //     commit("SET_NOTARY_FEEDBACK_LOADER", false);
  //     toast.success("Feedback was sent successfully", {
  //       timeout: 5000,
  //       position: "top-right",
  //     });
  //     return true;
  //   })
  //   .catch((error) => {
  //     if (error) {
  //       commit("SET_NOTARY_FEEDBACK_LOADER", false);
  //       toast.error(error.response.data.data.error, {
  //         timeout: 5000,
  //         position: "top-right",
  //       });
  //     }
  //     return false;
  //   });
};
