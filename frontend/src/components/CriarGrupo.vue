<template>
    <div class="row q-pa-sm q-gutter-md">
        <q-btn @click="modal=true" label="Criar Grupo" color="secondary" rounded/>
        <q-dialog v-model="modal" class="q-pa-md">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Criação de Grupo</div>
                </q-card-section>
                <q-card-section class="q-gutter-md">
                    <q-input
                        label="Nome do Grupo"
                        v-model="nome"
                        :rules="[v => !!v || 'Campo obrigatório']"
                        outlined
                        rounded
                    />
                    <q-select
                        label="Turma"
                        v-model="turma"
                        :options="minhasTurmas"
                        :rules="[v => !!v || 'Campo obrigatório']"
                        emit-value
                        map-options
                        outlined
                        rounded
                    />
                    <q-select
                        label="interesses"
                        v-model="interessesEscolhidos"
                        :options="interesses"
                        use-input
                        :rules="[v => v.length || 'Campo obrigatório']"
                        use-chips
                        multiple
                        emit-value
                        map-options
                        outlined
                        rounded
                    />
                    <q-input
                        label="Descrição"
                        v-model="descricao"
                        outlined
                        :rules="[v => !!v || 'Campo obrigatório']"
                        rounded
                        filled
                        clearable
                        autogrow
                    />
                </q-card-section>
                <q-card-actions>
                    <q-btn label="Cancelar" color="negative" rounded v-close-popup/>
                    <q-btn @click="criaGrupos" label="Confirmar" color="secondary" rounded v-close-popup/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
    
</template>
<script lang="ts" setup>
    import {ref, onMounted, watch} from 'vue'
    import {useQuasar} from 'quasar'
    import axios from 'axios' 
    import { gruposStore } from 'stores/grupos-store';
    const $q = useQuasar()
    const store = gruposStore();
    
    const {criaGrupo, filtraMateriasJaExistentes} = store
    const minhasTurmas = ref([])
    const interesses = ref([])
    const interessesEscolhidos = ref([])
    const turma = ref()
    const nome = ref()
    const descricao = ref()
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const modal = ref(false)
    onMounted(async ()=>{
        const todosInteresses = await axios.get('http://localhost:3030/interesses')
        interesses.value = todosInteresses.data.map(el=>{
            return {
                label: el.interesse,
                value: el.id
            }
        })
        minhasTurmas.value = userInfo.turmas.map(el=>{
            return {
                label: el.nome,
                value: el.id
            }
        })
        minhasTurmas.value = filtraMateriasJaExistentes(minhasTurmas.value)
    })
    const criaGrupos = async () => {
        try{
            await criaGrupo({
                nome: nome.value,
                descricao: descricao.value,
                turma_id: turma.value,
                criado_por: userInfo.id
            }, interessesEscolhidos.value)
            $q.notify({
                message: 'Grupo criado com sucesso',
                color: 'positive'
            })
        } catch (e) {
            $q.notify({
                color: 'negative',
                message: 'Erro ao criar grupo',
                position: 'top'
            })
        }
        
    }
    const limpaCampos = () => {
        nome.value = ''
        descricao.value = ''
        turma.value = ''
        interessesEscolhidos.value = []
    }
    watch(modal, (value)=>{
        if(!value) {
            limpaCampos()
        }
    })
</script>