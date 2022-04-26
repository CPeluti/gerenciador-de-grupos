<template>
  <div class="card q-pa-md q-px-xl flex justify-between items-center shadow-3">
    <div class=" items-center flex">
      <q-img class="imagem q-mr-md shadow-3 cursor-pointer" @click="max = true" :src="grupo.id_imagem ? `http://localhost:3030/grupos/download/${props.grupo.id_imagem}` : 'gray-bg.jpg'"></q-img>
      <div class="flex column">
        <span class="text-h3">
          {{props.grupo.nome}} {{props.grupo.id_imagem}}
        </span>
        <q-separator size=".13em"/>
        <span>{{props.grupo.materia}} / {{props.grupo.turma}}</span>
      </div>
    </div>
    <div v-if="!grupoInviteSent" class="cursor-pointer entrar bg-info shadow-2 flex justify-center items-center">
      <q-icon name="email" class="text-white icon" @click="invite"></q-icon>
    </div>
    <div v-if="grupoInviteSent" class="entrar bg-positive shadow-2 flex justify-center items-center">
      <q-icon name="done" class="text-white icon"></q-icon>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import {useQuasar} from 'quasar'
  import { storeToRefs } from 'pinia'
  import { gruposStore } from 'stores/grupos-store';

  const store = gruposStore();
  const {gruposInviteSent} = storeToRefs(store);
  const {sendInvite} = store;
  const $q = useQuasar()

  const props = defineProps({
    grupo: {
      type: Object,
      required: true,
    }
  })
  const grupoInviteSent = computed(()=>{
    return gruposInviteSent.value.includes(props.grupo.id)
  })
  const max = ref(false)
  const invite = async () => {
    const userId = JSON.parse(sessionStorage.getItem('userInfo')).id
    try{
      await sendInvite(userId, props.grupo.id)
      gruposInviteSent.value.push(props.grupo.id)
      $q.notify({
        message: 'Pedido enviado!',
        color: 'positive'
      })
    } catch (e) {
      console.error(e)
      $q.notify({
        message: 'Erro ao enviar pedido!',
        color: 'negative'
      })
    }
  }
</script>

<style>
.icon{
  font-size: 1.5em;
}
.entrar{
  width: 3em;
  height: 3em;
  border-radius: 50%;
}
.imagem{
  width: 10em;
  height: 10em;
  border-radius: 50%;
}
.card{
  border-radius: 15px;
  background-color: white;
}
</style>
