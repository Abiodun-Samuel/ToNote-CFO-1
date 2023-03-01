  <template>
  <div class="mt-1 mb-2 px-2">
    <h3 class="fw-bold text-dark">The session is completed &#127881;</h3>
  </div>

  <div class="my-1 px-2">
    <p class="text-black my-0 py-0" style="margin-bottom: 4px">
      Rate your commissioner for oaths
    </p>
    <StarRating
      v-model:rating="rating"
      :round-start-rating="false"
      :increment="0.5"
      :star-size="40"
    />
    <div
      style="width: 210px; margin-top: 2px"
      class="d-flex justify-content-between"
    >
      <div class="form-label">Bad</div>
      <div class="form-label">Excellent</div>
    </div>
  </div>

  <div class="my-2 px-2">
    <p class="text-black my-0 py-0">Leave a comment</p>
    <textarea class="form-control" v-model="comment" rows="3"></textarea>
  </div>

  <div class="mt-2 d-flex justify-content-end px-2">
    <button
      @click="submit"
      :disabled="!rating || feedback_loading"
      class="btn btn-primary"
    >
      <span
        v-if="feedback_loading"
        class="spinner-border spinner-border-sm me-1"
        role="status"
        aria-hidden="true"
      ></span>
      Send
    </button>
  </div>

  <!-- <template v-if="feedback__sent">
    <div class="text-center my-2">
      <div class="my-1">
        <img src="../../assets/images/logo2.png" alt="logo" width="120" />
        <h3 class="text-primary fw-bolder my-1">
          Thank you for letting us know
        </h3>
      </div>
      <div class="my-1">
        <p>
          Your feedback will help us improve the quality of the service of the
          Commissioner for Oaths
        </p>
      </div>
      <div class="mt-2">
        <button @click="proceed" class="btn btn-primary">Continue</button>
      </div>
    </div>
  </template> -->
</template>


<script setup>
import { ref, onMounted } from "vue";
import StarRating from "vue-star-rating";
import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const rating = ref(null);
const comment = ref(null);

// eslint-disable-next-line no-unused-vars
const { getUserDocument, notaryFeedbackAction } = useActions({
  getUserDocument: "document/getUserDocument",
  notaryFeedbackAction: "notary/notaryFeedbackAction",
});

const { feedback_loading, virtual_session_details, userDocument, token } =
  useGetters({
    feedback_loading: "notary/feedback_loading",
    virtual_session_details: "schedule/virtual_session_details",
    userDocument: "document/userDocument",
    token: "auth/token",
  });

const submit = () => {
  notaryFeedbackAction({
    review_id: virtual_session_details.value.id,
    entity_id: virtual_session_details.value.notary_id,
    review_type: "ScheduleSession",
    comment: comment.value,
    rating: rating.value,
  }).then(() => {
    rating.value = null;
    comment.value = null;
    toast.success(
      `Your feedback will help us improve the quality of the service of the
          Commissioner for Oaths`,
      {
        position: "top-right",
        duration: 4000,
      }
    );
    if (!userDocument.value.is_the_owner_of_document)
      return (window.location.href =
        process.env.VUE_APP_URL_AUTH_LIVE + "/redirecting?qt=" + token.value);

    if (userDocument.value.extra_seals >= 1) {
      window.location.href = "/session-payment";
    } else {
      window.location.href = "/session-complete";
    }
  });
};

// const proceed = () => {
//   if (!userDocument.value.is_the_owner_of_document)
//     return (window.location.href = process.env.VUE_APP_URL_AUTH_LIVE);

//   if (userDocument.value.extra_seals >= 1) {
//     window.location.href = "/session-payment";
//   } else {
//     window.location.href = "/session-complete";
//   }
// };
onMounted(() => {
  getUserDocument(virtual_session_details.value.schedule_id);
});
</script>

<style lang="css" scoped>
</style>