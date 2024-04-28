import React from 'react';
import { useParams } from 'react-router-dom';

function SensorPage(props) {
  const { sensorDataList } = props;
  const { sensorName } = useParams();
  const sensorData = sensorDataList[sensorName];

  return (
    <div style={styles.sensorHistory}>
      <h1>{sensorName}</h1>
      <h2>Sensor Data</h2>
      {sensorData && sensorData.length > 0 && (
        <ul>
          <li>
            <p style={styles.currentValueTitle}>Valeur actuelle</p>
            <p>Type: {sensorData[sensorData.length - 1].type}</p>
            <p>Value: {sensorData[sensorData.length - 1].value}</p>
          </li>
        </ul>
      )}
      {sensorDataList[sensorName] && sensorDataList[sensorName].length > 1 ? (
        <div>
          <h2>Historical Sensor Data</h2>
          <ul>
            {sensorDataList[sensorName].map((data, index) => (
              <li key={index}>
                <p>Type: {data.type}</p>
                <p>Value: {data.value}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No historical data available</p>
      )}
    </div>
  );
}

const styles = {
  sensorHistory: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  currentValueTitle: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: '10%',
  },
};

export default SensorPage;
