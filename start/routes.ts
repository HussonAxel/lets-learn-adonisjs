/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import fs from 'node:fs/promises'
import app from '@adonisjs/core/services/app'
import { Exception } from '@adonisjs/core/exceptions'
import { MarkdownFile } from '@dimerapp/markdown'
import { toHtml } from '@dimerapp/markdown/utils'
import path from 'node:path'

router
  .get('/', async (ctx) => {
    const url = app.makeURL('resources/pokemons/pokemon/')
    const files = await fs.readdir(url)

    const slugs = files.map((file) => path.parse(file))
    const fileContents = []

    for (const slug of slugs) {
      const filePath = app.makeURL(`${url.pathname}${slug.base}`)
      const fileContent = await fs.readFile(filePath, 'utf-8')
      fileContents.push(fileContent)
      console.log(fileContent)
    }

    return ctx.view.render('pages/home', { slugs: fileContents })
  })
  .as('home')

router
  .get('/pokemons', async (ctx) => {
    const url = app.makeURL('resources/pokemons/index.html')
    const pokemons = await fs.readFile(url, 'utf-8')
    return ctx.view.render('pages/pokemons/index', { pokemons })
  })
  .as('pokemons.index')

router
  .get('/pokemons/:slug', async (ctx) => {
    let file
    const url = app.makeURL(`resources/pokemons/pokemon/${ctx.params.slug}.md`)

    try {
      file = await fs.readFile(url, 'utf-8')
      const md = new MarkdownFile(file)
      await md.process()
      const pokemon = toHtml(md).contents
      ctx.view.share({ pokemon })
    } catch (error) {
      throw new Exception(`${ctx.params.slug} not found`, {
        code: 'E_NOT_FOUND',
        status: 404,
      })
    }
    return ctx.view.render('pages/pokemons/show')
  })
  .as('pokemons.show')
  .where('slug', router.matchers.slug())
