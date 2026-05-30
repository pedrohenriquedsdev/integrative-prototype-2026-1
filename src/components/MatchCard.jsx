import { Badge } from './Badge'

export function MatchCard({ opponent, result, status, score, time, isRecent = false }) {
  const statusConfig = {
    win: { label: 'Vitória', variant: 'success', icon: '✓' },
    loss: { label: 'Derrota', variant: 'danger', icon: '✕' },
    draw: { label: 'Empate', variant: 'primary', icon: '=' },
  }

  const config = statusConfig[status]
  const scores = score.split(' x ')

  return (
    <article className={`match-card ${isRecent ? 'match-card-recent' : ''}`}>
      <div className="match-card-header">
        <div className="match-opponent">
          <div className="opponent-avatar">{opponent.charAt(0).toUpperCase()}</div>
          <div>
            <strong>{opponent}</strong>
            <small>{time}</small>
          </div>
        </div>
        <Badge variant={config.variant} size="sm">
          {config.icon} {config.label}
        </Badge>
      </div>
      <div className="match-score">
        <span className="score-you">{scores[0]}</span>
        <span className="score-vs">vs</span>
        <span className="score-opponent">{scores[1]}</span>
      </div>
    </article>
  )
}
