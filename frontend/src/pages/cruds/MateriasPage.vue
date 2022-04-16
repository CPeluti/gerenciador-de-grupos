<template>
    <div class="row q-pa-sm q-gutter-md">
        <div class="col-5">
            <q-card class="col-sm-6 col-md-4 q-pa-md" rounded>
                <q-card-section>
                    <div class="text-h6">Busca de matérias</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <q-form class="row" ref="form">
                        <q-input
                            class="col-12"
                            v-model="codigo"
                            outlined
                            rounded
                            :rules="[val=>!!val || 'Campo obrigatório']"
                            label="Código"
                            :disable="editMode"
                            placeholder="Digite o código da materia"
                        />
                        <q-input 
                            class="col-12"
                            outlined
                            v-model="nome"
                            :rules="[val=>!!val || 'Campo obrigatório']"
                            rounded
                            label="Nome"
                            placeholder="Digite o nome da materia"
                        />
                        <q-btn
                            class="col-12"
                            rounded
                            color="positive"
                            label="Criar"
                            @click="criaMaterias"
                            v-if="!editMode"
                        />
                        <q-btn
                            class="col-6"
                            rounded
                            color="negative"
                            label="Voltar"
                            @click="editMode = false"
                            v-if="editMode"
                        />
                        <q-btn
                            class="col-6"
                            rounded
                            color="primary"
                            label="Editar"
                            @click="editMateria"
                            v-if="editMode"
                        />
                    </q-form>
                </q-card-section>
                
            </q-card>
        </div>
        <div class="col-5" >
            <tabela 
                :columns="columnsTabela"
                :rows="materias.value"
                row-key="codigo"
                @edit="changeToEditMode"
                @exclude="excludeMateria"
                :visible-columns="visibleColumns"
            />
        </div>
    </div>
    
</template>
<script lang="ts" setup>
    import tabela from "components/Table.vue"
    import {ref, reactive, onBeforeMount, watch} from 'vue'
    import {useQuasar} from 'quasar'
    import axios from 'axios' 
    import { Materia } from 'components/models';
    // Data
    const form = ref(null)
    const $q = useQuasar()
    const codigo = ref()
    const nome = ref()
    const editMode = ref(false)
    const codigoEdit = ref()
    
    const columnsTabela = ref([
        {name: 'codigo', align:'center', label: 'Código', field: 'codigo'}, 
        {name: 'nome', align:'center', label: 'Nome', field: 'nome'},
        {name: 'editar', align:'center', label: 'Editar', field: 'editar'},
        {name: 'excluir', align:'center', label: 'Excluir', field: 'excluir'}
    ])
    const visibleColumns = ref(columnsTabela.value.map(c => c.name))
    let materias = reactive<Array<Materia>>([])
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
    const criaMaterias = async () => {
        const isValid = await form.value.validate()
        if(isValid){
            try {
                const response = await axios.post('http://localhost:3030/materias', {
                    materias: [{
                        codigo: codigo.value,
                        nome: nome.value
                    }]
                })
                materias.value.push(response.data.materias[0])
                $q.notify({
                    color: 'positive',
                    message: 'Materia criada com sucesso'
                })
            } catch (error) {
                $q.notify({
                    color: 'negative',
                    message: 'Erro ao criar a materia'
                })
            }
        }
        else {
            $q.notify({
                color: 'negative',
                message: 'Preencha todos os campos'
            })
        }
    }
    const buscaMaterias = async () => {
        try{
            const resultado = await axios.get('http://localhost:3030/materias')
            $q.notify({
                color: 'positive',
                message: `${resultado.data.length} materias encontradas`,
                timeout: 2000
            })
            materias.value = resultado.data
        } catch (e) {
            $q.notify({
                color: 'negative',
                message: 'Erro ao buscar as materias'
            })
        }
        
        console.log(materias)
    }
    const editMateria = async () => {
        try{
            const res = await axios.patch(`http://localhost:3030/materias/${codigoEdit.value}`, {
                codigo: codigo.value,
                nome: nome.value
            })
            editMode.value = false
            console.log(res)
            buscaMaterias()
        } catch (e) {
            console.error(e)
        }
        
    }
    const excludeMateria =  (row: Materia) => {
        $q.dialog({
            title: 'Excluir',
            message: `Deseja excluir a materia ${row.nome}?`,
            ok: 'Sim',
            cancel: 'Não'
        }).onOk(async ()=>{
            try{
                const res = await axios.delete(`http://localhost:3030/materias/${row.codigo}`)
                buscaMaterias()
            } catch (e) {
                console.error(e)
            }
        })
        
        
    }
    const changeToEditMode = (row: Materia) => {
        editMode.value = !editMode.value
        codigo.value = row.codigo
        nome.value = row.nome
        codigoEdit.value = row.codigo
        // axios.patch(`http://localhost:3030/materias/${row.codigo}`, {
        //     codigo: row.codigo,
        //     nome: row.nome
        // })
        console.log(editMode.value)
    }
    // Life cycle hooks
    onBeforeMount(() => {
        buscaMaterias()
    })
</script>