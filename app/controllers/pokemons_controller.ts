import PokemonService from '#services/pokemon_service'
import type { HttpContext } from '@adonisjs/core/http'
import { toHtml } from '@dimerapp/markdown/utils'

export default class PokemonsController {
  async index({ view }: HttpContext) {
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

    return view.render('pages/home', { slugs: fileContents })
  }

  async pokemon({ view, params }: HttpContext) {
    const md = await PokemonService.read(params.slug)
    const pokemonHtml = toHtml(md).contents

    const pokemonData = {
      name: md.frontmatter.pokemonName,
      type: md.frontmatter.pokemonType,
      number: md.frontmatter.pokemonNumber,
      description: md.frontmatter.pokemonDescription,
    }

    view.share({
      pokemonHtml,
      pokemonData,
    })
    return view.render('pages/pokemons/show')
  }
}
