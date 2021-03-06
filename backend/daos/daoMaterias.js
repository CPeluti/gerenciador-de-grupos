const {pool} = require('../postgres')
const format = require('pg-format')

class DaoMaterias {
  constructor () {
    this.tabela = 'materias'
    this.bd = pool
  }
  createTable() {
    return new Promise( async (resolve, reject) => {
      try {
        //TODO: arrumar tamanho do codigo
        const { rows } = await this.bd.query(`
          CREATE TABLE IF NOT EXISTS ${process.env.DB_SCHEMA}.${this.tabela} (
            codigo VARCHAR(15) PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            id_departamento INT,
            CONSTRAINT fk_id_departamento
              FOREIGN KEY(id_departamento)
                REFERENCES ${process.env.DB_SCHEMA}.departamentos(id) ON DELETE CASCADE
          );
        `)
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
  create (materia) {
    return new Promise( async (resolve, reject) => {
      try {
        const { rows } = await this.bd.query(`
          INSERT INTO ${process.env.DB_SCHEMA}.${this.tabela} (codigo, nome, id_departamento)
          VALUES ($1, $2, $3)
          ON CONFLICT DO NOTHING
          RETURNING *;
        `, [materia.codigo, materia.nome, materia.id_departamento])
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
        const { rows } = await this.bd.query(`SELECT m.*, d.nome as departamento FROM ${process.env.DB_SCHEMA}.${this.tabela} AS m LEFT JOIN ${process.env.DB_SCHEMA}.departamentos AS d on d.id = m.id_departamento ${binds.length? "WHERE" : ""} ${binds.join(' AND ')};`, [...Object.values(filtros)])
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
}
module.exports = {DaoMaterias}