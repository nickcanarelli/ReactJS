import React from 'react';
import TrelloCard from './TrelloCard';
import TrelloActionButton from './TrelloActionButton';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import '../styles/TrelloList.css'

const TrelloList = ({ title, cards, listID, index }) => {
    return (
        <Draggable draggableId={String(listID)} index={index} >
            {provided => (
                <div 
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    className="trello-list-wrapper"
                >
                    <Droppable droppableId={String(listID)}>
                        {provided => (
                            <div 
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="trello-list-container"
                            >
                                <div className="trello-list-header">
                                    <span>{title}</span>
                                </div>
                                {cards.map((card, index) => (
                                    <TrelloCard key={card.id} index={index} text={card.text} id={card.id} />
                                ))}
                                {provided.placeholder}
                                <div className="trello-list-action">
                                    <TrelloActionButton listID={listID} />
                                </div>
                            </div>
                        )}  
                    </Droppable>
                </div>
            )}  
        </Draggable>
    );
}

export default TrelloList;