import React from 'react';
import '../styles/InfoBox.scss';

function InfoBox({ title, cases, active, isCases, isRecovered, isDeaths, total, ...props }) {
  return (
  <div 
    onClick={props.onClick} 
    className={`infoBox ${active && 'infoBox--selected'} ${isCases && 'infoBox--cases'} ${isRecovered && 'infoBox--recovered'} ${isDeaths && 'infoBox--deaths'}`}
  >
      <div className="infoBox__body">
        <div className="infoBox__title">
          {title}
        </div>
        <div className="infoBox__cases">
          {cases}
        </div>
        <div className="infoBox__total">
          {total} Total
        </div>
      </div>
    </div>
  )
}

export default InfoBox;
