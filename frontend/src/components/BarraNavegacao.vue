<template>
    <div side="left" class="bar bg-grey window-height flex justify-center q-pt-md">
      <div class="q-gutter-md">
        <div v-for="grupo in meusGrupos" :key="grupo.id">
          <Grupo :grupo="grupo"/>
        </div>
          <CriarGrupo/>
        </div>
    </div>
</template>

<script setup lang="ts">
  import Grupo from 'components/Grupo.vue'
  import CriarGrupo from 'components/CriarGrupo.vue';
  import { storeToRefs } from 'pinia'
  import { gruposStore } from 'stores/grupos-store';
  import { onMounted } from 'vue';
  // Data
  const store = gruposStore();
  const {meusGrupos} = storeToRefs(store);
  const { buscaMeusGrupos } = store;
  onMounted(async ()=>{
    await buscaMeusGrupos()
  })
</script>

<style>
.bar{
  width: 4em
}

</style>
