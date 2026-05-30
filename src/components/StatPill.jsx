export function StatPill({ label, value, variant = 'default', trend = null }) {
  const variants = {
    default: 'stat-pill-default',
    primary: 'stat-pill-primary',
    success: 'stat-pill-success',
    warning: 'stat-pill-warning',
  }

  return (
    <div className={`stat-pill ${variants[variant]}`}>
      <div className="stat-pill-header">
        <span className="stat-pill-label">{label}</span>
        {trend && <span className="stat-pill-trend">{trend}</span>}
      </div>
      <strong className="stat-pill-value">{value}</strong>
    </div>
  )
}
