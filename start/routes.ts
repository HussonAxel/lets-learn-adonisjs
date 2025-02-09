/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home').as('home')
router
  .get('/pokemons/my-pokemon', async (ctx) => {
    return ctx.view.render('pages/pokemons', { pokemon: 'Bulbizarre' })
  })
  .as('pokemons.show')
