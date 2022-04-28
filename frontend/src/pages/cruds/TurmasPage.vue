<template>
  <q-card class="window-height">
    <BarraNavegacao class="float-left" />
    <div class="row q-pa-sm q-gutter-md">
        <div class="col-5">
            <q-card class="col-sm-6 col-md-4 q-pa-md" rounded>
                <q-card-section>
                    <div class="text-h6">Cadastro de Turmas</div>
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
                            placeholder="Digite o código da turma"
                        />
                        <q-input
                            class="col-12"
                            outlined
                            v-model="semestre"
                            :rules="[val=>!!val || 'Campo obrigatório']"
                            rounded
                            label="Semestre"
                            placeholder="Digite o semestre da turma"
                        />
                        <q-input
                            class="col-12"
                            outlined
                            v-model="horario"
                            :rules="[val=>!!val || 'Campo obrigatório']"
                            rounded
                            label="Horario"
                            placeholder="Digite o horario da matéria"
                        />
                        <q-select
                            class="col-12"
                            outlined
                            v-model="materia"
                            :options="materias"
                            :rules="[val=>!!val || 'Campo obrigatório']"
                            rounded
                            label="Matéria"
                            placeholder="Escolha a matéria da turma"
                        />
                        <q-btn
                            class="col-12"
                            rounded
                            color="positive"
                            label="Criar"
                            @click="criaTurmas"
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
                            @click="editTurma"
                            v-if="editMode"
                        />
                    </q-form>
                </q-card-section>

            </q-card>
        </div>
        <div class="col-5" >
            <tabela
                :columns="columnsTabela"
                :rows="turmas.value"
                row-key="codigo"
                @edit="changeToEditMode"
                @exclude="excludeTurma"
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
    import { Turma, Materia } from 'components/models';
    // Data
    const form = ref(null)
    const $q = useQuasar()
    const codigo = ref()
    const semestre = ref()
    const horario = ref()
    const materia = ref()
    const materias = ref()
    const editMode = ref(false)
    const codigoEdit = ref()

    const columnsTabela = ref([
        {name: 'codigo', align:'center', label: 'Código', field: 'codigo'},
        {name: 'semestre', align: 'center', label: 'Semestre', field: 'semestre'},
        {name: 'horario', align:'center', label: 'Horario', field: 'horario'},
        {name: 'codigo_materia', align:'center', label: 'Materia', field: 'codigo_materia'},
        {name: 'editar', align:'center', label: 'Editar', field: 'editar'},
        {name: 'excluir', align:'center', label: 'Excluir', field: 'excluir'}
    ])
    const visibleColumns = ref(columnsTabela.value.map(c => c.name))
    let turmas = reactive<Array<Turma>>([])
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
        codigo.value = ''
        semestre.value = ''
        horario.value = ''
        materia.value = ''
    }
    const criaTurmas = async () => {
        const isValid = await form.value.validate()
        if(isValid){
            try {
                const response = await axios.post('http://localhost:3030/turmas', {
                    materias: [{
                        codigo: codigo.value,
                        semestre: semestre.value,
                        horario: horario.value,
                        codigo_materia: materia.value
                    }]
                })
                turmas.value.push(response.data.materias[0])
                $q.notify({
                    color: 'positive',
                    message: 'Turma criada com sucesso'
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
        try {
            const {data} = await axios.get('http://localhost:3030/materias')
            materias.value = data.map((mat: Materia) => {
                return {
                    label: `${mat.nome} (${mat.codigo})`,
                    value: mat.codigo
                }
            })
        } catch (error) {
            $q.notify({
                color: 'negative',
                message: 'Erro ao buscar as materias'
            })
        }
    }
    const buscaTurmas = async () => {
        try{
            const resultado = await axios.get('http://localhost:3030/turmas')
            $q.notify({
                color: 'positive',
                message: `${resultado.data.length} turmas encontradas`,
                timeout: 2000
            })
            turmas.value = resultado.data
        } catch (e) {
            $q.notify({
                color: 'negative',
                message: 'Erro ao buscar as turmas'
            })
        }

    }
    const editTurma = async () => {
        try{
            const res = await axios.patch(`http://localhost:3030/Turmas/${codigoEdit.value}`, {
                codigo: codigo.value,
                semestre: semestre.value,
                horario: horario.value,
                codigo_materia: materia.value,
            })
            editMode.value = false
            buscaTurmas()
        } catch (e) {
            console.error(e)
        }

    }
    const excludeTurma =  (row: Turma) => {
        $q.dialog({
            title: 'Excluir',
            message: `Deseja excluir a turma ${row.codigo} da matéria ${row.codigo_materia}?`,
            ok: 'Sim',
            cancel: 'Não'
        }).onOk(async ()=>{
            try{
                const res = await axios.delete(`http://localhost:3030/Turmas/${row.id}`)
                buscaTurmas()
            } catch (e) {
                console.error(e)
            }
        })


    }
    const changeToEditMode = (row: Turma) => {
        editMode.value = !editMode.value
        codigo.value = row.codigo
        semestre.value = row.semestre
        horario.value = row.horario
        materia.value = row.codigo_materia
        codigoEdit.value = row.id
        // axios.patch(`http://localhost:3030/materias/${row.codigo}`, {
        //     codigo: row.codigo,
        //     nome: row.nome
        // })
    }
    // Life cycle hooks
    onBeforeMount(async () => {
        await buscaMaterias()
        await buscaTurmas()
    })
</script>
