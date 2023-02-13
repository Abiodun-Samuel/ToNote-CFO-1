import Api from "./Api";

export default {
  // get all the time slots
  TimeSlotsApi() {
    return Api.get(`time-slots`);
  },

  // get transaction gateways
  PaymentGatewaysApi() {
    return Api.get("payment-gateways");
  },

  // api for country
  CountriesApi() {
    return Api.get(`countries`);
  },

  StatesApi(country_id) {
    return Api.get(`countries/${country_id}`);
  },

  //request virtual notary session
  ScheduleVirtualSessionApi(data) {
    return Api.post(`request-virtual-session`, data);
  },

  //get virtual session details
  VirtualSessionDetailsApi(id) {
    return Api.get(`request-virtual-session/${id}`);
  },

  // payment for request virtual notary session
  ScheduleTransactionApi(data) {
    return Api.put(`transactions/${data.id}`, {
      payment_gateway: data.payment_gateway,
    });
  },

  // agora
  GenerateAgoraToken(data) {
    return Api.post("agora/token", data);
    // return axios.get(
    //   `https://agora-token-generator.onrender.com/rtc/${data.channel_name}/publisher/uid/${data.user_id}`,
    //   data
    // );
    // return Api.post("agora/token", data);
  },
};
