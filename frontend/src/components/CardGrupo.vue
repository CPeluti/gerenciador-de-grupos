<template>
  <div class="card q-pa-md flex justify-around items-center shadow-3">
    <div class=" items-center flex">
      <q-img class="imagem q-mr-md shadow-3 cursor-pointer" @click="max = true" :src="imagem"></q-img>
      <div class="flex column">
        <span class="text-h3">
          {{props.grupo.nome}}
        </span>
        <q-separator size=".13em"/>
        <span>{{props.grupo.materia}} / {{props.grupo.turma}}</span>
      </div>
    </div>
    <div v-if="!inviteSent" class="cursor-pointer entrar bg-info shadow-2 flex justify-center items-center">
      <q-icon name="email" class="text-white icon" @click="invite"></q-icon>
    </div>
    <div v-if="inviteSent" class="entrar bg-positive shadow-2 flex justify-center items-center">
      <q-icon name="done" class="text-white icon" @click="invite"></q-icon>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import {useQuasar} from 'quasar'

  const $q = useQuasar()

  const props = defineProps({
    grupo: {
      type: Object,
      required: true,
    },
  })

  const inviteSent = ref(false)
  const max = ref(false)
  const imagem = props.grupo.id_imagem ? `http://localhost:3030/grupos/download/${props.grupo.id_imagem}` : 'gray-bg.png'
  const invite = () => {
    inviteSent.value = true
    $q.notify({
      message: 'Pedido enviado!',
      color: 'positive'
    })
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
