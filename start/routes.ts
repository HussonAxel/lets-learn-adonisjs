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

router.on('/').render('pages/home').as('home')
router
  .get('/pokemons', async (ctx) => {
    const url = app.makeURL('resources/pokemons/index.html')
    const pokemons = await fs.readFile(url, 'utf-8')
    return ctx.view.render('pages/pokemons/index', { pokemons })
  })
  .as('pokemons.index')

router
  .get('/pokemons/:slug', async (ctx) => {
    const url = app.makeURL(`resources/pokemons/pokemon/${ctx.params.slug}.html`)
    const pokemon = await fs.readFile(url, 'utf-8')
    return ctx.view.render('pages/pokemons/show', { pokemon })
  })
  .as('pokemons.show')
