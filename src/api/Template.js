import Api from "./Api";

const END_POINT = "document-templates";

export default {
  // get all templates
  all() {
    return Api.get(`${END_POINT}`);
  },

  postNotaryRequestForm(data) {
    return Api.post("request-affidavits-upload", data);
  },

  // show(tempId) {
  //   return Api.get(`${END_POINT}/${tempId}`);
  // },

  // store(data) {
  //   /** @param data The parameter for this call is the data object */
  //   return Api.post(END_POINT, data);
  // },

  // delete(tempId) {
  //   return Api.delete(`${END_POINT}/${tempId}`);
  // },

  // updateTool(data) {
  //   return Api.put(`${END_POINT}/${data.id}`, data);
  // },
};
