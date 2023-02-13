export const SET_LOCAL_USER = (state, payload) => {
  state.localAudio = payload.localAudio;
  state.localVideo = payload.localVideo;
};
export const UNSET_LOCAL_USER = (state) => {
  state.localAudio = null;
  state.localVideo = null;
};
export const SET_REMOTE_USERS = (state, payload) => {
  state.remoteUsers.push(payload.remoteUsers);
};
export const UNSET_REMOTE_USERS = (state) => {
  state.remoteUsers = [];
};
