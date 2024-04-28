import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import mqtt from 'mqtt';
import SensorPage from './SensorPage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sensorDataList: {},
      hoveredSensor: null, // État pour stocker le capteur survolé
      mqttUrl: 'wss://random.pigne.org',
      isConnected: false // État pour indiquer si la connexion MQTT est établie
    };
    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleToggleConnection = this.handleToggleConnection.bind(this);
  }

  componentWillUnmount() {
    if (this.client) {
      this.client.end();
    }
  }

  connectToMqtt(url) {
    const client = mqtt.connect(url);

    client.on('connect', () => {
      console.log('Connecté au MQTT');
      client.subscribe('value/#');
      this.setState({ isConnected: true });
    });

    client.on('message', (topic, message) => {
      const parsedMessage = JSON.parse(message.toString());
      this.setState(prevState => {
        const updatedList = { ...prevState.sensorDataList };
        if (!updatedList[parsedMessage.name]) {
          updatedList[parsedMessage.name] = [];
        }
        updatedList[parsedMessage.name].push(parsedMessage);
        return { sensorDataList: updatedList };
      });
    });

    this.client = client;
  }

  disconnectFromMqtt() {
    if (this.client) {
      this.client.end();
      this.setState({ isConnected: false, sensorDataList: {} });
    }
  }

  handleMouseEnter(sensorName) {
    this.setState({ hoveredSensor: sensorName });
  }

  handleToggleConnection() {
    if (this.state.isConnected) {
      this.disconnectFromMqtt();
    } else {
      this.connectToMqtt(this.state.mqttUrl);
    }
  }

  handleMouseLeave() {
    this.setState({ hoveredSensor: null });
  }

  handleUrlChange(event) {
    this.setState({ mqttUrl: event.target.value });
  }

  render() {
    return (
      <Router>
        <div style={{ display: 'flex' }}>
          <div style={styles.sidebar}>
            <h2 style={styles.sidebarTitle}>Sensors</h2>
            <input
              type="text"
              value={this.state.mqttUrl}
              onChange={this.handleUrlChange}
              placeholder="MQTT Broker: "
              style={{ marginBottom: '10px' }}
            />
            <button onClick={this.handleToggleConnection}>
              {this.state.isConnected ? 'Disconnect' : 'Connect'}
            </button>
            <ul style={styles.sidebarList}>
              {Object.keys(this.state.sensorDataList).map(sensorName => (
                <li
                  key={sensorName}
                  style={{
                    ...styles.sidebarItem,
                    backgroundColor: this.state.hoveredSensor === sensorName ? '#ddd' : 'transparent'
                  }}
                  onMouseEnter={() => this.handleMouseEnter(sensorName)}
                  onMouseLeave={() => this.handleMouseLeave()}
                >
                  <Link to={`/sensor/${sensorName}`} style={styles.sidebarLink}>{sensorName}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ flex: 1, padding: '20px' }}>
            <Routes>
              <Route
                exact
                path="/"
                element={<div></div>} 
              />
              <Route
                path="/sensor/:sensorName"
                element={<SensorPage sensorDataList={this.state.sensorDataList} />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }
}

const styles = {
  sidebar: {
    width: '200px',
    background: '#f0f0f0',
    padding: '20px',
    borderRight: '1px solid #ccc',
  },
  sidebarTitle: {
    margin: '0 0 20px',
    padding: '0',
  },
  sidebarList: {
    listStyle: 'none',
    padding: 0,
  },
  sidebarItem: {
    marginBottom: '10px',
    transition: 'background-color 0.3s',
  },
  sidebarLink: {
    color: '#333',
    textDecoration: 'none',
    display: 'block',
    padding: '5px 10px',
    borderRadius: '3px',
  },
};

export default App;
