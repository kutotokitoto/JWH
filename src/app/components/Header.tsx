'use client';

import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          한글 도구
        </Link>
        <div className={styles.menu}>
          <Link href="/" className={styles.menuItem}>
            한글 낱글자 만들기
          </Link>
          <Link href="/decompose" className={styles.menuItem}>
            한글 묶음 나누기
          </Link>
        </div>
      </nav>
    </header>
  );
} 