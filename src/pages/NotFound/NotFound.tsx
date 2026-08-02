import { Link } from 'react-router'
import styles from './NotFound.module.scss'

export function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.message}>Page not found.</div>
      <Link className={styles.link} to="/">
        Go home
      </Link>
    </div>
  )
}
