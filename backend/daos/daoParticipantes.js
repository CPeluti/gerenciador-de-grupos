const {pool} = require('../postgres')
const format = require('pg-format')

class DaoParticipantes {
  constructor () {
    this.tabela = 'participantes'
    this.bd = pool
  }
  createTable() {
    return new Promise( async (resolve, reject) => {
      try {
        //TODO: arrumar tamanho do codigo
        const { rows } = await this.bd.query(`
          CREATE TABLE IF NOT EXISTS ${process.env.DB_SCHEMA}.${this.tabela} (
            matricula VARCHAR(15) PRIMARY KEY,
            nome VARCHAR(60) NOT NULL,
            email VARCHAR(255) NOT NULL,
            ocupacao VARCHAR(15) NOT NULL
          );
        `)
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
  create (participante) {
    return new Promise( async (resolve, reject) => {
      try {
        const { rows } = await this.bd.query(`
          INSERT INTO ${process.env.DB_SCHEMA}.${this.tabela} (matricula, nome, email, ocupacao)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT DO NOTHING
          RETURNING *;
        `, [participante.matricula, participante.nome, participante.email, participante.ocupacao])
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
      console.log(`SELECT * FROM ${process.env.DB_SCHEMA}.${this.tabela} WHERE ${binds.join(' AND ')};`, [...Object.values(filtros)])
      try {
        const { rows } = await this.bd.query(`SELECT * FROM ${process.env.DB_SCHEMA}.${this.tabela} ${binds.length? "WHERE" : ""} ${binds.join(' AND ')};`, [...Object.values(filtros)])
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
         WHERE matricula = $1
        `, [id])
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
}
module.exports = {DaoParticipantes}