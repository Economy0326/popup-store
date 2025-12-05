const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

interface MonthSelectorProps {
  selected: number
  onChange: (month: number) => void
}

export default function MonthSelector({
  selected,
  onChange,
}: MonthSelectorProps) {
  return (
    <div className="max-w-full overflow-x-auto py-1 no-scrollbar">
      {/* 양옆 padding으로 안 잘리게 */}
      <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
        {MONTHS.map((m) => {
          const isActive = selected === m

          return (
            <button
              key={m}
              type="button"
              onClick={() => onChange(m)}
              className={`
                w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11
                rounded-full
                border
                flex items-center justify-center
                shrink-0
                transition-all duration-200
                transform
                outline-none focus:outline-none focus-visible:outline-none focus:ring-0  
                ${
                  isActive
                    ? 'bg-primary border-primary text-white scale-110'
                    : 'bg-card border-line text-textMuted hover:scale-110 hover:bg-primary hover:border-primary hover:text-white'
                }
              `}
            >
              <span className="text-xs sm:text-sm md:text-sm font-bold">
                {m}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
