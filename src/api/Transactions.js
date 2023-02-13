import Api from "./Api";

const END_POINT = "transactions";

export default {
  postTransactions(data) {
    return Api.post(`${END_POINT}`, data);
  },
};
