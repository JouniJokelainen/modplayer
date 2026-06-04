const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

app.use(
  '/modland',
  createProxyMiddleware({
    target: 'https://modland.com',
    changeOrigin: true,
    pathRewrite: { '^/modland': '' },
  })
)

app.use(express.static(path.join(__dirname, '..', 'dist')))

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Modplayer running at http://localhost:${PORT}`)
})
