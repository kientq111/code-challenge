import { SwapForm } from '../features/SwapForm'

export function SwapPage() {
  return (
    <main className="min-h-svh bg-[#090c11] text-slate-100">
      <div className="flex min-h-svh items-center justify-center bg-[linear-gradient(135deg,rgba(20,184,166,0.16),rgba(9,12,17,0.5)_38%,rgba(245,158,11,0.12))] px-4 py-8">
        <SwapForm />
      </div>
    </main>
  )
}
