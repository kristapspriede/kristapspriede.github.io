import styles from "./AboutMe.module.scss";

export function AboutMe() {
  return (
    <div className={styles.container}>
      <div className={styles.aboutme}>
          <p>Hi, I'm Kristaps!<br/>
          I'm a software developer based in Latvia, working mostly on the back-end. Lately, I've been spending my time learning front-end development with React to round out my skills. Outside of work, I like to unplug by going for a run, riding my bike, or watching a good documentary.</p>
      </div>
    </div>
  );
}
