import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import TextArea from 'react-textarea-autosize';
import { connect } from "react-redux";
import { addList, addCard } from "../actions";

class TrelloActionButton extends React.Component {
    state = {
        formOpen: false,
        text: "",
    }
    
    openForm = () => {
        this.setState({ 
            formOpen: true,
        });
    };

    closeForm = () => {
        this.setState({
            formOpen: false,
        });
    };

    handleInputChange = e => {
        this.setState({
            text: e.target.value,
        });
    };

    handleAddList = () => {
        const { dispatch } = this.props;
        const { text } = this.state;
    
        if (text) {
          this.setState({
            text: ""
          });
          dispatch(addList(text));
        }
    
        return;
    };
    
    handleAddCard = () => {
        const { dispatch, listID } = this.props;
        const { text } = this.state;

        if (text) {
            this.setState({
            text: ""
            });
            dispatch(addCard(listID, text));
        }
    };

    renderAddButton = () => {
        const { list } = this.props;

        const buttonText = list ? "Add another list" : "Add another card";
        const buttonTextColor = list ? "white" : "#5e6c84";

        return (
            <div 
                onClick={this.openForm}
                className="trello-action-button" 
                style={{ color: buttonTextColor }}
            >
                <AddIcon />
                <p>{buttonText}</p>
            </div>
        )
    };

    renderForm = () => {

        const { list } = this.props;
        const placeholder = list 
            ? "Enter list title..."
            : "Enter a title for this card...";

        const buttonTitle = list 
            ? "Add List"
            : "Add Card";

        return (
            <div className="trello-add-action">
                <div className="trello-card">
                    <div className="trello-card-details">
                        <div className="trello-card-content">
                            <TextArea 
                                placeholder={placeholder}
                                autoFocus
                                onBlur={this.closeForm}
                                value={this.state.text}
                                onChange={this.handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="trello-action-open-buttons">
                    <button 
                        onMouseDown={list ? this.handleAddList : this.handleAddCard}
                        className="btn btn-success"
                    >
                        {buttonTitle}
                    </button>
                    <div className="close">
                        <CloseIcon />
                    </div>
                </div>
            </div>
        )
    }
    
    render() {
        return this.state.formOpen ? this.renderForm() : this.renderAddButton();
    }
}

export default connect() (TrelloActionButton);