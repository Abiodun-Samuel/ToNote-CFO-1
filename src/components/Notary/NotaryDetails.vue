<template>
  <div class="d-flex justify-content-center" v-if="loading">
    <PreLoader />
  </div>
  <div v-else class="text-center my-1">
    <div class="d-flex justify-content-center flex-column align-items-center">
      <img
        v-if="notary_details?.image"
        :src="notary_details?.image"
        alt="notary image"
        height="100"
        width="100"
      />
      <Icon
        v-else
        icon="carbon:user-avatar-filled-alt"
        height="100"
        width="100"
      />

      <div>
        <Icon
          icon="icon-park-outline:dot"
          height="20"
          width="20"
          :color="notary_details.is_online ? 'green' : 'red'"
        />
        <span> {{ notary_details.is_online ? "Online" : "Offline" }}</span>
      </div>
    </div>
    <hr />
    <div class="my-1">
      <h4 class="fw-folder">
        {{ `${notary_details.first_name} ${notary_details.last_name}` }}
      </h4>
      <div
        class="d-flex justify-content-center bg-light-secondary rounded mt-1"
      >
        <div class="p-1">
          <p class="h4 fw-bolder" style="color: #ff9f43">{{ avr_rating }}/5</p>
          <StarRating
            v-model:rating="avr_rating"
            :read-only="true"
            :round-start-rating="false"
            :increment="0.01"
            :star-size="20"
            :show-rating="false"
          />
          <p style="margin-top: 6px">{{ feedbacks.length }} rating(s)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { useGetters } from "vuex-composition-helpers/dist";
import PreLoader from "@/components/Loader/PreLoader.vue";
// import { onMounted } from "@vue/runtime-core";
import StarRating from "vue-star-rating";

// import { computed } from "vue";
// import { useStore } from "vuex";

// const store = useStore();

const { notary_details, loading, feedbacks, avr_rating } = useGetters({
  notary_details: "notary/notary_details",
  loading: "notary/notary_details_loading",
  feedbacks: "notary/feedbacks",
  avr_rating: "notary/avr_rating",
});

</script>

<style>
</style>