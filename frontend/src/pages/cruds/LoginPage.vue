<template>
    <div class="row q-ma-md">
        <q-card class="col-sm-6 col-md-4 q-pa-md" rounded>
            <q-card-section>
                <div class="text-h6">Login</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
                <q-form class="row q-gutter-sm" ref="formulario">
                    <q-input
                        class="col-12"
                        :rules="[val => !!val || 'Campo obrigatório']"
                        v-model="usuario"
                        outlined
                        rounded
                        label="Usuário"
                        placeholder="Digite seu Usuário"
                    />
                    <q-input 
                        type="password"
                        :rules="[val => !!val || 'Campo obrigatório']"
                        class="col-12"
                        outlined
                        v-model="senha"
                        rounded
                        label="Senha"
                        placeholder="Digite sua senha"
                    />
                    <q-btn
                        class="col-12"
                        rounded
                        color="primary"
                        label="Entrar"
                        @click="verificarCredenciais"
                    />
                </q-form>
            </q-card-section>
            
        </q-card>
    </div>
</template>
<script lang="ts">
import axios from "axios"
export default {
    name: "MateriasPage",
    data() {
        return {
            usuario: "",
            senha: "",
        }
    },
    methods: {
        async verificarCredenciais() {
            const formularioValido = await this.$refs.formulario.validate()
            if(formularioValido){
                try{
                    const res = await this.$axios.post("http://localhost:3030/login", {
                        username: this.usuario,
                        password: this.senha
                    })
                    console.log(res.data.token)
                    this.$q.notify({
                        message:'Autenticado com sucesso', color: 'positive', position: 'top-right'
                    })
                } catch (e) {
                    this.$q.notify({
                        message:'Autenticado falhou', color: 'negative', position: 'top-right'
                    })
                    console.error(e)
                }
            }
            else{
                this.$q.notify({
                        message:'Preencha os campos', color: 'negative', position: 'top-right'
                    })
            }

        },
    }
}
</script>