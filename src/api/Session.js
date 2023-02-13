import Api from "./Api";

const END_POINT = "";

export default {

  notary_send_tools(id) {
    return Api.post(`${END_POINT}/${id}`);
  },
};
