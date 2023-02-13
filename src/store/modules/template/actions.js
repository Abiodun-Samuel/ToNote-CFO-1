import Template from "@/api/Template";

export const getAllTemplates = ({ commit }) => {
  // if (state.templates.length == 0) {
  commit("SET_LOADER", true);
  Template.all()
    .then((response) => {
      commit("SET_TEMPLATES", response.data.data);
      commit("SET_LOADER", false);
    })
    .catch((error) => {
      if (error) {
        commit("SET_LOADER", false);
      }
    });
  // }
};

export const saveTemplate = ({ commit }, formData) => {
  Template.store(formData)
    .then((response) => {
      commit("SET_TEMPLATES", response.data.data);
      // Vue.$toast.success("Saved successfully");
    })
    .catch((error) => {
      console.log(error);
      // Vue.$toast.error(`${error.response.data.message}`);
    });
};
