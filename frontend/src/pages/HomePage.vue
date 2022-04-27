<template>
    <q-card class="window-height">
      <BarraNavegacao class="float-left" />
      <div class="row justify-center q-pa-md">
        <div class="q-mb-xl">
          <q-input v-model="filtro" label="Filtros" placeholder="digite os filtros aqui" rounded outlined class="col-5"/>
        </div>
        <MeusGrupos :filtros="arrayFiltros" class="col-12"/>
      </div>
      <q-dialog v-model="modelAvaliacao">
        <q-card class="my-card">
          <q-card-section>

            <div class="row no-wrap items-center">
              <div class="col text-h4 ellipsis">
                {{avaliacoesPendentes[0].nome_participante}}
              </div>
            </div>
            <div class="text-subtitle1">
              {{avaliacoesPendentes[0].nome_grupo}}
            </div>
            <div class="text-caption text-grey">
              {{avaliacoesPendentes[0].nome}} / {{avaliacoesPendentes[0].turma_codigo}}
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-rating v-model="nota" :max="5" size="32px" />
          </q-card-section>
          <q-separator />

          <q-card-actions align="right">
            <q-btn v-close-popup flat @click="avaliar" color="primary" label="Avaliar" />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
  import axios from 'axios'

  const store = gruposStore();
  const {grupos} = storeToRefs(store);
    // Data
  const nota = ref(0)
  const avaliacoesPendentes = ref([])
  const modelAvaliacao = computed(() => {
    return avaliacoesPendentes.value.length > 0
  })
  const filtro = ref('')
  const arrayFiltros = computed(() => {
    return [filtro.value]
  })
  const avaliar = async () => {
    try{
      await axios.post('http://localhost:3030/usuarios/avaliar', {
        avaliacao: nota.value,
        id_usuario: avaliacoesPendentes.value[0].id_usuario,
        id_grupo: avaliacoesPendentes.value[0].id_grupo,
        id: avaliacoesPendentes.value[0].id
      })
    } catch (e) {
      console.log(e)
    }
    avaliacoesPendentes.value.shift()
  }
  onMounted(async ()=>{
    const res = await axios.get(`http://localhost:3030/usuarios/avaliacoes/pendentes/${JSON.parse(sessionStorage.getItem('userInfo')).id}`)
    avaliacoesPendentes.value = res.data
  })
</script>
