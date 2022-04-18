<template>
    <div class="row q-pa-sm q-gutter-md">
        <div class="text-h6">Meus Grupos</div>
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
        {name: 'departamento', align: 'center', label: 'Departamento', field: 'departamento'},
        {name: 'nome', align:'center', label: 'Nome', field: 'nome'},
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