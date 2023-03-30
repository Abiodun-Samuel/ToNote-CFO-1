import { createApp } from "vue";
import store from "@/store";
import App from "./App.vue";
import router from "@/router/router";
import "@/assets/css/nprogress.css";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import $ from "jquery";
import "aos/dist/aos.css";
import AOS from "aos";
import Flutterwave from "flutterwave-vue3";
import VueWriter from "vue-writer";

import Vue3DraggableResizable from "vue3-draggable-resizable";
import "vue3-draggable-resizable/dist/Vue3DraggableResizable.css";
import "aos/dist/aos.css";
import "vue2-animate/dist/vue2-animate.min.css";

AOS.init({
  duration: 500,
});
createApp(App)
  .use(router)
  .use(store)
  .use($)
  .use(VueToast)
  .use(Flutterwave)
  .use(VueWriter)
  .use(Vue3DraggableResizable)
  .mount("#app");
