import { categoryShortLabels } from '../data/categories.js'

// `categories`: gösterilecek kategori kimlikleri (Set). `selected` null ise
// "Tümü" seçilidir.
export default function CategoryFilter({ categories, selected, onSelect }) {
  const options = [
    { id: null, label: 'Tümü' },
    ...Object.entries(categoryShortLabels)
      .filter(([id]) => categories.has(id))
      .map(([id, label]) => ({ id, label })),
  ]

  return (
    <div className="filtre" role="group" aria-label="Kategoriye göre filtrele">
      {options.map((option) => (
        <button
          key={option.id ?? 'tumu'}
          type="button"
          className={
            option.id === selected ? 'filtre-dugmesi filtre-dugmesi--secili' : 'filtre-dugmesi'
          }
          aria-pressed={option.id === selected}
          onClick={() => onSelect(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
