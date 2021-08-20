import express from 'express'

export const serverStart = () => {
  const app = express()

  const port = process.env.PORT || 9000

  app.get('/', (req, res) => {
    res.send('HBD-alert-bot is here.')
  })

  app.listen(port)
}
