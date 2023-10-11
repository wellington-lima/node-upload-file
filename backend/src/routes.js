require('dotenv').config();
const Router = require('express')
const multer = require('multer')
const multerConfig = require( './config/multer.js')
const path = require("path")
const fs = require('fs')
const { PrismaClient } = require('@prisma/client')
const { promisify } = require('util')

const routes = Router()

routes.post('/posts', multer(multerConfig).single('file'), async (req, res) => {
  const prisma = new PrismaClient()
  const { originalname: name, size, filename: key, path: url = "" } = req.file

  const post = await prisma.post.create({
    data: {
      name,
      size,
      key,
      url: `${process.env.API_URL}/files/${key}`
    }
  })
  return res.json(post)
})

routes.get('/posts', async (req, res) => {
  const prisma = new PrismaClient()
  const posts = await prisma.post.findMany()
  return res.json(posts)
})

routes.delete('/posts/:id', async (req, res) => {
  const prisma = new PrismaClient()
  const post = await prisma.post.findFirst({
    where: { id: Number(req.params.id) }
  })
  
  //Exclui o registro no banco
  await prisma.post.delete({
    where: { id: Number(req.params.id) }
  })

  //Exclui o arquivo no disco
  promisify(fs.unlink)(
    path.resolve(process.env.SERVER_FILE, post.key)
  )
  return res.send()
})

module.exports = routes