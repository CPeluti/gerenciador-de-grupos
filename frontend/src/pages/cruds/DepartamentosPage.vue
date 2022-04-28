<template>
  <q-card class="window-height">
    <BarraNavegacao class="float-left" />
    <div class="row q-pa-sm q-gutter-md">
        <div class="col-5">
            <q-card class="col-sm-6 col-md-4 q-pa-md" rounded>
                <q-card-section>
                    <div class="text-h6">CRUD de departamentos</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <q-form class="row" ref="form">
                        <q-input
                            class="col-12"
                            outlined
                            v-model="nome"
                            :rules="[val=>!!val || 'Campo obrigatório']"
                            rounded
                            label="Nome"
                            placeholder="Digite o nome do departamento"
                        />
                        <q-btn
                            class="col-12"
                            rounded
                            color="positive"
                            label="Criar"
                            @click="criaDepartamentos"
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
                :rows="departamentos.value"
                row-key="codigo"
                @edit="changeToEditMode"
                @exclude="excludeMateria"
                :visible-columns="visibleColumns"
            />
        </div>
    </div>

  </q-card>
</template>
<script lang="ts" setup>
    import BarraNavegacao from 'components/BarraNavegacao.vue'
    import tabela from 'components/Table.vue'
    import {ref, reactive, onBeforeMount, watch} from 'vue'
    import {useQuasar} from 'quasar'
    import axios from 'axios'
    // Data
    const form = ref(null)
    const $q = useQuasar()
    const codigo = ref()
    const nome = ref()
    const editMode = ref(false)
    const codigoEdit = ref()

    const columnsTabela = ref([
        {name: 'nome', align:'center', label: 'Nome', field: 'nome'},
        {name: 'editar', align:'center', label: 'Editar', field: 'editar'},
        {name: 'excluir', align:'center', label: 'Excluir', field: 'excluir'}
    ])
    const visibleColumns = ref(columnsTabela.value.map(c => c.name))
    let departamentos = reactive([])
    // Watch
    watch(editMode, (value)=>{
        if(value){
            visibleColumns.value = visibleColumns.value.filter(column => column !== 'editar')
        } else {
            visibleColumns.value = columnsTabela.value.map(c => c.name)
            nome.value = ''
            codigo.value = ''
        }
    })
    // Methods
    const criaDepartamentos = async () => {
        const isValid = await form.value.validate()
        if(isValid){
            try {
                const response = await axios.post('http://localhost:3030/departamentos', {
                    departamentos: [{
                        nome: nome.value
                    }]
                })
                departamentos.value.push(response.data.departamentos[0])
                $q.notify({
                    color: 'positive',
                    message: 'Departamento criada com sucesso'
                })
            } catch (error) {
                $q.notify({
                    color: 'negative',
                    message: 'Erro ao criar o departamento'
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
    const buscaDepartamentos = async () => {
        try{
            const resultado = await axios.get('http://localhost:3030/departamentos')
            $q.notify({
                color: 'positive',
                message: `${resultado.data.length} Departamentos encontrados`,
                timeout: 2000
            })
            departamentos.value = resultado.data
        } catch (e) {
            $q.notify({
                color: 'negative',
                message: 'Erro ao buscar os Departamentos'
            })
        }

    }
    const editMateria = async () => {
        try{
            const res = await axios.patch(`http://localhost:3030/departamentos/${codigoEdit.value}`, {
                nome: nome.value
            })
            editMode.value = false
            buscaDepartamentos()
        } catch (e) {
            console.error(e)
        }

    }
    const excludeMateria =  (row: Materia) => {
        $q.dialog({
            title: 'Excluir',
            message: `Deseja excluir o departamento ${row.nome}?`,
            ok: 'Sim',
            cancel: 'Não'
        }).onOk(async ()=>{
            try{
                const res = await axios.delete(`http://localhost:3030/departamentos/${row.id}`)
                buscaDepartamentos()
            } catch (e) {
                console.error(e)
            }
        })


    }
    const changeToEditMode = (row: Materia) => {
        editMode.value = !editMode.value
        nome.value = row.nome
        codigoEdit.value = row.id
        // axios.patch(`http://localhost:3030/Departamentos/${row.codigo}`, {
        //     codigo: row.codigo,
        //     nome: row.nome
        // })
    }
    // Life cycle hooks
    onBeforeMount(() => {
        buscaDepartamentos()
    })
</script>
