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
router.on('pokemons').render('pages/pokemons/index').as('pokemons.index')
router
  .get('/pokemons/:slug', async (ctx) => {
    const url = app.makeURL(`resources/pokemons/${ctx.params.slug}.html`)
    const pokemon = await fs.readFile(url, 'utf-8')
    return ctx.view.render('pages/pokemons/show', { pokemon })
  })
  .as('pokemons.show')
