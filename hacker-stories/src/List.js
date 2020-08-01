import React from 'react';
import { sortBy } from 'lodash';
import styles from './App.module.css';

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENT: list => sortBy(list, 'num_comments').reverse(), 
    POINT: list => sortBy(list, 'points').reverse(),
}

const List = ({ list, onRemoveItem }) => {
    const [sort, setSort] = React.useState({
        sortKey: 'NONE',
        isReverse: false,
    });
        
    const handleSort = sortKey => {
        const isReverse = sort.sortKey === sortKey && !sort.isReverse;
        setSort({ sortKey: sortKey, isReverse: isReverse });
    };

    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse
        ? sortFunction(list).reverse()
        : sortFunction(list);
    
    return (
        <div>
            <div className={styles.sortTitle}>
                Sort By:
            </div>
            <div className={styles.sortList} style={{ display: 'flex'}}>
                <span style={{ width: '40%' }}>
                    <button type="button" onClick={() => handleSort('TITLE')}>
                        Title
                    </button>
                </span>
                <span style={{ width: '25%' }}>
                    <button type="button" onClick={() => handleSort('AUTHOR')}>
                    Author
                    </button>
                </span>
                <span style={{ width: '15%' }}>
                    <button type="button" onClick={() => handleSort('COMMENT')}>
                        Comments
                    </button>
                </span>
                <span style={{ width: '10%' }}>
                    <button type="button" onClick={() => handleSort('POINT')}>
                        Points
                    </button>
                </span>
                <span style={{ width: '10%' }}></span>
            </div>

            {sortedList.map(item => (
                <Item 
                key={item.objectID} 
                item={item} 
                onRemoveItem={onRemoveItem}
                />
            ))}
        </div>
    );
};

  
const Item = ({ item, onRemoveItem }) => {
    
    return (
        <div className={styles.item}>
            <span style={{ width: '40%' }}>
                <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: '25%' }}>{item.author}</span>
            <span style={{ width: '15%' }}>{item.num_comments}</span>
            <span style={{ width: '10%' }}>{item.points}</span>
            <span>
                <button 
                type="button" 
                onClick={() => onRemoveItem(item)}
                className={`${styles.button} ${styles.buttonSmall}`}
                >
                Dismiss
                </button>
            </span>
        </div>
    );
};

export default List;