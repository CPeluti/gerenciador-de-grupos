<template>
    <q-card>
        <BarraNavegacao class="float-left" />
        <div class="row text-center justify-center window-height q-pa-md">
          <h3 class="col-12">{{grupo?.nome}}</h3>
          <div class="row col-12 justify-center" v-if="admin">
            <div class="col-4" v-for="pedido in pedidos" :key="pedido.id">
              <CardPedidos @notifyAnswered="val=>notifyAnswered(val)" :pedido="pedido"/>
            </div>
          </div>
          <EditGrupo class="col-12" v-if="admin" />
        </div>
    </q-card>
</template>
<script lang="ts" setup>
    import CardPedidos from 'components/CardPedidos.vue'
    import BarraNavegacao from 'components/BarraNavegacao.vue'
    import EditGrupo from 'components/editGrupo.vue';
    import { useRoute } from 'vue-router'
    import {computed, onMounted, ref, watch} from 'vue'
    import { storeToRefs } from 'pinia'
    import { gruposStore } from 'stores/grupos-store';
    // Data
    const store = gruposStore();
    const {grupo} = storeToRefs(store);
    const pedidos = ref([])
    const {buscaPedidosGrupo, setGrupoAtual, buscaMeusGrupos} = store
    const router = useRoute()
    onMounted(async ()=>{
        console.log('teste2')
        await buscaMeusGrupos()
        setGrupoAtual(parseInt(router.params.id))
        pedidos.value = await buscaPedidosGrupo(grupo.value.id)
    })
    const notifyAnswered = (id) => {
        pedidos.value = pedidos.value.filter(pedido => pedido.id !== id)
    }
    const admin = computed(()=>{
        return grupo.value.criado_por === JSON.parse(sessionStorage.getItem('userInfo')).matricula
    })
    watch(()=>router.params.id, async (id)=>{
        console.log('teste')
        setGrupoAtual(parseInt(id))
        pedidos.value = await buscaPedidosGrupo(grupo.value.id)
    })
    // Data
    // onMounted(async ()=>{
    //     await store.buscaGrupos()
    //     store.grupo = await store.filtraGruposById(router.params.id)
    // })
</script>
