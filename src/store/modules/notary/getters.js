export const notary_list = (state) => {
  return state.notary_list;
};
export const filter_loading = (state) => {
  return state.filter_loading;
};
export const reset_loading = (state) => {
  return state.reset_loading;
};
export const compliance_questionnaire = (state) => {
  return state.compliance_questionnaire;
};
export const compliance_questionnaire_loading = (state) => {
  return state.compliance_questionnaire_loading;
};
export const compliance_response_loading = (state) => {
  return state.compliance_response_loading;
};
export const cancel_loading = (state) => {
  return state.cancel_loading;
};
export const complete_loading = (state) => {
  return state.complete_loading;
};
export const leave_loading = (state) => {
  return state.leave_loading;
};

export const notary_details = (state) => {
  return state.notary_details;
};
export const notary_details_loading = (state) => {
  return state.notary_details_loading;
};
export const feedback_loading = (state) => {
  return state.feedback_loading;
};
export const feedbacks = (state) => {
  return state.notary_details?.feedbacks;
};

export const avr_rating = (state) => {
  if (!state.notary_details?.feedbacks?.length) return 0;
  const total = state.notary_details?.feedbacks?.reduce(
    (total, num) => total + Number(num.rating),
    0
  );
  return ((total / (state.notary_details?.feedbacks?.length * 5)) * 5).toFixed(
    1
  );
};
