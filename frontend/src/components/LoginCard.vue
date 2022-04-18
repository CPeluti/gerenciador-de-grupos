<template>
<q-card class="q-pa-lg justify-center">
  <div class="row text-center justify-center q-gutter-md">
    <h3 class="col-12">Login</h3>
    <q-input
      class="col-6"
      label="Matricula"
      outlined
      rounded
      v-model="matricula"
    />
    <q-input
      class="col-6"
      outlined
      label="password"
      rounded
      type="password"
      v-model="senha"
    />
    <q-btn class="col-6" @click="login" size="md" rounded label="Entrar" color="secondary"/>
  </div>
</q-card>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { credentialsStore } from "stores/credentials-store";
const credentials = credentialsStore();
const { authenticate } = credentials;
const router = useRouter()
const matricula = ref()
const senha = ref()
const $q = useQuasar()

const login = async () => {
  try{
    const res = await authenticate({
      matricula: matricula.value,
      senha: senha.value
    });
    router.push('/home')
  } catch (e) {
    $q.notify({
      color: 'negative',
      message: 'Matricula ou senha incorretos',
      position: 'top'
    })
  }
  
}
</script>

<style>

</style>