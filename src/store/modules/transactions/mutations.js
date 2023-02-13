//  transactions during schedule
export const SET_SCHEDULE_TRANSACTION_ID = (state, payload) => {
  state.transaction_id = payload;
};
export const SET_SCHEDULE_TRANSACTION_STATUS = (state, payload) => {
  state.transaction_status = payload;
};
// other trnasactions
export const SET_TRANSACTION_LOADER = (state, payload) => {
  state.transaction_loading = payload;
};
export const SET_TRANSACTION_RESULT = (state, payload) => {
  state.transaction_result = payload;
};
