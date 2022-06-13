<script setup>
import { Model, World, HTML } from "lingo3d-vue";
import { ref, toRef, watch } from "vue";
const yBot = ref([
  "../../../public/BreathingIdle.fbx",
  "../../../public/BreathingIdle.fbx",
]);
const gandaList = ref([
  {
    type: 0,
    model: "../../../public/gandaXIdleX.fbx",
    position: [40],
    outline: false,
    edit: 1,
    ani: {
      idle: "../../../public/gandaXIdleX.fbx",
      walk: "../../../public/gandaXwalk.fbx",
    },
  },
  {
    type: 1,
    model: "../../../public/BreathingIdle.fbx",
    position: [180],
    bloom: true,
    outline: false,
    ani: {
      idle: "../../../public/BreathingIdle.fbx",
      walk: "../../../public/walk.fbx",
    },
  },
]);
const props = defineProps({
  dummyProxy: Object,
  message: Number,
});
console.log(props.dummyProxy, "props.dummyProxy");
</script>
<template>
  <Model
    :proxy="props.dummyProxy"
    :bloom="gandaList[props.dummyProxy.Types]?.bloom ?? false"
    :metalness-factor="gandaList[props.dummyProxy.Types]?.edit ?? 1.3"
    :roughness-factor="gandaList[props.dummyProxy.Types]?.edit ?? -6.7"
    :opacity-factor="gandaList[props.dummyProxy.Types]?.edit ?? 2.3"
    pbr
    :animations="gandaList[props.dummyProxy.Types].ani"
    :animation="props.dummyProxy.animation"
    :width="85.62"
    :depth="76.93"
    :scale-x="1"
    :scale-y="1"
    :scale-z="1"
    :src="gandaList[props.dummyProxy.Types].model"
    physics="character"
  >
    <HTML>
      <div style="width: 1000px">
        {{ props.dummyProxy }}
      </div>
    </HTML>
  </Model>
</template>
