import { ArrowDownUp } from 'lucide-react'

type SwapDirectionButtonProps = {
  disabled?: boolean
  onClick: () => void
}

export function SwapDirectionButton({
  disabled,
  onClick,
}: SwapDirectionButtonProps) {
  return (
    <div className="relative z-10 -my-2 flex justify-center">
      <button
        aria-label="Reverse swap direction"
        className="grid size-11 place-items-center rounded-full border border-cyan-200/50 bg-cyan-300 text-[#061018] shadow-lg shadow-cyan-950/40 transition hover:scale-105 hover:bg-cyan-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <ArrowDownUp className="size-5" aria-hidden="true" />
      </button>
    </div>
  )
}
