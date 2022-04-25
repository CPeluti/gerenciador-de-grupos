<template>
    <q-card>
      <BarraNavegacao class="float-left" />
      <MeusGrupos class="window-height"/>
        <!-- <div v-for="grupo in grupos" :key="grupo.id">
          <CardGrupo :grupo="grupo"/>
        </div> -->
        <!-- <CriarGrupo /> -->
    </q-card>
</template>
<script lang="ts" setup>
  import {onMounted} from 'vue'
  // import CriarGrupo from 'src/components/CriarGrupo.vue';
  import MeusGrupos from 'components/MeusGrupos.vue'
  import BarraNavegacao from 'components/BarraNavegacao.vue'
  import CardGrupo from 'components/CardGrupo.vue'
  import { storeToRefs } from 'pinia'
  import { gruposStore } from 'stores/grupos-store';

  const store = gruposStore();
  const {grupos} = storeToRefs(store);
    // Data
</script>
