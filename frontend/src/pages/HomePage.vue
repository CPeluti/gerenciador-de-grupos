<template>
    <q-card class="window-height">
      <BarraNavegacao class="float-left" />
      <div class="row justify-center q-pa-md">
        <div class="q-mb-xl">
          <q-input v-model="filtro" label="Filtros" placeholder="digite os filtros aqui" rounded outlined class="col-5"/>
        </div>
        <MeusGrupos :filtros="arrayFiltros" class="col-12"/>
      </div>
        <!-- <div v-for="grupo in grupos" :key="grupo.id">
          <CardGrupo :grupo="grupo"/>
        </div> -->
        <!-- <CriarGrupo /> -->
    </q-card>
</template>
<script lang="ts" setup>
  import {computed, onMounted, ref} from 'vue'
  // import CriarGrupo from 'src/components/CriarGrupo.vue';
  import MeusGrupos from 'components/MeusGrupos.vue'
  import BarraNavegacao from 'components/BarraNavegacao.vue'
  import CardGrupo from 'components/CardGrupo.vue'
  import { storeToRefs } from 'pinia'
  import { gruposStore } from 'stores/grupos-store';

  const store = gruposStore();
  const {grupos} = storeToRefs(store);
    // Data
  const filtro = ref('')
  const arrayFiltros = computed(() => {
    return [filtro.value]
  })
</script>
