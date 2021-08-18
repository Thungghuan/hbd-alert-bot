import sqlite3 from 'sqlite3'
const sqlite = sqlite3.verbose()

interface BirthdayData {
  id?: number
  name: string
  date: string
  weekday: string
}

export class DB {
  db
  dbName

  constructor(dbName: string) {
    this.dbName = dbName
    this.db = new sqlite.Database(dbName, (err) => {
      if (err) {
        console.error(err.message)
      }
      console.log('Connected to the SQLite database named', dbName)
    })
  }

  createDateTable(tableName: string) {
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
      ID INTEGER PRIMARY KEY,
      Name TEXT,
      Date TEXT,
      Weekday TEXT
    )`
    this.db.run(sql, (res: sqlite3.RunResult, err: Error | null) => {
      if (res) {
        console.log(res)
      } else {
        console.log(`Table ${tableName} created.`)
      }
      if (err) {
        console.error(err.message)
      }
    })
  }

  insertDateItem(tableName: string, item: BirthdayData) {
    const sql = `INSERT INTO ${tableName} (Name, Date, Weekday)
      VALUES ("${item.name}", "${item.date}", "${item.weekday}")`

    this.db.run(sql, (res: sqlite3.RunResult, err: Error | null) => {
      if (res) {
        console.log(res)
      } else {
        console.log(`Birthday data of ${item.name} was inserted.`)
      }
      if (err) {
        console.error(err.message)
      }
    })
  }

  insertItemIfNotExist(tableName: string, item: BirthdayData) {
    this.isItemExist(tableName, item, (isExist, item) => {
      if (isExist) {
        console.error(`INSERT ERROR: Birthday data of ${item.name} exists.`)
      } else {
        this.insertDateItem(tableName, item)
      }
    })
  }

  isIDExist(tableName: string, id: number, cb: (isExist: Boolean) => any) {
    const sql = `SELECT ID as id FROM ${tableName}`
    let isExist = false

    this.db.all(sql, (err, rows: BirthdayData[]) => {
      if (err) {
        console.error(err.message)
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
        console.error(err.message)
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
      console.error(`ID ${id} is invalid`)
    } else {
      this.isIDExist(tableName, id, (isExist) => {
        if (!isExist) {
          console.error(`ID ${id} is invalid`)
        } else {
          const sql = `SELECT ID as id, Name as name, Date as date, Weekday as weekday FROM ${tableName} WHERE ID=${id}`

          this.db.get(sql, (err, row) => {
            if (err) {
              console.error(err)
            } else {
              console.log(row)
            }
          })
        }
      })
    }
  }

  getAllBirthdayData(tableName: string, cb: (data: BirthdayData[]) => any) {
    const sql = `SELECT ID as id, Name as name, Date as date, Weekday as weekday FROM ${tableName}`

    this.db.all(sql, (err: Error | null, rows: BirthdayData[]) => {
      if (err) {
        console.error(err.message)
      } else {
        cb(rows)
      }
    })
  }

  updateItem(
    tableName: string,
    id: number,
    item: Pick<BirthdayData, 'date' | 'weekday'>
  ) {
    if (id <= 0) {
      console.error(`ID ${id} is invalid`)
    } else {
      this.isIDExist(tableName, id, (isExist) => {
        if (!isExist) {
          console.error(`ID ${id} is invalid`)
        } else {
          const sql = `UPDATE ${tableName}
          SET Date="${item.date}", Weekday="${item.weekday}"
          WHERE ID=${id}
          `

          this.db.run(sql, (err) => {
            if (err) {
              console.error(err.message)
            } else {
              console.log(`Birthday data with id ${id} updated.`)
            }
          })
        }
      })
    }
  }

  deleteItem(tableName: string, id: number) {
    if (id <= 0) {
      console.error(`ID ${id} is invalid`)
    } else {
      this.isIDExist(tableName, id, (isExist) => {
        if (!isExist) {
          console.error(`ID ${id} is invalid`)
        } else {
          const sql = `DELETE FROM ${tableName} WHERE ID=${id}`

          this.db.run(sql, (err) => {
            if (err) {
              console.error(err.message)
            } else {
              console.log(`Data with ID ${id} removed`)
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
        console.error(err)
      }
    })
  }

  close() {
    this.db.close((err) => {
      if (err) {
        return console.error(err.message)
      } else {
        console.log('Close connection to SQLite database named', this.dbName)
      }
    })
  }
}
