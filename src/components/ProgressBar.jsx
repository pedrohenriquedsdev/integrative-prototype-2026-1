export function ProgressBar({ value = 0, max = 100, label, size = 'md', showLabel = true }) {
  const percentage = Math.min((value / max) * 100, 100)
  const sizeClasses = {
    sm: 'progress-sm',
    md: 'progress-md',
    lg: 'progress-lg',
  }

  return (
    <div className={`progress ${sizeClasses[size]}`}>
      {showLabel && label && <span className="progress-label">{label}</span>}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && <span className="progress-value">{value}/{max}</span>}
    </div>
  )
}
