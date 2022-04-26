<template>
  <div class="card q-pa-md flex justify-around items-center shadow-3">
    <div class=" items-center flex">
      <div class="flex column">
        <span class="text-h5">
          {{props.pedido.nome}}
        </span>
        <q-separator size=".13em"/>
        <span>{{props.pedido.matricula_participante}}</span>
      </div>
    </div>
    <div class="cursor-pointer entrar bg-positive shadow-2 flex justify-center items-center">
      <q-icon name="done" class="text-white icon" @click="accept"></q-icon>
      <q-tooltip anchor="center right" self="center left"><strong class="tooltip">Aceitar Pedido</strong></q-tooltip>
    </div>
    <div class="cursor-pointer entrar bg-negative shadow-2 flex justify-center items-center">
      <q-icon name="close" class="text-white icon" @click="reject"></q-icon>
      <q-tooltip anchor="center right" self="center left"><strong class="tooltip">Recusar Pedido</strong></q-tooltip>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import {useQuasar} from 'quasar'
  import { storeToRefs } from 'pinia'
  import { gruposStore } from 'stores/grupos-store';

  const store = gruposStore();
  const {acceptInvite, rejectInvite} = store;
  const $q = useQuasar()

  const props = defineProps({
    pedido: {
      type: Object,
      required: true
    }
  })
  const emit = defineEmits<{
  (e: 'notifyAnswered', value: number): void
}>()
  const accept = async () => {
    await acceptInvite(props.pedido.id)
    emit('notifyAnswered', props.pedido.id)
  }
  const reject = async () => {
    await rejectInvite(props.pedido.id)
    emit('notifyAnswered', props.pedido.id)
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
