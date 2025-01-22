'use client';

import { useState } from 'react';
import styles from '@/styles/Home.module.css';

// 초성, 중성, 종성 배열
const CHOSUNG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JUNGSUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const JONGSUNG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

export default function Home() {
  const [selectedChosung, setSelectedChosung] = useState<string[]>([]);
  const [selectedJungsung, setSelectedJungsung] = useState<string[]>([]);
  const [selectedJongsung, setSelectedJongsung] = useState<string[]>([]);
  const [noJongsung, setNoJongsung] = useState(false);

  // 한글 조합 함수
  const combineHangul = () => {
    if (selectedChosung.length === 0 || selectedJungsung.length === 0) return [];

    const result: string[] = [];
    
    for (const cho of selectedChosung) {
      for (const jung of selectedJungsung) {
        if (noJongsung) {
          const unicode = 0xAC00 + 
            (CHOSUNG.indexOf(cho) * 21 * 28) + 
            (JUNGSUNG.indexOf(jung) * 28);
          result.push(String.fromCharCode(unicode));
        }
        if (selectedJongsung.length > 0) {
          for (const jong of selectedJongsung) {
            const unicode = 0xAC00 + 
              (CHOSUNG.indexOf(cho) * 21 * 28) + 
              (JUNGSUNG.indexOf(jung) * 28) + 
              (JONGSUNG.indexOf(jong));
            result.push(String.fromCharCode(unicode));
          }
        }
      }
    }
    return result;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>한글 낱글자 만들기</h1>
      <div className={styles.section}>
        <h2>초성</h2>
        <div className={styles.controlButtons}>
          <button
            className={styles.controlButton}
            onClick={() => setSelectedChosung([...CHOSUNG])}
          >
            모두
          </button>
          <button
            className={styles.controlButton}
            onClick={() => setSelectedChosung([])}
          >
            해제
          </button>
        </div>
        <div className={styles.buttons}>
          {CHOSUNG.map((char) => (
            <button
              key={char}
              className={selectedChosung.includes(char) ? styles.active : ''}
              onClick={() => {
                setSelectedChosung(prev => 
                  prev.includes(char) 
                    ? prev.filter(c => c !== char)
                    : [...prev, char]
                );
              }}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>중성</h2>
        <div className={styles.controlButtons}>
          <button
            className={styles.controlButton}
            onClick={() => setSelectedJungsung([...JUNGSUNG])}
          >
            모두
          </button>
          <button
            className={styles.controlButton}
            onClick={() => setSelectedJungsung([])}
          >
            해제
          </button>
        </div>
        <div className={styles.buttons}>
          {JUNGSUNG.map((char) => (
            <button
              key={char}
              className={selectedJungsung.includes(char) ? styles.active : ''}
              onClick={() => {
                setSelectedJungsung(prev => 
                  prev.includes(char) 
                    ? prev.filter(c => c !== char)
                    : [...prev, char]
                );
              }}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>종성</h2>
        <div className={styles.controlButtons}>
          <button
            className={styles.controlButton}
            onClick={() => {
              setSelectedJongsung(JONGSUNG.filter(char => char !== ''));
              setNoJongsung(false);
            }}
          >
            모두
          </button>
          <button
            className={styles.controlButton}
            onClick={() => {
              setSelectedJongsung([]);
              setNoJongsung(false);
            }}
          >
            해제
          </button>
        </div>
        <div className={styles.buttons}>
          <button
            className={noJongsung ? styles.active : ''}
            onClick={() => {
              setNoJongsung(prev => !prev);
              setSelectedJongsung([]);
            }}
          >
            X
          </button>
          {JONGSUNG.filter(char => char !== '').map((char) => (
            <button
              key={char}
              className={selectedJongsung.includes(char) ? styles.active : ''}
              onClick={() => {
                setNoJongsung(false);
                setSelectedJongsung(prev => 
                  prev.includes(char) 
                    ? prev.filter(c => c !== char)
                    : [...prev, char]
                );
              }}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.result}>
        {combineHangul().join(', ')}
      </div>
    </div>
  );
} 