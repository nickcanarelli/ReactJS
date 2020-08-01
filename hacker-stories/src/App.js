import React from 'react';
import axios from 'axios';

import List from './List';
import SearchForm from './SearchForm'; 

import styles from './App.module.css';

const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

const getUrl = (searchTerm, page) =>
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const extractSearchTerm = url =>
  url
    .substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&'))
    .replace(PARAM_SEARCH, '');

const getLastSearches = urls =>
  urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url);

      if (index === 0) {
        return result.concat(searchTerm);
      }

      const previousSearchTerm = result[result.length - 1];

      if (searchTerm === previousSearchTerm) {
        return result;
      } else {
        return result.concat(searchTerm);
      }
    }, [])
    .slice(-6)
    .slice(0, -1);

const useSemiPersistentState = (key, initialState) => {
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      console.log('A');
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};  

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: 
          action.payload.page === 0
            ? action.payload.list
            : state.data.concat(action.payload.list),
        page: action.payload.page,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default: 
      throw new Error();
  }
};

const getSumComments = stories => {
  console.log('C');

  return stories.data.reduce(
    (result, value) => result + value.num_comments,
    0
  );
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const [urls, setUrls] = React.useState([
    getUrl(searchTerm, 0)
  ]);

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], page: 0, isLoading: false, isError: false }
  );

  const handleFetchStories = React.useCallback( async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: {
          list: result.data.hits,
          page: result.data.page,
        },
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]); 

  const handleRemoveStory = React.useCallback(item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }, []);

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = event => {
    handleSearch(searchTerm, 0);

    event.preventDefault();
  };

  console.log('B:App');

  const sumComments = React.useMemo(() => getSumComments(stories), [
    stories,
  ]);

  const handleLastSearch = searchTerm => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm);
  };

  const handleSearch = (searchTerm, page) => {
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));
  }

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  }
  const lastSearches = getLastSearches(urls);

  const LastSearches = ({ lastSearches, onLastSearch }) => (
    <>
      {lastSearches.map((searchTerm, index) => (
        <button
        key={searchTerm + index}
        type="button"
        onClick={() => onLastSearch(searchTerm)}>
          {searchTerm}
        </button>
      ))}
    </>
  );

  return (
    <div>
      <div className={styles.navbar}>
        <div className={styles.logoCont}>
          <h1 className={styles.logoLarge}>Hacker Stories</h1>
          <span className={styles.logoSmall}>Powered by Hacker News</span>
        </div> 
        <div className={styles.searchCont}>
          <SearchForm
            searchTerm={searchTerm}
            onSearchInput={handleSearchInput}
            onSearchSubmit={handleSearchSubmit}
          />
        </div> 
      </div>
      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles['col-8']}>
              <List 
                list={stories.data} 
                onRemoveItem={handleRemoveStory} 
              />

              {stories.isError && <p>Something went wrong ...</p>}

              {stories.isLoading ? (
                <p>Loading ...</p>
              ) : (
                <button type="button" onClick={handleMore}>
                  More  
                </button> 
              )}
            </div>
            <div className={styles['col-4']}>
              <div className={styles.card}>
                <div className={styles.cardBody}>
                  <span className={styles.cardTitle}>Total Comments</span>
                  <span className={styles.cardNumber}>{sumComments}</span>
                </div>
              </div>

              
              <div className={styles.card}>
                <div className={styles.cardBody}>
                  <span className={styles.cardTitle}>Recent Searches</span>
                  <LastSearches 
                    lastSearches={lastSearches}
                    onLastSearch={handleLastSearch}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;