import { useEffect, useState } from 'react'

interface PokemonData {
  name: string
  sprites: {
    front_default: string | null
    other: {
      'official-artwork': { front_default: string | null }
    }
  }
}

export default function App() {
  const [currentName, setCurrentName] = useState('')
  const [imgUrl, setImgUrl] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isSilhouette, setIsSilhouette] = useState(true)
  const [audioSrc, setAudioSrc] = useState('')

  // Cargar Pokémon aleatorio (ID 1 a 151)
  const loadPokemon = async () => {
    const id = Math.floor(Math.random() * 151) + 1
    setAudioSrc(`/src/assets/audio/${id}.mp3`)
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const data: PokemonData = await res.json()
    const url =
      data.sprites.other['official-artwork'].front_default ||
      data.sprites.front_default!
    setCurrentName(data.name.toLowerCase())
    setImgUrl(url)
    setIsSilhouette(true)
    setFeedback('')
  }

  // Verificar respuesta del usuario
  const checkGuess = (guess: string) => {
    const g = guess.trim().toLowerCase()
    const baseName = currentName.replace(/-f|-m/, '') // Normaliza "nidoran-f" → "nidoran"
    if (g === currentName || g === baseName) {
      setFeedback(`¡Correcto! Es ${baseName}!`)
      setIsSilhouette(false)
      new Audio(audioSrc).play()
    } else {
      setFeedback('Incorrecto… intenta de nuevo.')
    }
  }

  useEffect(() => {
    loadPokemon()
  }, [])

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/background_image.jpg')" }} // Imagen de fondo
    >
      <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-xl max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4">¿Quién es este Pokémon?</h1>

        <img
          src={imgUrl}
          alt="Pokémon"
          className={`w-64 mx-auto mb-4 transition-all duration-500 ${
            isSilhouette ? 'filter brightness-0' : 'filter brightness-100'
          }`}
        />

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Tu respuesta"
            className="flex-1 px-3 py-2 border rounded"
            onKeyDown={e =>
              e.key === 'Enter' && checkGuess((e.target as HTMLInputElement).value)
            }
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              const inp = document.querySelector<HTMLInputElement>('input')!
              checkGuess(inp.value)
            }}
          >
            ¡Adivinar!
          </button>
        </div>

        <p className="font-semibold mb-4">{feedback}</p>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={loadPokemon}
        >
          Nuevo Pokémon
        </button>
      </div>
    </div>
  )
}
