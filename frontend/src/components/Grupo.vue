<template>
  <div class="wrap">
    <q-img
      class="grupo shadow-1 cursor-pointer"
      fit="fill"
      :src="props.grupo.id_imagem ?`http://localhost:3030/grupos/download/${props.grupo.id_imagem}` : 'gray-bg.jpg'"
      @click="gotoGrupo(props.grupo.id)"
    />
    <q-tooltip anchor="center right" self="center left"><strong class="tooltip">{{props.grupo.nome}}</strong></q-tooltip>

  </div>
</template>
<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import { gruposStore } from 'stores/grupos-store';
  const store = gruposStore();

  const {setGrupoAtual} = store
  // Data
  const router = useRouter()

  const props = defineProps({
    grupo: Array
  })

  // Methods
  const gotoGrupo = async (id: number) => {
      router.push(`/grupo/${id}`)
  }
  // Life cycle hooks
</script>
<style scoped>
    .tooltip{
        font-size: 1.1em;
    }
    .grupo {
        width: 2em;
        height: 2em;
        font-size: 1.5em;
        font-weight: bold;
        color: #2196f3;
        border-radius: 50%;
        background-color: antiquewhite;
    }
    .wrap{
      border-radius: 50%;
      background: rgba(0,0,0,0.5);
    }
    .grupo:hover{
      opacity: 60%;
    }
    .nome {
        opacity: 0%;
    }
    .nome:hover{
        cursor: pointer;
        opacity: 100%;
    }
</style>
