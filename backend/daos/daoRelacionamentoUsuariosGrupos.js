const {pool} = require('../postgres')
const format = require('pg-format')

class DaoRelacionamentoUsuariosGrupos {
  constructor () {
    this.tabela = 'usuarios_grupos'
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
  create (relacionamento) {
    return new Promise( async (resolve, reject) => {
      try {
        const { rows } = await this.bd.query(`
          INSERT INTO ${process.env.DB_SCHEMA}.${this.tabela} (id_usuario, id_grupo)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
          RETURNING *;
        `, [relacionamento.id_usuario, relacionamento.id_grupo])
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
  findUserByGrupo (grupo) {
    return new Promise( async (resolve, reject) => {
      try {
        const { rows } = await this.bd.query(`SELECT u.id, u.usuario, u.matricula_participante FROM ${process.env.DB_SCHEMA}.usuarios as u INNER JOIN ${process.env.DB_SCHEMA}.usuarios_grupos AS ug ON ug.id_usuario = u.id WHERE ug.id_grupo = $1;`, [grupo])
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
module.exports = {DaoRelacionamentoUsuariosGrupos}