<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import {
  World,
  Model,
  ThirdPersonCamera,
  Dummy,
  Find,
  Setup,
  OrbitCamera,
  types,
  keyboard,
  Cube,
  LingoEditor,
  HTML,
  mouse,
} from "lingo3d-vue";
import YbotModel from "../components/YbotModel/YbotModel.vue";
import { nextTick, onMounted, ref } from "vue";
const router = useRouter();
const mouseover = (e) => {
  gandaList.value.forEach((element) => {
    element.outline = false;
  });
  gandaList.value[e].outline = true;
  console.log(gandaList.value[e], "模型");
  router.push({
    name: "game",
    query: {
      id: JSON.stringify(gandaList.value[e]),
    },
  });
};
const gandaList = ref([
  {
    type: 0,
    model: "../../public/Player/gandaX.fbx",
    position: [40],
    outline: false,
    edit: 1,
    ani: {
      idle: "../../public/Player/idle.fbx",
      walk: "../../public/gandaXwalk.fbx",
      run: "../../public/Player/StandardRun.fbx",
      fly: "../../public/Player/Flying.fbx",
    },
  },
  {
    type: 1,
    model: "../../public/BreathingIdle.fbx",
    position: [180],
    bloom: true,
    outline: false,
    ani: {
      idle: "../../public/BreathingIdle.fbx",
      walk: "../../public/walk.fbx",
    },
  },
]);
</script>

<template>
  <World color="#FFFFFF">
    <Model
      pbr
      box-visible
      :x="Item.position[0]"
      v-for="(Item, index) in gandaList"
      :key="index"
    >
      <Model
        @click="mouseover(index)"
        pbr
        :bloom="Item.bloom"
        :outline="Item.outline"
        :width="66.5"
        :height="100"
        :depth="34.01"
        :rotation-x="-180"
        :rotation-y="12.42"
        :rotation-z="-180"
        :rotation="-180"
        :src="gandaList[index].model"
      />
    </Model>
    <Setup default-light="studio" default-orbit-controls />
    <OrbitCamera
      :x="86"
      :y="-228.58"
      :z="-37"
      :azimuth-angle="90.48"
      :polar-angle="128.82"
      mouse-control
      active
    />
    <!-- <LingoEditor /> -->
  </World>
</template>
