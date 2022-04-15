<template>
    <div class="row q-ma-md">
        <q-card class="col-sm-6 col-md-4 q-pa-md" rounded>
            <q-card-section>
                <div class="text-h6">Busca de matérias</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
                <q-form class="row q-gutter-sm">
                    <q-input
                        class="col-12"
                        v-model="codigo"
                        outlined
                        rounded
                        label="Código"
                        placeholder="Digite o código da materia"
                    />
                    <q-input 
                        class="col-12"
                        outlined
                        v-model="nome"
                        rounded
                        label="Nome"
                        placeholder="Digite o nome da materia"
                    />
                    <q-btn
                        class="col-12"
                        rounded
                        color="primary"
                        label="Buscar"
                        @click="buscaMaterias"
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
            codigo: "",
            nome: "",
            materias: [],
        }
    },
    methods: {
        async buscaMaterias() {
            try{
                const res = await this.$axios.get("http://localhost:3030/materias", {
                    
                })
                console.log(res)
            } catch (e) {
                console.error(e)
            }
        },
    }
}
</script>