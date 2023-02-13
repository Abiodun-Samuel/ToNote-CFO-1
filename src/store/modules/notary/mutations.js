export const SET_NOTARY_LIST = (state, payload) => {
  state.notary_list = payload;
};
export const SET_FILTER_LOADING = (state, payload) => {
  state.filter_loading = payload;
};
export const SET_RESET_LOADING = (state, payload) => {
  state.reset_loading = payload;
};
export const NOTARY_READY = (state) => {
  state.notaryReady = true;
};
export const NOTARY_NOT_READY = (state) => {
  state.notaryReady = false;
};
export const SET_COMPLIANCE_QUES = (state, payload) => {
  state.compliance_questionnaire = payload;
};
export const SET_COMPLIANCE_QUES_LOADER = (state, payload) => {
  state.compliance_questionnaire_loading = payload;
};
export const SET_COMPLIANCE_RESP_LOADER = (state, payload) => {
  state.compliance_response_loading = payload;
};

export const SET_CANCEL_LOADER = (state, payload) => {
  state.cancel_loading = payload;
};

export const SET_COMPLETE_LOADER = (state, payload) => {
  state.complete_loading = payload;
};

export const SET_LEAVE_LOADER = (state, payload) => {
  state.leave_loading = payload;
};
export const SET_NOTARY_DETAILS_LOADER = (state, payload) => {
  state.notary_details_loading = payload;
};
export const SET_NOTARY_DETAILS = (state, payload) => {
  state.notary_details = payload;
};
export const SET_NOTARY_FEEDBACK_LOADER = (state, payload) => {
  state.feedback_loading = payload;
};

