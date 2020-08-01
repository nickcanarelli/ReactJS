import React from 'react';
import InputWithLabel from './InputWithLabel';
import styles from './App.module.css';

const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit,
  }) => (
    <form onSubmit={onSearchSubmit} className={styles.searchForm}>
      <InputWithLabel
        id="search"
        value={searchTerm}
        placeholder="Search"
        isFocused
        onInputChange={onSearchInput}
      >
      </InputWithLabel>
  
      <button 
        type="submit" 
        disabled={!searchTerm}
        className={`${styles.button} ${styles.buttonLarge}`}
      >
        Submit
      </button>
    </form>
);

export default SearchForm;