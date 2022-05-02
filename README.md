# gerenciador-de-grupos

## scripts para criação e use de views e procedures necessárias 
```sql
drop function gruposDoUsuario(TEXT);
CREATE FUNCTION gruposDoUsuario( in matricula text)
returns table (descricao_grupo varchar, nome_grupo varchar, id_grupo int, matricula_criador varchar, codigo_turma varchar, semestre_turma varchar, nome_materia varchar, codigo_materia varchar, id_imagem int) AS $$
BEGIN
    RETURN QUERY SELECT grupos.grupos.descricao, grupos.grupos.nome, grupos.grupos.id, u.matricula_participante, t.codigo, t.semestre, m.nome, m.codigo, grupos.grupos.id_imagem FROM grupos.grupos
    inner join grupos.usuarios as u on u.id = grupos.grupos.criado_por 
    inner join grupos.turmas as t on t.id = grupos.grupos.turma_id
    inner join grupos.materias as m on m.codigo = t.codigo_materia 
 	WHERE grupos.grupos.id in (
	 	select ug.id_grupo from grupos.usuarios_grupos as ug 
	 	inner join grupos.usuarios as u on u.id = ug.id_usuario 
	 	where u.matricula_participante = matricula
 	);
 	
END;

$$ LANGUAGE plpgsql;
```
> select * from gruposDoUsuario('190085312');
> http://localhost:3030/grupos/participante/190085312

```sql
drop view allgroups;

CREATE VIEW allGroups AS
SELECT g.*, 
	t.codigo as codigo_turma, 
	t.semestre as semestre_turma, 
	t.horario as horario_turma, 
	m.codigo as codigo_materia, 
	m.nome as nome_materia 
FROM grupos as g
inner join turmas as t on t.id = g.turma_id
inner join materias as m on m.codigo = t.codigo_materia
where g.ativo = true;
```
> select * from allgroups;
> http://localhost:3030/grupos/all

