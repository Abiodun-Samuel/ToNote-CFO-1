export const end_session_details = (state) => {
  const end_session = {
    localAudio: state.localAudio,
    localVideo: state.localVideo,
    remoteUsers: state.remoteUsers,
  };
  return end_session;
};
export const local_video = (state) => {
  return state.localVideo;
};
