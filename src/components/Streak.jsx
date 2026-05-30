export function Streak({ count = 0, icon = '🔥' }) {
  return (
    <div className="streak">
      <span className="streak-icon">{icon}</span>
      <span className="streak-count">{count}</span>
    </div>
  )
}
