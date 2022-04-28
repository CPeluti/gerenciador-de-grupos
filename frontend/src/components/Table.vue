<template>
    <q-table
        class="col-12"
        title="Materias"
        :columns="props.columns"
        :rows="props.rows"
        row-key="props.rowKey"
    >
        <template v-slot:body-cell-editar="props">
                <q-td key="editar">
                    <q-btn
                        color="primary"
                        label="Editar"
                        @click="edit(props.row)"
                    />
                </q-td>
                <q-td key="editar">
                    <q-btn
                        color="negative"
                        label="Excluir"
                        @click="exclude(props.row)"
                    />
                </q-td>
        </template>
    </q-table>
</template>
<script lang="ts" setup>
    import {ref} from 'vue'
    import { Materia, Turma } from './models';

    //emits
    const emit = defineEmits<{
        (e: 'edit', row: Materia|Turma): void,
        (e: 'exclude', row: Materia|Turma): void
    }>()

    //props
    const props = defineProps({
        columns: Array,
        rows: Array,
        rowKey: String,
    })

    const edit = (row: Materia|Turma) => {
        emit('edit', row)
    }
    const exclude = (row: Materia|Turma) => {
        emit('exclude', row)
    }
    // let valores = toRef(props, 'rows')
    const pesquisa = ref(null)
    // watch(pesquisa, (string)=>{
    //     const valoresFiltrados = props.rows?.filter(row => {
    //         return Object.values(row).some(value => value.includes(string))
    //     })
    // })



</script>
