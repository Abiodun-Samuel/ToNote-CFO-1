export const token = (state) => {
  return state.token;
};

export const profile = (state) => {
  return state.profile;
};

export const loader = (state) => {
  return state.loader;
};

export const login_loader = (state) => {
  return state.login_loader;
};

export const OTPFlag = (state) => {
  return state.OTPFlag;
};

export const errors = (state) => {
  return state.errors;
};

export const is_notary = (state) => {
  return state.profile?.role[0] == "Notary" ? true : false;
};
