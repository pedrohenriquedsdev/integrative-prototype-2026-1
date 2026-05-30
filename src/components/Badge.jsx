export function Badge({ children, variant = 'default', size = 'md', icon = null }) {
  const variants = {
    default: 'badge-default',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    primary: 'badge-primary',
    achievement: 'badge-achievement',
  }

  return (
    <span className={`badge ${variants[variant]} ${size === 'lg' ? 'badge-lg' : ''}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  )
}
