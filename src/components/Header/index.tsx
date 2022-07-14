import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <div className={styles.headerContent}>
      <img src="/Vector.svg" alt="vector" />
      <Link href="/">
        <a>
          <img src="/spacetraveling.svg" alt="logo" />
          <div className={styles.dot} />
        </a>
      </Link>
    </div>
  );
}
