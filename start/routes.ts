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
import { toHtml } from '@dimerapp/markdown/utils'
import PokemonService from '#services/pokemon_service'

router
  .get('/', async (ctx) => {
    const slugs = await PokemonService.getSlugs()
    const fileContents = []

    for (const slug of slugs) {
      const md = await PokemonService.read(slug)
      fileContents.push({
        pokemonName: md.frontmatter.pokemonName,
        pokemonType: md.frontmatter.pokemonType,
        pokemonNumber: md.frontmatter.pokemonNumber,
        pokemonDescription: md.frontmatter.pokemonDescription,
      })
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
    const md = await PokemonService.read(ctx.params.slug)
    const pokemonHtml = toHtml(md).contents

    const pokemonData = {
      name: md.frontmatter.pokemonName,
      type: md.frontmatter.pokemonType,
      number: md.frontmatter.pokemonNumber,
      description: md.frontmatter.pokemonDescription,
    }

    ctx.view.share({
      pokemonHtml,
      pokemonData,
    })
    return ctx.view.render('pages/pokemons/show')
  })
  .as('pokemons.show')
  .where('slug', router.matchers.slug())
