require('dotenv').config()

const app = require('./server')

const port = process.env.NODE_PORT || 5600
app.listen(port, () => {
  console.log(`app start, http://127.0.0.1:${port}`)
})