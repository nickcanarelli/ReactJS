import { CONSTANTS } from '../actions/';

let listID = 2;
let cardID = 5;

const initialState = [
    {
        id: `list-${0}`,
        title: 'Last Episode',
        cards: [
            {
                id: `card-${0}`,
                text: 'Static list and static card'
            },
            {
                id: `card-${1}`,
                text: 'More text',
            }
        ]
    },
    {
        id: `list-${1}`,
        title: 'This Episode',
        cards: [
            {
                id: `card-${2}`,
                text: 'Static list and static card'
            },
            {
                id: `card-${3}`,
                text: 'More text',
            },
            {
                id: `card-${4}`,
                text: 'Third card',
            }
        ]
    }
];

const listsReducer = (state = initialState, action) => {
    switch (action.type) {
        case CONSTANTS.ADD_LIST:
            const newList = {
                title: action.payload,
                cards: [],
                id: `list-${listID}`
            }
            listID += 1;

            console.log("action received", action);
            
            return [...state, newList];
            
        case CONSTANTS.ADD_CARD: {
            const newCard = {
                text: action.payload.text,
                id: `card-${cardID}`
            };
            cardID += 1;
        
            console.log("action received", action);
        
            const newState = state.map(list => {
                if (list.id === action.payload.listID) {
                return {
                    ...list,
                    cards: [...list.cards, newCard]
                };
                } else {
                return list;
                }
            });

            return newState;
        }
        
        case CONSTANTS.DRAG_HAPPENED:
            const { 
                droppableIdStart,
                droppableIdEnd,
                droppableIndexStart,
                droppableIndexEnd,
                draggableId,
                type
            } = action.payload;

            const newState = [...state];

            // Dragging lists around
            if (type === "list") {
                const list = newState.splice(droppableIndexStart, 1);
                newState.splice(droppableIndexEnd, 0, ...list);
                return newState;
            }

            // In the same list
            if(droppableIdStart === droppableIdEnd) {
                const list = state.find(list => droppableIdStart === list.id);
                const card = list.cards.splice(droppableIndexStart, 1);
                list.cards.splice(droppableIndexEnd, 0, ...card)

            }

            // Drag to a new list 
            if(droppableIdStart !== droppableIdEnd) {
                // Find list where drag originated from
                const listStart = state.find(list => droppableIdStart === list.id)

                // Pull Card from list
                const card = listStart.cards.splice(droppableIndexStart, 1);

                // Find List where card where drag ended
                const listEnd = state.find(list => droppableIdEnd === list.id);

                // Put card into new list
                listEnd.cards.splice(droppableIndexEnd, 0, ...card)

            }
            return newState;

        default: 
            return state;
    }
};

export default listsReducer;