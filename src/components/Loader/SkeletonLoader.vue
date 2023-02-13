<template>
  <div class="skeleton pulse wave">
    <div class="square" :style="`height:${height};width:${width}`"></div>
    <div
      v-if="small"
      class="square"
      :style="`height:20px;width:100%;margin-top:4px;`"
    ></div>
  </div>
</template>

<script>
export default {
  name: "SkeletonLoader",
  props: {
    small: {
      type: Boolean,
    },
    height: {
      type: String,
    },
    width: {
      type: String,
    },
  },
};
</script>

<style lang="css">
.skeleton {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* flex-wrap: wrap; */
  /* gap: 15px; */
}
.skeleton.pulse div {
  animation: pulse 1s infinite ease-in-out;
  -webkit-animation: pulse 1s infinite ease-in-out;
}
.skeleton.wave div {
  animation: wave 1s infinite linear forwards;
  -webkit-animation: wave 1s infinite linear forwards;
  background: #f6f7f8;
  background: linear-gradient(to right, #eee 8%, #ddd 38%, #eee 53%);
  background-size: 800px 104px;
}
.skeleton div {
  background: #e8e8e8;
}
.skeleton .square {
  border-radius: 4px;
}

@keyframes pulse {
  0% {
    background-color: rgba(165, 165, 165, 0.1);
  }
  50% {
    background-color: rgba(165, 165, 165, 0.3);
  }
  100% {
    background-color: rgba(165, 165, 165, 0.1);
  }
}
@-webkit-keyframes pulse {
  0% {
    background-color: rgba(165, 165, 165, 0.1);
  }
  50% {
    background-color: rgba(165, 165, 165, 0.3);
  }
  100% {
    background-color: rgba(165, 165, 165, 0.1);
  }
}
@keyframes wave {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}
/* @-webkit-keyframes wave {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
} */
</style>
