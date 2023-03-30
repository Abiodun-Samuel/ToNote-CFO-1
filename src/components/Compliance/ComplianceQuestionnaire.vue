<template>
  <div class="row">
    <div class="col-lg-6 col-md-6 my-1">
      <h4 class="mb-1 text-primary fw-bolder">Participants</h4>

      <div class="accordion accordion-flush" id="accordionFlushExample">
        <div
          v-for="(participant, index) in participants"
          :key="participant.id"
          class="accordion-item"
        >
          <h2
            class="accordion-header bg-brown text-black"
            :id="`flush-heading${index}`"
          >
            <div
              class="accordion-button collapsed d-flex gap-1 fw-bolder bg-brown text-black"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#flush-collapse${index}`"
              aria-expanded="false"
              :aria-controls="`flush-collapse${index}`"
            >
              <Icon icon="mdi:user-circle-outline" />
              {{
                participant.user.first_name + " " + participant.user.last_name
              }}
              ({{ participant.role }})
            </div>
          </h2>
          <div
            :id="`flush-collapse${index}`"
            class="accordion-collapse collapse"
            :aria-labelledby="`flush-heading${index}`"
            data-bs-parent="#accordionFlushExample"
          >
            <div class="accordion-body">
              <div class="d-flex justify-content-between">
                <div>
                  <img
                    width="100"
                    height="100"
                    src="../../assets/images/avatar.png"
                    alt="lagos state judiciary"
                  />
                </div>
                <div>
                  <h5 class="fw-bolder">
                    {{
                      participant.user.first_name +
                      " " +
                      participant.user.last_name
                    }}
                  </h5>
                  <p style="margin: 5px 0; padding: 0px">
                    {{ participant.user.email }}
                  </p>
                  <p style="margin: 5px 0; padding: 0px">ID Type: BVN</p>
                  <p style="margin: 5px 0; padding: 0px">
                    ID Number: 12345678909
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-6 col-md-6 my-1">
      <div v-if="compl_ques_loader" class="d-flex justify-content-center">
        <PreLoader />
      </div>
      <div v-else>
        <div v-if="!success">
          <h4 class="mb-1 text-primary fw-bolder">Compliance Questionnaire</h4>
          <div v-if="first_step">
            <form @submit.prevent="next">
              <div
                data-aos="fade-up"
                data-aos-delay="50"
                class="my-1 shadow p-1 rounded compliance"
              >
                <div class="d-flex">
                  <div>
                    <p class="compliance__number fw-bold text-primary">1.</p>
                  </div>
                  <div class="ms-1">
                    <p class="text-black fw-bold">
                      {{ compl_ques[0]?.question }}
                    </p>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="question-one"
                        value="Yes"
                        v-model="answer_1"
                        required
                      />
                      <label class="form-check-label" for="question-one">
                        Yes
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="100"
                class="my-1 shadow p-1 rounded compliance"
              >
                <div class="d-flex">
                  <div>
                    <p class="compliance__number fw-bold text-primary">2.</p>
                  </div>
                  <div class="ms-1">
                    <p class="text-black fw-bold">
                      {{ compl_ques[1]?.question }}
                    </p>
                    <div class="d-flex">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="question-two"
                          id="question-two"
                          value="Yes"
                          v-model="answer_2"
                          required
                        />
                        <label class="form-check-label" for="question-two"
                          >Yes</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="question-two"
                          id="question-two-2"
                          value="No"
                          v-model="answer_2"
                          required
                        />
                        <label class="form-check-label" for="question-two-2"
                          >No</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="150"
                class="my-1 shadow p-1 rounded compliance"
              >
                <div class="d-flex">
                  <div>
                    <p class="compliance__number fw-bold text-primary">3.</p>
                  </div>
                  <div class="ms-1">
                    <p class="text-black fw-bold">
                      {{ compl_ques[2]?.question }}
                    </p>

                    <div class="d-flex">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="question-three"
                          id="question-three"
                          value="Yes"
                          v-model="answer_3"
                          required
                        />
                        <label class="form-check-label" for="question-three"
                          >Yes</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="question-three"
                          id="question-three-2"
                          value="No"
                          v-model="answer_3"
                          required
                        />
                        <label class="form-check-label" for="question-three-2"
                          >No</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-end align-items-center mt-2">
                <button
                  v-if="second_step"
                  class="mx-1 previous__btn"
                  @click="back"
                >
                  <Icon icon="eva:arrow-back-outline" />
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ first_step ? "Next" : "Submit" }}
                </button>
              </div>
            </form>
          </div>
          <div v-if="second_step">
            <form @submit.prevent="submit">
              <div
                data-aos="fade-up"
                data-aos-delay="50"
                class="my-1 shadow p-1 rounded compliance"
              >
                <div class="d-flex">
                  <div>
                    <p class="compliance__number fw-bold text-primary">4.</p>
                  </div>
                  <div class="ms-1">
                    <p class="text-black fw-bold">
                      {{ compl_ques[3]?.question }}
                    </p>
                    <div class="d-flex">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="question-four"
                          id="question-four"
                          value="Yes"
                          v-model="answer_4"
                          required
                        />
                        <label class="form-check-label" for="question-four"
                          >Yes</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="question-four"
                          id="question-four-2"
                          value="No"
                          v-model="answer_4"
                          required
                        />
                        <label class="form-check-label" for="question-four-2"
                          >No</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="100"
                class="my-1 shadow p-1 rounded compliance"
              >
                <div class="d-flex">
                  <div>
                    <p class="compliance__number fw-bold text-primary">5.</p>
                  </div>
                  <div class="ms-1">
                    <p class="text-black fw-bold">
                      {{ compl_ques[4]?.question }}
                    </p>
                    <div class="d-flex">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="question-five"
                          id="question-five"
                          value="Yes"
                          v-model="answer_5"
                          required
                        />
                        <label class="form-check-label" for="question-five"
                          >Yes</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="question-five"
                          id="question-five-2"
                          value="No"
                          v-model="answer_5"
                          required
                        />
                        <label class="form-check-label" for="question-five-2"
                          >No</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="150"
                class="my-1 shadow p-1 rounded compliance"
              >
                <div class="d-flex">
                  <div>
                    <p class="compliance__number fw-bold text-primary">6.</p>
                  </div>
                  <div class="ms-1">
                    <p class="text-black fw-bold">
                      {{ compl_ques[5]?.question }}
                    </p>
                    <div class="d-flex">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="question-six"
                          id="question-six"
                          value="Yes"
                          v-model="answer_6"
                          required
                        />
                        <label class="form-check-label" for="question-six"
                          >Yes</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="question-six"
                          id="question-six-2"
                          value="No"
                          v-model="answer_6"
                          required
                        />
                        <label class="form-check-label" for="question-six-2"
                          >No</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-end align-items-center mt-2">
                <button
                  v-if="second_step"
                  class="mx-1 previous__btn"
                  @click="back"
                >
                  <Icon icon="eva:arrow-back-outline" />
                </button>
                <!--  -->
                <!--  -->
                <button
                  :disabled="
                    compl_resp_loader ||
                    !answer_1 ||
                    answer_2 != 'Yes' ||
                    answer_3 != 'Yes' ||
                    answer_4 != 'Yes' ||
                    answer_5 != 'Yes' ||
                    answer_6 != 'Yes'
                  "
                  type="submit"
                  class="btn btn-primary"
                >
                  <span
                    v-if="compl_resp_loader"
                    class="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {{ first_step ? "Next" : "Submit" }}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div v-if="success" class="text-center">
          <SuccessComponent />
          <button
            class="btn my-1 btn-primary"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="$emit('close')"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PreLoader from "@/components/Loader/PreLoader.vue";
