<template>
    <div class="row items-center justify-center text-center">
      <div class="column justify-center col-8 q-gutter-sm">
        <div v-for="grupo in gruposFiltrados" :key="grupo.id_grupo">
          <CardGrupo :grupo="grupo"/>
        </div>
      </div>
    </div>

</template>
<script lang="ts" setup>
    import CardGrupo from 'components/CardGrupo.vue'
    import { computed, onMounted, watch } from 'vue';
    import { storeToRefs } from 'pinia'
    import { gruposStore } from 'stores/grupos-store';
    // Data
    const store = gruposStore();
    const {grupos} = storeToRefs(store);
    const { buscaGrupos, allInvitesSent } = store;
    const props = defineProps({
        filtros: {
            type: Array,
            default: () => [],
        },
    })
    // Methods
    // Life cycle hooks
    onMounted(async () => {
      await buscaGrupos()
      console.log(grupos.value)
      await allInvitesSent(JSON.parse(sessionStorage.getItem('userInfo')).matricula)
    })
    const gruposFiltrados = computed(() => {
        if(grupos.value.length === 0) return []
        return grupos.value.filter(grupo => {
            if(props.filtros.length === 0) return true;
            return props.filtros.some(filtro => {
                return grupo.nome.toLowerCase().includes(filtro.toLowerCase()) || grupo.materia.toLowerCase().includes(filtro.toLowerCase())
            })
        })
    })
</script>
<style scoped>
    .grupo {
        width: 200px;
        height: 200px;
        font-size: 1.5em;
        font-weight: bold;
        color: #2196f3;
        border-radius: 50%;
        background-color: antiquewhite;
    }
    .nome {
        opacity: 0%;
    }
    .nome:hover{
        cursor: pointer;
        opacity: 100%;
    }
</style>
