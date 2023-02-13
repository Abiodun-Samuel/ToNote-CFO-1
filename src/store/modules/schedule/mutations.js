export const SET_SCHEDULE_TIME_SLOTS = (state, payload) => {
  state.time_slots = payload;
};

export const SET_PAYMENT_GATEWAYS = (state, payload) => {
  state.payment_gateways = payload;
};

// export const SET_TRANSACTIONS = (state, payload) => {
//   state.transactions = payload;
// };

export const SET_SCHEDULE_COUNTRY = (state, payload) => {
  state.country = payload;
};

export const SET_SCHEDULE_STATES = (state, payload) => {
  state.states = payload;
};

export const SET_SCHEDULE_DETAILS = (state, payload) => {
  state.schedule_details = payload;
};

export const SET_SCHEDULE_DETAILS_LOADER = (state, payload) => {
  state.schedule_details_loading = payload;
};

export const SET_VIRTUAL_SESSION_DETAILS = (state, payload) => {
  state.virtual_session_details = payload;
};

export const SET_VIRTUAL_SESSION_LOADER = (state, payload) => {
  state.session_details_loading = payload;
};

export const SET_SCHEDULE_LOADER = (state) => {
  state.schedule_details_loading = true;
};

export const UNSET_SCHEDULE_LOADER = (state) => {
  state.schedule_details_loading = false;
};

export const SET_AGORA_DETAILS = (state, payload) => {
  state.agora = payload;
};
