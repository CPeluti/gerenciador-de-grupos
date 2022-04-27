const {pool} = require('../postgres')
const format = require('pg-format')
const e = require('express')

class DaoRelacionamentoTurmasParticipantes {
  constructor () {
    this.tabela = 'turmas_participantes'
    this.bd = pool
  }
  createTable() {
    return new Promise( async (resolve, reject) => {
      try {
        const { rows } = await this.bd.query(`
          CREATE TABLE IF NOT EXISTS ${process.env.DB_SCHEMA}.${this.tabela} (
            id SERIAL PRIMARY KEY,
            id_turma INT NOT NULL,
            matricula_participante VARCHAR(15) NOT NULL,
            CONSTRAINT fk_id_turma
              FOREIGN KEY(id_turma)
                REFERENCES ${process.env.DB_SCHEMA}.turmas(id) ON DELETE CASCADE,
            CONSTRAINT fk_matricula_participante
              FOREIGN KEY(matricula_participante)
                REFERENCES ${process.env.DB_SCHEMA}.participantes(matricula) ON DELETE CASCADE
          );
        `)
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
  create (relacionamento) {
    return new Promise( async (resolve, reject) => {
      const relacionamentos = await this.findBy({id_turma: relacionamento.id_turma, matricula_participante: relacionamento.matricula_participante})
      if(relacionamentos.length <= 0){
        try {
          const { rows } = await this.bd.query(`
            INSERT INTO ${process.env.DB_SCHEMA}.${this.tabela} (id_turma, matricula_participante)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
            RETURNING *;
          `, [relacionamento.id_turma, relacionamento.matricula_participante])
          resolve(rows[0])
        } catch (error) {
          reject(error)
        }
      } else {
        resolve ({})
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
         WHERE CODIGO = $1
        `, [id])
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
}
module.exports = {DaoRelacionamentoTurmasParticipantes}