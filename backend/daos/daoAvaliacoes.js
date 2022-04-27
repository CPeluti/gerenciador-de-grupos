const {pool} = require('../postgres')
const format = require('pg-format')
const { env } = require('process')

class DaoAvaliacoes {
  constructor () {
    this.tabela = 'avaliacoes'
    this.bd = pool
  }
  createTable() {
    return new Promise( async (resolve, reject) => {
      try {
        const { rows } = await this.bd.query(`
          CREATE TABLE IF NOT EXISTS ${process.env.DB_SCHEMA}.${this.tabela} (
            id SERIAL PRIMARY KEY,
            id_usuario INT NOT NULL,
            id_grupo INT NOT NULL,
            avaliacao INT,
            CONSTRAINT fk_id_usuario
              FOREIGN KEY(id_usuario)
                REFERENCES ${process.env.DB_SCHEMA}.usuarios(id) ON DELETE CASCADE,
            CONSTRAINT fk_id_grupo
              FOREIGN KEY(id_grupo)
                REFERENCES ${process.env.DB_SCHEMA}.grupos(id) ON DELETE CASCADE
          );
        `)
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
  create (avaliacao) {
    return new Promise( async (resolve, reject) => {
      try {
        const { rows } = await this.bd.query(`
          INSERT INTO ${process.env.DB_SCHEMA}.${this.tabela} (id_usuario, id_grupo, avaliacao)
          VALUES ($1, $2, $3)
          ON CONFLICT DO NOTHING
          RETURNING *;
        `, [avaliacao.id_usuario, avaliacao.id_grupo, avaliacao.avaliacao])
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
        if(filtros[key]===null){
          let sqlParcial = `%I IS NULL`
          sqlParcial = format(sqlParcial, key)
          binds.push(sqlParcial)
        } else {
          let sqlParcial = `%I = `
          sqlParcial = format(sqlParcial, key)
          binds.push(sqlParcial)
        }
      })
      binds = binds.map(item => {
        if(!item.includes('IS')){
          const condicional = item+`$${contador}`
          contador++
          return condicional
        } else {
          const condicional = item
          return condicional
        }
      })
      const variaveis = [...Object.values(filtros)].filter(item => item!==null)
      try {
        const { rows } = await this.bd.query(`
          SELECT p.*, u.matricula_participante, pa.nome FROM ${process.env.DB_SCHEMA}.${this.tabela} AS p
          INNER JOIN ${process.env.DB_SCHEMA}.usuarios AS u ON p.id_usuario = u.id
          INNER JOIN ${process.env.DB_SCHEMA}.participantes as pa ON pa.matricula = u.matricula_participante
          WHERE ${binds.join(' AND ')};
        `, variaveis)
        resolve(rows)
      } catch (error) {
        reject(error)
      }
    })
  }
  findByMatricula (matricula){
    return new Promise( async (resolve, reject) => {
      if(!matricula){
        reject(new Error('Filtro não informado'))
      }
      try {
        const { rows } = await this.bd.query(`
          SELECT * FROM ${process.env.DB_SCHEMA}.${this.tabela} as p
          INNER JOIN ${process.env.DB_SCHEMA}.usuarios AS u ON p.id_usuario = u.id
          WHERE u.matricula_participante = $1 and p.aceito is null;
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
        reject(new Error('Filtro não informado'))
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
        reject(new Error('Filtro não informado'))
      }
      try {
        const { rows } = await this.bd.query(`
         DELETE FROM ${process.env.DB_SCHEMA}.${this.tabela}
         WHERE id = $1
        `, [id])
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
}
module.exports = {DaoAvaliacoes}