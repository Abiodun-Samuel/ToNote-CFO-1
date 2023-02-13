import Transactions from "@/api/Transactions";
// import { useToast } from "vue-toast-notification";
// const toast = useToast();

export const postTransactionAction = ({ commit }, data) => {
  commit("SET_TRANSACTION_LOADER", true);
  Transactions.postTransactions(data)
    .then((response) => {
      commit("SET_NOTARY_LIST", response.data.data);
      commit("SET_TRANSACTION_RESULT", false);
    })
    .catch((error) => {
      if (error) {
        commit("SET_TRANSACTION_RESULT", []);
        commit("SET_TRANSACTION_LOADER", false);
      }
    });
};
