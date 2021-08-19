import sqlite3 from 'sqlite3'
const sqlite = sqlite3.verbose()

interface DBHandlers {
  successHandler?: (...args: any) => any
  errorHandler?: (err: string) => any
}

interface BirthdayData {
  id?: number
  name: string
  date: string
}

export class DB {
  db
  dbName
  successHandler: (...args: any) => any
  errorHandler: (err: string) => any

  constructor(dbName: string, handlers?: DBHandlers) {
    this.dbName = dbName
    this.successHandler =
      handlers?.successHandler || ((res) => console.log(res))
    this.errorHandler = handlers?.errorHandler || ((err) => console.error(err))

    this.db = new sqlite.Database(dbName, (err) => {
      if (err) {
        this.errorHandler(err.message)
      }
      this.successHandler(`Connected to the SQLite database named ${dbName}`)
    })
  }

  createDateTable(tableName: string) {
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
      ID INTEGER PRIMARY KEY,
      Name TEXT,
      Date TEXT
    )`
    this.db.run(sql, (res: sqlite3.RunResult, err: Error | null) => {
      if (res) {
        this.successHandler(res)
      } else {
        this.successHandler(`Table ${tableName} created.`)
      }
      if (err) {
        this.errorHandler(err.message)
      }
    })
  }

  insertDateItem(tableName: string, item: BirthdayData) {
    const sql = `INSERT INTO ${tableName} (Name, Date)
      VALUES ("${item.name}", "${item.date}")`

    this.db.run(sql, (res: sqlite3.RunResult, err: Error | null) => {
      if (res) {
        this.successHandler(res)
      } else {
        this.successHandler(`Birthday data of ${item.name} was inserted.`)
      }
      if (err) {
        this.errorHandler(err.message)
      }
    })
  }

  insertItemIfNotExist(tableName: string, item: BirthdayData) {
    this.isItemExist(tableName, item, (isExist, item) => {
      if (isExist) {
        this.errorHandler(`INSERT ERROR: Birthday data of ${item.name} exists.`)
      } else {
        this.insertDateItem(tableName, item)
      }
    })
  }

  insertItemsIfNotExist(tableName: string, items: BirthdayData[]) {
    items.forEach((item) => {
      this.insertItemIfNotExist(tableName, item)
    })
  }

  isIDExist(tableName: string, id: number, cb: (isExist: Boolean) => any) {
    const sql = `SELECT ID as id FROM ${tableName}`
    let isExist = false

    this.db.all(sql, (err, rows: BirthdayData[]) => {
      if (err) {
        this.errorHandler(err.message)
      }
      rows?.forEach((row) => {
        if (row.id === id) {
          isExist = true
        }
      })
      cb(isExist)
    })
  }

  isItemExist(
    tableName: string,
    item: BirthdayData,
    cb: (isExist: Boolean, item: BirthdayData) => any
  ) {
    const sql = `SELECT Name as name FROM ${tableName}`
    let isExist = false

    this.db.all(sql, (err, rows: BirthdayData[]) => {
      if (err) {
        this.errorHandler(err.message)
      }
      rows?.forEach((row) => {
        if (row.name === item.name) {
          isExist = true
        }
      })
      cb(isExist, item)
    })
  }

  getDataByID(tableName: string, id: number, cb: (data: BirthdayData) => any) {
    if (id <= 0) {
      this.errorHandler(`ID ${id} is invalid`)
    } else {
      this.isIDExist(tableName, id, (isExist) => {
        if (!isExist) {
          this.errorHandler(`ID ${id} is invalid`)
        } else {
          const sql = `SELECT ID as id, Name as name, Date as date FROM ${tableName} WHERE ID=${id}`

          this.db.get(sql, (err, row) => {
            if (err) {
              this.errorHandler(err.message)
            } else {
              cb(row)
            }
          })
        }
      })
    }
  }

  getAllBirthdayData(tableName: string, cb: (data: BirthdayData[]) => any) {
    const sql = `SELECT ID as id, Name as name, Date as date FROM ${tableName}`

    this.db.all(sql, (err: Error | null, rows: BirthdayData[]) => {
      if (err) {
        this.errorHandler(err.message)
      } else {
        cb(rows)
      }
    })
  }

  updateItem(tableName: string, id: number, item: Pick<BirthdayData, 'date'>) {
    if (id <= 0) {
      this.errorHandler(`ID ${id} is invalid`)
    } else {
      this.isIDExist(tableName, id, (isExist) => {
        if (!isExist) {
          this.errorHandler(`ID ${id} is invalid`)
        } else {
          const sql = `UPDATE ${tableName}
            SET Date="${item.date}"
            WHERE ID=${id}
          `

          this.db.run(sql, (err) => {
            if (err) {
              this.errorHandler(err.message)
            } else {
              this.successHandler(`Birthday data with id ${id} updated.`)
            }
          })
        }
      })
    }
  }

  deleteItem(tableName: string, id: number) {
    if (id <= 0) {
      this.errorHandler(`ID ${id} is invalid`)
    } else {
      this.isIDExist(tableName, id, (isExist) => {
        if (!isExist) {
          this.errorHandler(`ID ${id} is invalid`)
        } else {
          const sql = `DELETE FROM ${tableName} WHERE ID=${id}`

          this.db.run(sql, (err) => {
            if (err) {
              this.errorHandler(err.message)
            } else {
              this.successHandler(`Data with ID ${id} removed`)
            }
          })
        }
      })
    }
  }

  dropTable(tableName: string) {
    const sql = `DROP TABLE ${tableName}`

    this.db.run(sql, (err) => {
      if (err) {
        this.errorHandler(err.message)
      }
    })
  }

  close() {
    this.db.close((err) => {
      if (err) {
        this.errorHandler(err.message)
      } else {
        this.successHandler(
          `Close connection to SQLite database named ${this.dbName}`
        )
      }
    })
  }
}
