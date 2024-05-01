import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import mqtt from 'mqtt';
import SensorPage from './SensorPage';
import './App.css';


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
      window.location.href = '/';
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
        <div className="container">
          <div className='header'>
            <img className='logo' src='../src/assets/sensor.png' />
          </div>
          <div className="subHeader">
            <h2 className="subHeaderTitle">MQTT Broker:</h2>
            <input
              type="text"
              value={this.state.mqttUrl}
              onChange={this.handleUrlChange}
              placeholder="url"
              className="text"
            />
            <button className="button" onClick={this.handleToggleConnection}>
              {this.state.isConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
          <div className="navbar">
            <ul className="sidebarList">
              {Object.keys(this.state.sensorDataList).map(sensorName => (
                <li
                  key={sensorName}
                  className="sidebarItem"
                  onMouseEnter={() => this.handleMouseEnter(sensorName)}
                  onMouseLeave={() => this.handleMouseLeave()}
                >
                  <Link to={`/sensor/${sensorName}`} className="sidebarLink">{sensorName}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="main-content">
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
export default App;
