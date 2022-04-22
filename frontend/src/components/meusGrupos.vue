<template>
    <div class="row q-pa-sm q-gutter-md">
        <div class="text-h6 col-12">Meus Grupos</div>
        <div class="col-12 row items-center justify-center q-gutter-md" >
            <div v-for="(grupo) in grupos" :key="grupo.id">
                <div @click="gotoGrupo(grupo.id)" class="col-12 text-center justify-center items-center">
                    <q-img class="grupo" fit="fill" :src="`http://localhost:3030/grupos/download/${grupo.id_imagem}`">
                        <div class="absolute-full text-h5 nome flex flex-center">{{grupo.nome}}</div>
                    </q-img>
                </div>
            </div>
        </div>
    </div>
    
</template>
<script lang="ts" setup>
    import { storeToRefs } from 'pinia'
    import {ref, onMounted, watch} from 'vue'
    import { useRouter } from 'vue-router'
    import { gruposStore } from "stores/grupos-store";
    // Data
    const store = gruposStore();
    const {grupos} = storeToRefs(store);
    const { buscaGrupos } = store;
    const router = useRouter()
    const codigo = ref()
    const nome = ref()
    const editMode = ref(false)
    
    const columnsTabela = ref([
        {name: 'nome', align: 'center', label: 'Nome', field: 'nome'},
        {name: 'descricao', align:'center', label: 'Descricao', field: 'descricao'},
        {name: 'criado_por', align:'center', label: 'Criador', field: 'criado_por'},
        {name: 'semestre', align:'center', label: 'Semestre', field: 'semestre'},
        {name: 'turma', align:'center', label: 'Turma', field: 'turma'},
        {name: 'materia', align:'center', label: 'Materia', field: 'materia'},
        {name: 'codigo_materia', align:'center', label: 'Codigo da Matéria', field: 'codigo_materia'},
    ])
    const visibleColumns = ref(columnsTabela.value.map(c => c.name))
    // Watch
    watch(editMode, (value)=>{
        if(value){
            visibleColumns.value = visibleColumns.value.filter(column => column !== 'editar')
        } else {
            visibleColumns.value = columnsTabela.value.map(c => c.name)
            codigo.value = ''
            nome.value = ''
        }
    })
    // Methods
    const gotoGrupo = async (id: number) => {
        router.push(`/grupo/${id}`)        
    } 
    // Life cycle hooks
    onMounted(async () => {
        console.log('onMounted')
        await buscaGrupos()
        grupos.value = store.grupos

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
