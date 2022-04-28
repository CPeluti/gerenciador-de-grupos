<template>
    <div side="left" class="bar bg-grey window-height flex justify-center q-pt-md">
      <div class="q-gutter-md">
        <div>
          <q-btn @click="gotoHome" class="grupo" color="info" icon="home"/>
          <q-tooltip anchor="center right" self="center left"><strong class="tooltip">Criar Grupo</strong></q-tooltip>
        </div>
        <div v-for="grupo in meusGrupos" :key="grupo.id">
          <Grupo :grupo="grupo"/>
        </div>
        <div class="flex column items-center justify-center">
          <CriarGrupo class="q-mb-md"/>
          <div class="q-mb-md">
            <q-btn @click="router.push('/crudMaterias')" class="grupo" color="info" icon="home"/>
            <q-tooltip anchor="center right" self="center left"><strong class="tooltip">CRUD Materias</strong></q-tooltip>
          </div>
          <div class="q-mb-md">
            <q-btn  @click="router.push('/crudDepartamentos')" class="grupo" color="info" icon="home"/>
            <q-tooltip anchor="center right" self="center left"><strong class="tooltip">CRUD Departamentos</strong></q-tooltip>
          </div>
          <div class="q-mb-md">
            <q-btn @click="router.push('/crudTurmas')" class="grupo" color="info" icon="home"/>
            <q-tooltip anchor="center right" self="center left"><strong class="tooltip">CRUD Turmas</strong></q-tooltip>
          </div>
          <div>
            <q-btn @click="router.push('/crudParticipantes')" class="grupo" color="info" icon="home"/>
            <q-tooltip anchor="center right" self="center left"><strong class="tooltip">CRUD Participantes</strong></q-tooltip>
          </div>
        </div>

        </div>
    </div>
</template>

<script setup lang="ts">
  import Grupo from 'components/Grupo.vue'
  import CriarGrupo from 'components/CriarGrupo.vue';
  import { storeToRefs } from 'pinia'
  import { gruposStore } from 'stores/grupos-store';
  import { onMounted } from 'vue';
    import { useRouter } from 'vue-router'

  const router = useRouter()
  // Data
  const store = gruposStore();
  const {meusGrupos} = storeToRefs(store);
  const { buscaMeusGrupos } = store;
  onMounted(async ()=>{
    await buscaMeusGrupos()
  })
  const gotoHome = ()=>{
    router.push('/')
  }
</script>

<style>
.bar{
  width: 4em
}

</style>
