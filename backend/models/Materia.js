class Materia {
  constructor (bd, materia={}) {
    this.bd = bd
    if(materia!=={}) {
      this.nome = materia.nome
      this.codigo = materia.codigo
    }
  }
  createTable() {
    return new Promise( async (resolve, reject) => {
      try {
        //TODO: arrumar tamanho do codigo
        const { rows } = await this.bd.query(`
          CREATE TABLE IF NOT EXISTS ${process.env.DB_SCHEMA}.materia (
            codigo VARCHAR(15) PRIMARY KEY,
            nome VARCHAR(255) NOT NULL
          );
        `)
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
  create () {
    return new Promise( async (resolve, reject) => {
      try {
        await this.createTable()
        const { rows } = await this.bd.query(`
          INSERT INTO ${process.env.DB_SCHEMA}.materia (codigo, nome)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
          RETURNING *;
        `, [this.codigo, this.nome])
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
  findBy (filtros) {
    return new Promise( async (resolve, reject) => {
      let filtro = []
      let binds = []
      let contador = 1
      Object.keys(filtros).forEach(key => {
        filtro.push(filtros[key])
        binds.push(`${key} = $${contador}`)
        contador++
      })
      try {
        await this.createTable()
        const { rows } = await this.bd.query(`
          SELECT * FROM ${process.env.DB_SCHEMA}.materia WHERE ${binds.join(' AND ')};
        `, filtro)
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
        bindsDados.push(`${key} = $${contador}`)
        contador++
      })
      let bindsFiltros = []
      Object.keys(filtro).forEach(key => {
        bindsFiltros.push(`${key} = $${contador}`)
        contador++
      })
      try {
        await this.createTable()
        const { rows } = await this.bd.query(`
          UPDATE ${process.env.DB_SCHEMA}.materia
          SET ${bindsDados.join(', ')}
          WHERE ${bindsFiltros.join(' AND ')}
          RETURNING *;
        `, [...Object.values(dados), ...Object.values(filtro)])
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
  delete (id) {
    return new Promise( async (resolve, reject) => {
      try {
        await this.createTable()
        const { rows } = await this.bd.query(`
         DELETE FROM ${process.env.DB_SCHEMA}.materia
         WHERE CODIGO = $1
        `, [id])
        resolve(rows[0])
      } catch (error) {
        reject(error)
      }
    })
  }
}
module.exports = Materia