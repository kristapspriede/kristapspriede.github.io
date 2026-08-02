import styles from './BuyMeACoffeeButton.module.scss'

export function BuyMeACoffeeButton() {
  return (
    <a
      className={styles.link}
      href="https://www.buymeacoffee.com/kristapsprg"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="https://cdn.buymeacoffee.com/buttons/v2/default-black.png" alt="Buy Me A Coffee" />
    </a>
  )
}
