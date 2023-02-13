<template>
  <div class="tool bg-white" style="height: 100vh">
    <li
      class="btn"
      :class="{ blue: tool.userEmail && tool.active }"
      @click="
        isSignerSelected({
          active: tool.active,
          toolId: 'textTool',
          tool_name: 'Textarea',
        })
      "
    >
      Text Area
      <TextIcon />
    </li>

    <li
      class="btn"
      :class="{ blue: tool.userEmail && tool.active }"
      @click="
        isSignerSelected({
          active: tool.active,
          toolId: 'signTool',
          tool_name: 'Signature',
        })
      "
    >
      Signature
      <Icon icon="mdi:file-sign" style="font-size: 1.5rem" />
    </li>

    <li
      class="btn"
      :class="{ blue: tool.userEmail && tool.active }"
      @click="
        isSignerSelected({
          active: tool.active,
          toolId: 'initialTool',
          tool_name: 'Initial',
        })
      "
    >
      Initial
      <InitialIcon />
    </li>

    <li
      class="btn d-none"
      :class="{ blue: tool.userEmail && tool.active }"
      @click="
        isSignerSelected({
          active: tool.active,
          toolId: 'dateTool',
          tool_name: 'Date',
        })
      "
    >
      Date Signed
      <DateIcon />
    </li>

    <template v-if="plan !== 'Business'">
      <li
        class="btn"
        :class="{ blue: tool.userEmail && tool.active }"
        @click="
          isSignerSelected({
            active: tool.active,
            toolId: 'sealTool',
            tool_name: 'Seal',
          })
        "
      >
        Seal
        <SealIcon />
      </li>

      <li
        class="btn"
        :class="{ blue: tool.userEmail && tool.active }"
        @click="
          isSignerSelected({
            active: tool.active,
            toolId: 'stampTool',
            tool_name: 'Stamp',
          })
        "
      >
        Stamp
        <StampIcon />
      </li>
    </template>

    <li
      class="btn"
      :class="{ blue: tool.userEmail && tool.active }"
      @click="
        isSignerSelected({
          active: tool.active,
          toolId: 'photoTool',
          tool_name: 'Photo',
        })
      "
    >
      Image
      <ImageIcon />
    </li>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import TextIcon from "@/icons/TextIcon.vue";
import InitialIcon from "@/icons/InitialIcon.vue";
import DateIcon from "@/icons/DateIcon.vue";
import SealIcon from "@/icons/SealIcon.vue";
import StampIcon from "@/icons/StampIcon.vue";
import ImageIcon from "@/icons/ImageIcon.vue";

import { ref, defineProps, defineEmits, watch } from "vue";
import { useGetters } from "vuex-composition-helpers/dist";
import { useToast } from "vue-toast-notification";
const toast = useToast();

const { teams, notary_session_details } = useGetters({
  teams: "team/teams",
  notary_session_details: "schedule/virtual_session_details",
});

const plan = ref("");

teams.value.map((team) => {
  if (team.active === true) return (plan.value = team.subscription.plan.name);
});

const props = defineProps({ tool: Object });
const emit = defineEmits(["bindTools"]);

const tool = ref({});
watch(
  () => props.tool,
  (toolObj) => {
    if (toolObj) {
      tool.value = toolObj;
    }
  }
);

const isSignerSelected = (params) => {
  if (notary_session_details.value?.compliance_required)
    return toast.error("Please complete the compliance questionnaire!", {
      timeout: 5000,
      position: "top-right",
    });
  if (!params.active)
    return toast.error("Kindly select a signer!", {
      timeout: 5000,
      position: "top-right",
    });

  emit("bindTool", params);
};
</script>

<style scoped>
.tool {
  padding: 0.58rem 1.5rem !important;
}
</style>
