<template>
  <div class="landing mx-auto">
    <!-- <ul>
      <li>
        Copy a link having a document ID inclusive e.g.
        <ul>
          <li>
            <a
              href="https://tonote-doc-link.netlify.app/document/edit/f80e326b-5d4b-427e-ab39-280126aa1acd"
              target="_blank"
            >
              https://tonote-doc-link.netlify.app/document/edit/f80e326b-5d4b-427e-ab39-280126aa1acd</a
            >
          </li>
        </ul>
      </li>
    </ul> -->

    <div class="mt-5 text-center">
      <!-- <h3>Schedule a virtual notary Or Get an Affidavit</h3> -->
    </div>

    <p class="text-center">
      <router-link
        :to="{ name: 'notary.schedule', query: { session: 'notary' } }"
        class="btn btn-sm btn-primary"
      >
        Request a Commissioner for Oaths Session
      </router-link>
    </p>

    <p class="text-center">
      <router-link
        :to="{ name: 'notary.schedule', query: { session: 'affidavit' } }"
        class="btn btn-sm btn-primary"
      >
        Get an affidavit
      </router-link>
    </p>

    <!-- <agora-react-web-uikit
      style="width: 100%; height: 100vh; display: flex"
      appId="3ab5151eabbd4b0e8b3faff7bbc7905f"
      channel="demo"
      token="007eJxTYNCv6zz8oHjP7POL58+82rTk67utU+a9Xsxx6eO1b1VHBGfzKDAYJyaZGpoapiYmJaWYJBmkWiQZpyWmpZknJSWbWxqYpnVaHk9uCGRkeD/jMAMjFIL4LAwpqbn5DAwADa8lyQ=="
      uid=""
    /> -->
    <!-- appId: agora.appid, // channel: agora.channelName, // your agora channel //
  token: agora.token, // uid: agora.uid, // use -->
  </div>
</template>

<script setup>
// const rtcProps = {
//   appId: "3ab5151eabbd4b0e8b3faff7bbc7905f",
//   channel: "demo", // your agora channel
//   token:
//     "007eJxTYNCv6zz8oHjP7POL58+82rTk67utU+a9Xsxx6eO1b1VHBGfzKDAYJyaZGpoapiYmJaWYJBmkWiQZpyWmpZknJSWbWxqYpnVaHk9uCGRkeD/jMAMjFIL4LAwpqbn5DAwADa8lyQ==",
//   uid: "", // use null or skip if using app in testing mode
// };
// import { useStore } from "vuex";

// const store = useStore();
// const not = computed(() => store.getters["auth/is_notary"]);
// console.log(not.value);
</script>

<style scoped>
.landing {
  width: 50%;
  margin: 6rem 0;
}

@media screen and (max-width: 991.5px) {
  .landing {
    width: 100%;
    margin: 0;
  }
}
</style>