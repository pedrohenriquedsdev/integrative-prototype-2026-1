export function Level({ level = 1, size = 'md', showLabel = true }) {
  const sizes = {
    sm: 'level-sm',
    md: 'level-md',
    lg: 'level-lg',
  }

  return (
    <div className={`level ${sizes[size]}`}>
      <div className="level-ring">
        <span className="level-number">{level}</span>
      </div>
      {showLabel && <span className="level-label">Level</span>}
    </div>
  )
}
