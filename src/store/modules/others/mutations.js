// schedule video signing form data
//stage one (document title and upload file)
export const SET_TEMPLATE_TYPE = (state, payload) => {
  state.schedule_formdata.TemplateType = payload;
};

// export const SET_SCHEDULE_FORMDATA_1 = (state, payload) => {
//   state.schedule_formdata.documentFile.push(payload.documentFile);
//   state.schedule_formdata.title = payload.title;
//   state.schedule_formdata.documentTitle = payload.documentTitle;
// };
export const SET_SCHEDULE_TEMPLATE = (state, payload) => {
  state.schedule_formdata.title = payload.documentTitle;
  state.schedule_formdata.documentTitle = payload.documentTitle;
  state.schedule_formdata.documentId = payload.documentId;
};
export const SET_SCHEDULE_CUSTOM = (state, payload) => {
  state.schedule_formdata.title = payload.title;
  state.schedule_formdata.documentTitle = payload.title;
  state.schedule_formdata.description = payload.description;
};

export const SET_SCHEDULE_FORMDATA_1 = (state, payload) => {
  // console.log(payload);
  state.schedule_formdata.temDocData.push(payload.temDocData); // ? This is just for the UI
  state.schedule_formdata.documentFile.push(payload.documentFile);
  state.schedule_formdata.title = payload.title;
  state.schedule_formdata.documentTitle = payload.documentTitle;
};

export const DELETE_SCHEDULE_FORMDATA_1 = (state, index) => {
  state.schedule_formdata.temDocData.splice(index, 1);
  state.schedule_formdata.documentFile.splice(index, 1);
};

export const UNSET_SCHEDULE_FORMDATA_1 = (state) => {
  state.schedule_formdata.title = null;
  state.schedule_formdata.documentTitle = null;
  state.schedule_formdata.documentFile = [];
  state.schedule_formdata.temDocData = [];
};

// export const UNSET_SCHEDULE_FORMDATA_1 = (state) => {
//   state.schedule_formdata.documentTitle = null;
//   state.schedule_formdata.documentFile = [];
// };
//stage two (add and edit participants)
export const SET_SCHEDULE_FORMDATA_2 = (state, payload) => {
  const Exists = state.schedule_formdata.participants.filter((participant) => {
    return payload.email == participant.email;
  });
  if (Exists.length == 0) {
    state.schedule_formdata.participants.push(payload);
  }
};
export const UNSET_SCHEDULE_FORMDATA_2 = (state, id) => {
  state.schedule_formdata.participants =
    state.schedule_formdata.participants.filter((participant) => {
      return id != participant.id;
    });
};

//stage two (invite notary, select schedule type, time and date)
export const SET_SCHEDULE_FORMDATA_3 = (state, payload) => {
  state.schedule_formdata.schedule_type = payload.schedule_type;
  state.schedule_formdata.notary = payload.notary;
  state.schedule_formdata.date = payload.date;
  state.schedule_formdata.time = payload.time;
};

//stage two (delivery option and address)
export const SET_SCHEDULE_FORMDATA_4 = (state, payload) => {
  state.schedule_formdata.delivery_option = payload.delivery_option;
  state.schedule_formdata.address = payload.address;
};

// clear form data
export const CLEAR_SCHEDULE_FORMDATA = (state) => {
  state.schedule_formdata.schedule_type = null;
  state.schedule_formdata.notary = null;
  state.schedule_formdata.date = null;
  state.schedule_formdata.time = null;
  state.schedule_formdata.participants = [];
  state.schedule_formdata.title = null;
  state.schedule_formdata.documentTitle = null;
  state.schedule_formdata.documentId = null;
  state.schedule_formdata.documentFile = [];
  state.schedule_formdata.TemplateType = null;
  state.schedule_formdata.temDocData = [];

  state.schedule_formdata.delivery_option = null;
  state.schedule_formdata.address = null;
};
