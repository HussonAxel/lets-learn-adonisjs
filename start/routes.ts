/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const PokemonsController = () => import('#controllers/pokemons_controller')

router.get('/', [PokemonsController, 'index']).as('home')

router
  .get('/pokemons/:slug', [PokemonsController, 'pokemon'])
  .as('pokemons.show')
  .where('slug', router.matchers.slug())
