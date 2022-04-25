<template>
    <q-card>
        <h3>{{grupo.nome}}</h3>
        <EditGrupo />
    </q-card>
</template>
<script lang="ts" setup>
    import EditGrupo from 'src/components/editGrupo.vue';
    import { useRoute } from 'vue-router'
    import {onMounted} from 'vue'
    import { storeToRefs } from 'pinia'
    import { gruposStore } from 'stores/grupos-store';
    // Data
    const store = gruposStore();
    const {grupo} = storeToRefs(store);
    const router = useRoute()
    // Data
    // onMounted(async ()=>{
    //     await store.buscaGrupos()
    //     store.grupo = await store.filtraGruposById(router.params.id)
    // })
</script>
