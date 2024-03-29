export const documents = (state) => {
  return state.documents;
};

export const documentAuditTrail = (state) => {
  return state.documentAuditTrail;
};

export const statistics = (state) => {
  return state.statistics;
};

export const documentsByStatus = (state) => {
  return state.documentsByStatus;
};

export const userDocument = (state) => {
  return state.document;
};

export const canCancel = (state) => {
  return state.cancel;
};

export const doneDocument = (state) => {
  return state.doneEditing;
};

export const userFeedback = (state) => {
  return state.feedback;
};

export const workingTools = (state) => {
  return state.resourceTools;
};

export const isOpenModal = (state) => {
  return state.isOpenModal;
};

export const guest = (state) => {
  return state.guest;
};

export const confirmGuest = (state) => {
  return state.confirmGuest;
};

export const isDoneLoading = (state) => {
  return state.isDoneLoading;
};

export const isLoading = (state) => {
  return state.isLoading;
};

export const isDocLoading = (state) => {
  return state.isDocLoading;
};

export const isToolLoading = (state) => {
  return state.isToolLoading;
};

export const audit_trails = (state) => {
  return state.audit_trails;
};
export const audit_trails_loader = (state) => {
  return state.audit_trails_loader;
};
export const completedDoc = (state) => {
  return state.completedDoc;
};
export const session_complete = (state) => {
  return state.session_complete;
};
export const shareDocLoader = (state) => {
  return state.shareDocLoader;
};
