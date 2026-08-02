import { BuyMeACoffeeButton } from '../../components/BuyMeACoffeeButton/BuyMeACoffeeButton'
import styles from './Home.module.scss'

export function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.message}>Coming soon..</div>
      <BuyMeACoffeeButton />
    </div>
  )
}
