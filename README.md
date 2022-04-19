# gerenciador-de-grupos

## Fluxo
loga -> cria grupo -> aceita pedidos -> finaliza grupo -> avaliações
loga -> pesquisa grupo -> envia pedido -> finaliza grupo -> avaliações


## Documentação API
### Grupos
#### POST /grupos
Create grupo
```
{
	grupo: {
    	"nome": "nome do grupo"
        "criado_por": "id do criador do grupo"
        "turma_id": "id da turma do grupo"
    }
}
```
#### GET /grupos
Find grupo
```
localhost:3030/grupos?query
```
#### PATCH /grupos/:id
Update grupo
```
{
	grupo: {
    	"nome": "nome do grupo"
        "criado_por": "id do criador do grupo"
        "turma_id": "id da turma do grupo"
    }
}
```
#### DELETE /grupos/:id
Disable grupo
#### POST /grupos/pedido
Create pedido
#### POST /grupos/pedido/:id
Responde pedido





- /