import SuccessComponent from "@/components/Payment/SuccessComponent.vue";
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import { Icon } from "@iconify/vue";
import { useGetters } from "vuex-composition-helpers/dist";

const store = useStore();

const answer_1 = ref("");
const answer_2 = ref("");
const answer_3 = ref("");
const answer_4 = ref("");
const answer_5 = ref("");
const answer_6 = ref("");
const first_step = ref(true);
const second_step = ref(false);
const success = ref(false);

const {
  compl_resp_loader,
  compl_ques_loader,
  compl_ques,
  virtual_session_details,
  userDocument,
} = useGetters({
  compl_resp_loader: "notary/compliance_response_loading",
  compl_ques_loader: "notary/compliance_questionnaire_loading",
  compl_ques: "notary/compliance_questionnaire",
  virtual_session_details: "schedule/virtual_session_details",
  userDocument: "document/userDocument",
});

const participants = computed(() => {
  return userDocument.value.participants.filter((p) => {
    return p.role != "Notary";
  });
});

onMounted(() => {
  store.dispatch(
    "notary/ComplianceQuesAction",
    virtual_session_details?.value.id
  );
});

const next = () => {
  first_step.value = false;
  second_step.value = true;
};
const back = () => {
  first_step.value = true;
  second_step.value = false;
};
const submit = () => {
  answer_1.value && (answer_1.value = "Yes");
  if (
    answer_1.value == "Yes" &&
    answer_2.value == "Yes" &&
    answer_3.value == "Yes" &&
    answer_4.value == "Yes" &&
    answer_5.value == "Yes" &&
    answer_6.value == "Yes"
  ) {
    const answers = {
      answers: [
        {
          answer: answer_1.value,
          notary_id: virtual_session_details.value?.notary.id,
          document_id: virtual_session_details.value?.schedule_id,
          schedule_id: virtual_session_details?.value.id,
          compliance_question_id: compl_ques.value[0]?.id,
        },
        {
          answer: answer_2.value,
          notary_id: virtual_session_details.value?.notary.id,
          document_id: virtual_session_details.value?.schedule_id,
          schedule_id: virtual_session_details?.value.id,
          compliance_question_id: compl_ques.value[1]?.id,
        },
        {
          answer: answer_3.value,
          notary_id: virtual_session_details.value?.notary.id,
          document_id: virtual_session_details.value?.schedule_id,
          schedule_id: virtual_session_details?.value.id,
          compliance_question_id: compl_ques.value[2]?.id,
        },
        {
          answer: answer_4.value,
          notary_id: virtual_session_details.value?.notary.id,
          document_id: virtual_session_details.value?.schedule_id,
          schedule_id: virtual_session_details?.value.id,
          compliance_question_id: compl_ques.value[3]?.id,
        },
        {
          answer: answer_5.value,
          notary_id: virtual_session_details.value?.notary.id,
          document_id: virtual_session_details.value?.schedule_id,
          schedule_id: virtual_session_details?.value.id,
          compliance_question_id: compl_ques.value[4]?.id,
        },
        {
          answer: answer_6.value,
          notary_id: virtual_session_details.value?.notary.id,
          document_id: virtual_session_details.value?.schedule_id,
          schedule_id: virtual_session_details?.value.id,
          compliance_question_id: compl_ques.value[5]?.id,
        },
      ],
    };
    store.dispatch("notary/ComplianceRespAction", answers).then((value) => {
      if (value) {
        success.value = true;
      }
    });
  }
};
</script>

<style lang="css">
.bg-brown {
  background: #d9c088 !important;
}
/* .accordion-button:hover {
  background: ;
} */
.compliance__number {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1.5px solid #766458;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  padding: 5px;
}
.previous__btn {
  border-radius: 50%;
  border: 1.5px solid grey;
  height: 36px;
  width: 36px;
  color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>