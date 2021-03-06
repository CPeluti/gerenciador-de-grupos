const {pool} = require('../postgres')
const format = require('pg-format')

class DaoGrupos {
  constructor () {
    this.tabela = 'grupos'
    this.bd = pool
  }
  createTable() {
    return new Promise( async (resolve, reject) => {
      try {
        const { rows } = await this.bd.query(`
          CREATE TABLE IF NOT EXISTS ${process.env.DB_SCHEMA}.${this.tabela} (
            id SERIAL PRIMARY KEY,
            criado_em TIMESTAMP NOT NULL,
            modificado_em TIMESTAMP NOT NULL,
            descricao varchar(255) NOT NULL,
            nome VARCHAR(255) NOT NULL,
            ativo BOOLEAN NOT NULL,
            criado_por INT NOT NULL,
            turma_id INT NOT NULL,
            id_imagem int,
            CONSTRAINT fk_criado_por
              FOREIGN KEY(criado_por)
                REFERENCES ${process.env.DB_SCHEMA}.usuarios(id) ON DELETE CASCADE,
            CONSTRAINT fk_turma_id
              FOREIGN KEY(turma_id)
                REFERENCES ${process.env.DB_SCHEMA}.turmas(id) ON DELETE CASCADE,
            CONSTRAINT fk_id_imagem
              FOREIGN KEY(id_imagem)
                REFERENCES ${process.env.DB_SCHEMA}.arquivos(id) ON DELETE CASCADE
          );
        `)
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
  create (grupo) {
    return new Promise( async (resolve, reject) => {
      try {
        const { rows } = await this.bd.query(`
          INSERT INTO ${process.env.DB_SCHEMA}.${this.tabela} (criado_em, modificado_em, descricao, nome, ativo,criado_por, turma_id)
          VALUES (NOW(), NOW(), $1, $2, $3, $4, $5)
          ON CONFLICT DO NOTHING
          RETURNING *;
        `, [grupo.descricao, grupo.nome, true, grupo.criado_por, grupo.turma_id])
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
  findBy (filtros) {
    return new Promise( async (resolve, reject) => {
      let binds = []
      let contador = 1
      Object.keys(filtros).forEach(key => {
        let sqlParcial = `%I = `
        sqlParcial = format(sqlParcial, key)
        binds.push(sqlParcial)
      })
      binds = binds.map(item => {
        const condicional = item+`$${contador}`
        contador++
        return condicional
      })
      try {
        const { rows } = await this.bd.query(`SELECT * FROM ${process.env.DB_SCHEMA}.${this.tabela} WHERE ${binds.join(' AND ')};`, [...Object.values(filtros)])
        resolve(rows)
      } catch (error) {
        reject(error)
      }
    })
  }
  findByParticipante (matricula) {
    return new Promise( async (resolve, reject) => {
      if(!matricula){
        reject(new Error('Matricula n??o informada'))
      }
      try {
        const { rows } = await this.bd.query(`
          SELECT * FROM ${process.env.DB_SCHEMA}.gruposDoUsuario($1) ;
        `, [matricula])
        resolve(rows)
      } catch (error) {
        reject(error)
      }
    })
  }
  update (filtro, dados) {
    return new Promise( async (resolve, reject) => {
      if(!filtro){
        reject(new Error('Filtro n??o informado'))
      }
      let bindsDados = []
      let contador = 1
      Object.keys(dados).forEach(key => {
        let sqlParcial = `%I = `
        sqlParcial = format(sqlParcial, key)
        bindsDados.push(sqlParcial)
      })
      bindsDados = bindsDados.map(item => {
        const condicional = item+`$${contador}`
        contador++
        return condicional
      })
      let bindsFiltros = []
      Object.keys(filtro).forEach(key => {
        let sqlParcial = `%I = `
        sqlParcial = format(sqlParcial, key)
        bindsFiltros.push(sqlParcial)
      })
      bindsFiltros = bindsFiltros.map(item => {
        const condicional = item+`$${contador}`
        contador++
        return condicional
      })
      try {
        const { rows } = await this.bd.query(`
          UPDATE ${process.env.DB_SCHEMA}.${this.tabela}
          SET ${bindsDados.join(', ')}
          WHERE ${bindsFiltros.join(' AND ')}
          RETURNING *;
        `, [...Object.values(dados), ...Object.values(filtro)])
        resolve(rows)
      } catch (error) {
        reject(error)
      }
    })
  }
  delete (id) {
    return new Promise( async (resolve, reject) => {
      if(!id){
        reject(new Error('Filtro n??o informado'))
      }
      try {
        const { rows } = await this.bd.query(`
         DELETE FROM ${process.env.DB_SCHEMA}.${this.tabela}
         WHERE CODIGO = $1
        `, [id])
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
  findAll(){
    return new Promise( async (resolve, reject) => {
      try {
        const { rows } = await this.bd.query(`
          SELECT * FROM ${process.env.DB_SCHEMA}.allGroups
        `)
        resolve(rows)
      } catch (error) {
        reject(error)
      }
    })
  }
}
module.exports = {DaoGrupos}