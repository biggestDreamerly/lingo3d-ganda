<script setup lang="ts">
import {
  World,
  Model,
  ThirdPersonCamera,
  Dummy,
  Find,
  Setup,
  types,
  keyboard,
  Cylinder,
  Cube,
  LingoEditor,
  HTML,
  mouse,
} from "lingo3d-vue";
import YbotModel from "../components/YbotModel/YbotModel.vue";
import { nextTick, onMounted, ref, watch, watchEffect, shallowRef, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import useColyseus from "../hooks/useColyseus";
const route = useRoute();
const attackNum = ref(0);
const attackTime = ref(0);
const accackHit = ref(false);
const ModelQuery = ref(null);
const obj = route.query.id;
ModelQuery.value = JSON.parse(obj);
console.log("1", ModelQuery.value);
const dummyRef = ref<types.Dummy>();
const zidanRef = ref<any>();
const cubeList = ref([]);
const animationType = ref("idle");
const { dummyProxies } = toRefs(
  useColyseus(dummyRef, {
    Types: ModelQuery.value.type,
  })
);
console.error(dummyProxies, "dummyProxies");
watch(dummyProxies.value, (newProps, oldProps) => {
  console.error(newProps, "dummey");
});
console.log(dummyProxies, "dummyProxies");
keyboard.onKeyPress = (_, pressed) => {
  const dummy = dummyRef.value;
  if (!dummy) return;
  console.log(pressed);
  if (pressed.has("Space")) {
    animationType.value = "fly";
    console.log(ModelQuery.ani);
    dummy.velocity.y = 4;
  }
  if (pressed.has("w") && pressed.has("Shift")) {
    dummy.moveForward(-4);
    if (animationType.value == "fly") {
      return;
    }
    animationType.value = "run";
    console.log(ModelQuery.ani);

    return;
  }

  if (pressed.has("w")) {
    dummy.moveForward(-2);
    if (animationType.value == "fly") {
      return;
    }
    animationType.value = "walk";
  }
  if (pressed.has("s")) {
    animationType.value = "walk";
    dummy.moveForward(2);
    dummy.rotationY = 60;
    console.log();
  }

  if (pressed.has("a")) {
    animationType.value = "walk";
    dummy.moveRight(2);
  }
  if (pressed.has("d")) {
    animationType.value = "walk";
    dummy.moveRight(-2);
  }
};

onMounted(() => {
  console.log(dummyRef.value, "dummyRef");
});
mouse.onMouseDown = (e) => {
  // console.log(zidanRef.value, "onMouse");
  if (attackNum.value == 4) {
    attackNum.value = 0;
  }
  attackNum.value += 1;
  attackTime.value = new Date().getTime();
  // console.log(attackNum.value);
};
mouse.onMouseUp = (e) => {
  // console.log(zidanRef.value, "onMouse");
  if (attackTime.value - -new Date().getTime() > 60) {
    console.log("不连击");
    attackNum.value = 0;
    accackHit.value = false;
  } else {
    accackHit.value = true;
    console.log("连击"); //
  }

  console.log((attackTime.value + -new Date().getTime()) / 60, "当前差的秒数");
};
keyboard.onKeyDown = (key) => {
  const dummy = dummyRef.value;
  if (!dummy) return;
};

keyboard.onKeyUp = (_, pressed) => {
  const dummy = dummyRef.value;

  console.log(animationType.value);
  if (!dummy) return;
  if (!pressed.has("Space")) {
    dummy.moveForward(0);
    animationType.value = "idle";
  }
  if (animationType.value == "fly") {
    return;
  }
  if (!pressed.has("w") && !pressed.has("s")) {
    dummy.moveForward(0);
    animationType.value = "idle";
  }

  if (!pressed.has("a") && !pressed.has("d")) {
    dummy.moveForward(0);
    animationType.value = "idle";
  }
};
</script>

<template>
  <div>
    <h1 v-for="(dummyProxy, sessionId) in dummyProxies" :key="sessionId">
      {{ dummyProxy }}{{ sessionId }}
    </h1>
    <World color="#FFFFFF" v-if="ModelQuery">
      <Model
        :metalness-factor="1"
        :roughness-factor="0.35"
        pb
        :x="9.05"
        color="#ffffff"
        :y="34.18"
        :z="28.5"
        :width="121.25"
        :depth="84.17"
        :scale-x="150"
        :scale-y="150"
        :scale-z="150"
        src="../../public/map.glb"
        physics="map"
      />
      <ybot-model
        v-for="(dummyProxy, sessionId) in dummyProxies"
        :key="sessionId"
        :dummyProxy="dummyProxy"
      >
      </ybot-model>
      <!-- <Cube v-for="(dummyProxy, sessionId) in dummyProxies" :key="sessionId"> </Cube> -->

      <!-- <Model
      v-for="(dummyProxy, sessionId) in dummyProxies"
      :key="sessionId"
      :proxy="dummyProxy"
      bloom
      :metalness-factor="1.3"
      :roughness-factor="-6.7"
      :opacity-factor="2.3"
      pbr
      :animations="{
        idle: '../public/BreathingIdle.fbx',
        walk: '../public/walk.fbx',
      }"
      :animation="dummyProxy.animation"
      :width="85.62"
      :depth="76.93"
      :scale-x="1"
      :scale-y="1"
      :scale-z="1"
      src="../public/BreathingIdle.fbx"
      physics="character"
    >
      <HTMl> </HTMl>
    </Model> -->
      <ThirdPersonCamera
        :x="1179.8"
        :y="-575.03"
        :z="1820.55"
        :rotation-x="-180"
        :rotation-z="-180"
        :rotation="-180"
        :inner-z="150"
        :target-z="100"
        mouse-control-mode="orbit"
        mouse-control
        active
        :inner-x="20"
      >
        <Model
          :bloom="ModelQuery?.bloom ?? false"
          :metalness-factor="ModelQuery?.edit ?? 1.3"
          :roughness-factor="ModelQuery?.edit ?? -6.7"
          :opacity-factor="ModelQuery?.edit ?? 2.3"
          pbr
          :animations="ModelQuery.ani"
          :animation="animationType"
          :x="128.91"
          :y="-826"
          ref="dummyRef"
          :width="85.62"
          :depth="76.93"
          :scale-x="3"
          :scale-y="3"
          :scale-z="3"
          :src="ModelQuery.model"
          physics="character"
        >
          <Find
            name="mixamorigRightHand"
            color="#261414"
            emissive-color="#952121"
            :normal-scale="{ x: 100, y: 100 }"
          >
            <!-- <Cylinder
              :x="335862.29"
              :y="114720.61"
              :z="86881.79"
              :width="140"
              :height="2110"
              :depth="-80"
              :scale-x="101"
              :scale-y="3"
              :scale-z="23001"
              :rotation-x="-144.11"
              :rotation-y="35.9"
              :rotation-z="-29.27"
              :rotation="-29.27"
              color="#683dd2"
              :normal-scale="{ x: 1, y: 1 }"
            /> -->
          </Find>
        </Model>

        <!-- <Dummy
        :animations="{
          idle: 'https://unpkg.com/lingo3d-dummy@1.0.1/assets/rifle-idle.fbx',
          running: 'https://unpkg.com/lingo3d-dummy@1.0.1/assets/rifle-running.fbx',
          runningBackwards:
            'https://unpkg.com/lingo3d-dummy@1.0.1/assets/rifle-running-backwards.fbx',
          jumping: 'https://unpkg.com/lingo3d-dummy@1.0.1/assets/rifle-falling.fbx',
        }"
        animation="idle"
        pbr
        :x="1179.8"
        :y="-575.03"
        :z="1820.55"
        :width="20"
        :depth="20"
        src="https://unpkg.com/lingo3d-dummy@1.0.1/assets/ybot.fbx"
        preset="rifle"
        ref="dummyRef"
        stride-move
        physics="character"
      >
        <Find name="mixamorigRightHand" :normal-scale="{ x: 1, y: 1 }">
          <Model
            :x="-2755.01"
            :y="-341.89"
            :z="-161.27"
            :width="26.63"
            :depth="277.87"
            :scale-x="36.09"
            :scale-y="36.09"
            :scale-z="36.09"
            :rotation-x="-160.36"
            :rotation-y="-83.77"
            :rotation-z="103.89"
            :rotation="103.89"
            src="../public/gun.glb"
          />
        </Find>
        >

        <Find name="mixamorigHead" :normal-scale="{ x: 1, y: 1 }">
          <Cube
            :x="700.01"
            :y="1718.89"
            :z="8420.42"
            v-for="(itam, index) in cubeList"
            :key="index"
            color="#252323"
            scale="3"
            ref="zidanRef"
          />
        </Find>
      </Dummy> -->
      </ThirdPersonCamera>
      <Setup default-light="studio" default-orbit-controls />
      <!-- <LingoEditor /> -->
      <Model
        bloom
        :metalness-factor="1"
        :roughness-factor="-0.02"
        :opacity-factor="0.35"
        pbr
        :y="179.08"
        :width="216.16"
        :depth="34.01"
        :scale-x="4"
        :scale-y="4"
        :scale-z="4"
        src="../../public/ganda.fbx"
      />
    </World>
  </div>
</template>
