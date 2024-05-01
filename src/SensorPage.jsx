import React from 'react';
import { useParams } from 'react-router-dom';
import './SensorPage.css';

function SensorPage(props) {
  const { sensorDataList } = props;
  const { sensorName } = useParams();
  const sensorData = sensorDataList[sensorName];

  return (
    <div className="sensorHistory">
      <h1>{sensorName}</h1>
      <div className='content'>
        <h2>Valeur actuelle</h2>
        {sensorData && sensorData.length > 0 && (
          <ul>
            <li>
              <p>Valeur: {sensorData[sensorData.length - 1].value}</p>
            </li>
          </ul>
        )}
        {sensorDataList[sensorName] && sensorDataList[sensorName].length > 1 ? (
          <div>
            <h2>Historique</h2>
            <ul>
              {sensorDataList[sensorName].map((data, index) => (
                <li key={index}>
                  <p>valeur: {data.value}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Aucune donnée historique disponible</p>
        )}
      </div>
    </div>
  );
}

export default SensorPage;
