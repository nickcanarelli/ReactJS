import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TrelloCard = ({ text, id, index }) => {
    return( 
        <Draggable draggableId={String(id)} index={index}>
            {provided => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="trello-list-cards">
                    <div className="trello-card">
                        <div className="trello-card-details">
                            <div className="trello-card-content">
                                {text}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}

export default TrelloCard;