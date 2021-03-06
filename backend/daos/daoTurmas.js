const {pool} = require('../postgres')
const format = require('pg-format')
const e = require('express')

class DaoTurmas {
  constructor () {
    this.tabela = 'turmas'
    this.bd = pool
  }
  createTable() {
    return new Promise( async (resolve, reject) => {
      try {
        //TODO: arrumar tamanho do codigo
        const { rows } = await this.bd.query(`
          CREATE TABLE IF NOT EXISTS ${process.env.DB_SCHEMA}.${this.tabela} (
            id SERIAL PRIMARY KEY,
            codigo VARCHAR(15) NOT NULL,
            semestre VARCHAR(8) NOT NULL,
            horario VARCHAR(255) NOT NULL,
            codigo_materia varchar(15) NOT NULL,
            CONSTRAINT fk_codigo_materia
              FOREIGN KEY(codigo_materia)
                REFERENCES ${process.env.DB_SCHEMA}.materias(codigo) ON DELETE CASCADE
          );
        `)
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
  create (turma) {
    return new Promise( async (resolve, reject) => {
      try {
        const turmas = await this.findBy({codigo: turma.codigo, semestre: turma.semestre, codigo_materia: turma.codigo_materia})
        if(turmas.length <= 0){
          const { rows } = await this.bd.query(`
            INSERT INTO ${process.env.DB_SCHEMA}.${this.tabela} (codigo, semestre, horario, codigo_materia)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
            RETURNING *;
          `, [turma.codigo, turma.semestre, turma.horario, turma.codigo_materia])
          resolve(rows[0])
        } else {
          resolve({})
        }
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
        const { rows } = await this.bd.query(`SELECT * FROM ${process.env.DB_SCHEMA}.${this.tabela} ${binds.length? "WHERE" : ""} ${binds.join(' AND ')};`, [...Object.values(filtros)])
        resolve(rows)
      } catch (error) {
        reject(error)
      }
    })
  }
  findByParticipante (filtro) {
    return new Promise( async (resolve, reject) => {
      let binds = []
      let contador = 1
      try {
        const { rows } = await this.bd.query(`SELECT tabela.*, m.nome FROM ${process.env.DB_SCHEMA}.${this.tabela} tabela INNER JOIN ${process.env.DB_SCHEMA}.materias AS m ON m.codigo = tabela.codigo_materia WHERE id in (SELECT id_turma FROM ${process.env.DB_SCHEMA}.turmas_participantes WHERE matricula_participante=$1)`, [filtro.id_usuario])
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
         WHERE ID = $1
        `, [id])
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
}
module.exports = {DaoTurmas}