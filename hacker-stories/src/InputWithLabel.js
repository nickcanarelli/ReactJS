import React from 'react';
import styles from './App.module.css';

const InputWithLabel = ({ 
    id, 
    value, 
    type = 'text',
    onInputChange ,
    isFocused,
    children,
  }) => {
    const inputRef = React.useRef();
  
    React.useEffect(() => {
      if (isFocused && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isFocused]);
    
    return (
      <>
        <label htmlFor={id} className={styles.label}>
          {children}
        </label>
        <input 
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={onInputChange}
          autoFocus={isFocused}
          className={styles.input}
        />
      </>
    );
};

export default InputWithLabel;