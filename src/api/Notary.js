import Api from "./Api";

export default {
  GetNotaryDetailsApi(id) {
    return Api.get(`notary/notary-list/${id}`);
  },

  GetNotariesApi() {
    return Api.get(`notary/notary-list?per_page=5`);
  },

  FilterNotariesApi(data) {
    return Api.get(
      `notary/notary-list?date=${data.date}&time=${data.time}&country_id=${data.country_id}&state_id=${data.state_id}&per_page=10`
    );
  },

  ComplianceQuesApi(id) {
    return Api.get(`schedule-compliance-questions/${id}`);
  },

  ComplianceRespApi(answers) {
    return Api.put(
      `schedule-compliance-responses/${answers.answers[0].schedule_id}`,
      answers
    );
  },

  //update notary session
  UpdateNotarySessionApi(payload) {
    return Api.put(`request-virtual-session/${payload.id}`, payload);
  },

  //update notary session
  notaryFeedbackApi(payload) {
    return Api.post(`feedback`, payload);
  },
};
