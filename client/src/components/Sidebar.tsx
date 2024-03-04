import React from 'react';
import styles from '../styles/Sidebar.module.css'; // CSS 모듈 임포트

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
        <ul className={styles.list}>
          {['추가 예정', '추가 예정'].map((text, index) => (
            <li key={text} className={styles.listItem}>
              <span className={styles.icon}>{index % 2 === 0 ? '📥' : '✉️'}</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
};

export default Sidebar;
