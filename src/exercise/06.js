
import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null
  })

  //plucking off or destructuring items in state:
  const { status, pokemon, error } = state

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({ status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemonData => { 
        setState({ pokemon: pokemonData, status: 'resolved'})
      },
      error => {
        setState({ error, status: 'rejected'})
      }
    )
  }, [pokemonName])
  
  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
      throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }
  throw new Error('This should be impossible')
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
