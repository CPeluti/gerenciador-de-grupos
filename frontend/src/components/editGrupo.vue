<template>
    <div class="q-pa-sm q-gutter-md">
        <q-btn @click="editModal" label="Editar Grupo" color="secondary" rounded/>
        <q-dialog v-model="modal" class="q-pa-md">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Edição de Grupo</div>
                </q-card-section>
                <q-card-section class="q-gutter-md">
                    <q-form class="row justify-center">
                        <!-- <img :src="img" @click="editImage"> -->
                        <q-img class="grupo q-mb-xl" fit="fill" @click="modalImg = true" :src="img">
                            <div class="absolute-full nome text-subtitle1 flex flex-center"><q-icon size="3em" name="add"/></div>
                        </q-img>
                        <q-input
                            class="col-12"
                            label="Nome do Grupo"
                            v-model="nome"
                            :rules="[v => !!v || 'Campo obrigatório']"
                            outlined
                            rounded
                        />
                        <q-select
                            class="col-12"
                            label="Turma"
                            v-model="turma"
                            :options="minhasTurmas"
                            :rules="[v => !!v || 'Campo obrigatório']"
                            disable
                            emit-value
                            map-options
                            outlined
                            rounded
                        />
                        <q-select
                            class="col-12"
                            label="interesses"
                            v-model="interessesEscolhidos"
                            use-input
                            :rules="[v => v.length || 'Campo obrigatório']"
                            use-chips
                            multiple
                            emit-value
                            map-options
                            disable
                            outlined
                            rounded
                        />
                        <q-input
                            class="col-12"
                            label="Descrição"
                            v-model="descricao"
                            outlined
                            :rules="[v => !!v || 'Campo obrigatório']"
                            rounded
                            filled
                            clearable
                            autogrow
                        />
                        <q-btn
                            class="col-12"
                            color="negative"
                            label="Finalizar Grupo"
                            outlined
                            rounded
                            filled
                            @click="confirmarFinalizacao"
                        />
                    </q-form>

                </q-card-section>
                <q-card-actions class="flex justify-between">
                    <q-btn label="Cancelar" color="negative" rounded v-close-popup/>
                    <q-btn @click="editarGrupo" label="Confirmar" color="secondary" rounded v-close-popup/>
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="modalImg" class="q-pa-md">
            <q-card>
                <q-card-section class="q-gutter-md">
                    <q-form class="row justify-center">
                        <q-uploader
                            url="http://localhost:3030/grupos/upload"
                            color="teal"
                            @uploaded="uploaded"
                            flat
                            bordered
                            style="max-width: 300px"
                        />
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>

</template>
<script lang="ts" setup>
    import {ref, watch} from 'vue'
    import {useQuasar} from 'quasar'
    import axios from 'axios'
    import { useRoute } from 'vue-router';
    import { gruposStore } from 'stores/grupos-store';
    import {storeToRefs} from 'pinia'
    import { Interesse } from './models';
    const $q = useQuasar()
    const store = gruposStore();
    const router = useRoute()

    const {editGrupo, filtraMateriasJaExistentes, refreshGrupos} = store
    const {grupo} = storeToRefs(store);
    const minhasTurmas = ref([])
    const interessesEscolhidos = ref([])
    const turma = ref()
    const nome = ref()
    const descricao = ref()
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const imgId = ref()
    const img = ref('')
    const modal = ref(false)
    const modalImg = ref(false)
    const editModal = async () => {
        if(grupo.value.id_imagem){
            img.value = `http://localhost:3030/grupos/download/${grupo.value.id_imagem}`
            imgId.value = grupo.value.id_imagem
        }
        turma.value = grupo.value.materia
        nome.value = grupo.value.nome
        descricao.value = grupo.value.descricao
        interessesEscolhidos.value = grupo.value.interesses.map(i => {
            return {
                label: i.interesse,
                value: i.id
            }
        })
        minhasTurmas.value = userInfo.turmas.map(el=>{
            return {
                label: el.nome,
                value: el.id
            }
        })
        minhasTurmas.value = filtraMateriasJaExistentes(minhasTurmas.value)
        modal.value=true

        // if (file) {
        //     const formData = new FormData()
        //     formData.append('file', file)
        //     const {data} = await axios.post('/api/upload', formData)
        //     img.value = data.url
        // }
    }
    const uploaded = async (info) => {
        const json = JSON.parse(info.xhr.response)
        img.value = `http://localhost:3030/grupos/download/${json.id}`
        imgId.value = json.id
        modalImg.value = false
    }
    const editarGrupo = async () => {
        console.log('edit', grupo.value)
        try{
            await editGrupo(grupo.value.id, {
                id_imagem: imgId.value,
                nome: nome.value,
                descricao: descricao.value,
            })
            $q.notify({
                message: 'Grupo alterado com sucesso',
                color: 'positive'
            })
        } catch (e) {
            console.error(e)
            $q.notify({
                color: 'negative',
                message: 'Erro ao alterar grupo',
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
    watch(modal, async (value)=>{
        if(!value) {
            limpaCampos()
        }
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
