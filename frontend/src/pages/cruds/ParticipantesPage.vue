<template>
    <div class="row q-pa-sm q-gutter-md">
        <div class="col-5">
            <q-card class="col-sm-6 col-md-4 q-pa-md" rounded>
                <q-card-section>
                    <div class="text-h6">Cadastro de Participantes</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <q-form class="row" ref="form">
                        <q-input
                            class="col-12"
                            v-model="matricula"
                            outlined
                            rounded
                            :rules="[val=>!!val || 'Campo obrigatório']"
                            label="Matricula"
                            placeholder="Digite a matricula do participante"
                        />
                        <q-input
                            class="col-12"
                            outlined
                            v-model="nome"
                            :rules="[val=>!!val || 'Campo obrigatório']"
                            rounded
                            label="Nome"
                            placeholder="Digite o nome do participante"
                        />
                        <q-input
                            class="col-12"
                            outlined
                            v-model="email"
                            :rules="[val=>!!val || 'Campo obrigatório']"
                            rounded
                            label="E-Mail"
                            placeholder="Digite o email do participante"
                        />
                        <q-select
                            class="col-12"
                            outlined
                            v-model="ocupacao"
                            :options="[{label: 'Professor', value: 'docente'}, {label: 'Aluno', value: 'dicente'}]"
                            :rules="[val=>!!val || 'Campo obrigatório']"
                            rounded
                            label="Ocupação"
                            placeholder="Escolha a ocupação do participante"
                        />
                        <q-btn
                            class="col-12"
                            rounded
                            color="positive"
                            label="Criar"
                            @click="criaParticipantes"
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
                            @click="editParticipante"
                            v-if="editMode"
                        />
                    </q-form>
                </q-card-section>

            </q-card>
        </div>
        <div class="col-5" >
            <tabela
                :columns="columnsTabela"
                :rows="participantes.value"
                row-key="codigo"
                @edit="changeToEditMode"
                @exclude="excludeParticipante"
                :visible-columns="visibleColumns"
            />
        </div>
    </div>

</template>
<script lang="ts" setup>
    import tabela from 'components/Table.vue'
    import {ref, reactive, onBeforeMount, watch} from 'vue'
    import {useQuasar} from 'quasar'
    import axios from 'axios'
    import { Participante } from 'components/models';
    // Data
    const form = ref(null)
    const $q = useQuasar()
    const matricula = ref()
    const nome = ref()
    const email = ref()
    const ocupacao = ref()
    const editMode = ref(false)
    const codigoEdit = ref()

    const columnsTabela = ref([
        {name: 'matricula', align:'center', label: 'Matricula', field: 'matricula'},
        {name: 'nome', align: 'center', label: 'Nome', field: 'nome'},
        {name: 'email', align:'center', label: 'E-Mail', field: 'email'},
        {name: 'ocupacao', align:'center', label: 'Ocupação', field: 'ocupacao'},
        {name: 'editar', align:'center', label: 'Editar', field: 'editar'},
        {name: 'excluir', align:'center', label: 'Excluir', field: 'excluir'}
    ])
    const visibleColumns = ref(columnsTabela.value.map(c => c.name))
    let participantes = reactive<Array<Participante>>([])
    // Watch
    watch(editMode, (value)=>{
        if(value){
            visibleColumns.value = visibleColumns.value.filter(column => column !== 'editar')
        } else {
            visibleColumns.value = columnsTabela.value.map(c => c.name)
            clearForm()
        }
    })
    // Methods
    const clearForm = () => {
        matricula.value = ''
        nome.value = ''
        email.value = ''
        ocupacao.value = ''
    }
    const criaParticipantes = async () => {
        const isValid = await form.value.validate()
        if(isValid){
            try {
                const response = await axios.post('http://localhost:3030/participantes', {
                    participantes: [{
                        matricula: matricula.value,
                        nome: nome.value,
                        email: email.value,
                        ocupacao: ocupacao.value.value
                    }]
                })
                participantes.value.push(response.data.participantes[0])
                $q.notify({
                    color: 'positive',
                    message: 'Participante criada com sucesso'
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
    const buscaParticipantes = async () => {
        try{
            const resultado = await axios.get('http://localhost:3030/participantes')
            $q.notify({
                color: 'positive',
                message: `${resultado.data.length} participantes encontradas`,
                timeout: 2000
            })
            participantes.value = resultado.data
        } catch (e) {
            $q.notify({
                color: 'negative',
                message: 'Erro ao buscar os participantes'
            })
        }

    }
    const editParticipante = async () => {
        try{
            const res = await axios.patch(`http://localhost:3030/Participantes/${codigoEdit.value}`, {
                matricula: matricula.value,
                nome: nome.value,
                email: email.value,
                ocupacao: ocupacao.value,
            })
            editMode.value = false
            buscaParticipantes()
        } catch (e) {
            console.error(e)
        }

    }
    const excludeParticipante =  (row: Participante) => {
        $q.dialog({
            title: 'Excluir',
            message: `Deseja excluir o participante ${row.matricula}?`,
            ok: 'Sim',
            cancel: 'Não'
        }).onOk(async ()=>{
            try{
                const res = await axios.delete(`http://localhost:3030/Participantes/${row.matricula}`)
                buscaParticipantes()
            } catch (e) {
                console.error(e)
            }
        })


    }
    const changeToEditMode = (row: Participante) => {
        editMode.value = !editMode.value
        matricula.value = row.matricula
        nome.value = row.nome
        email.value = row.email
        ocupacao.value = row.ocupacao
        codigoEdit.value = row.matricula
        // axios.patch(`http://localhost:3030/materias/${row.codigo}`, {
        //     codigo: row.codigo,
        //     nome: row.nome
        // })
    }
    // Life cycle hooks
    onBeforeMount(async () => {
        await buscaParticipantes()
    })
</script>
