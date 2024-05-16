import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';
import mqtt from 'mqtt';

jest.mock('mqtt', () => {
  const mockMqtt = {
    connect: jest.fn(() => ({
      on: jest.fn((event, callback) => {
        if (event === 'connect') {
          callback();
        }
      }),
      subscribe: jest.fn(),
      end: jest.fn()
    }))
  };
  return mockMqtt;
});

describe('App', () => {
  test('Le bouton de connexion MQTT', () => {
    const { getByText } = render(<App />);
    const connectButton = getByText('Connect');
    expect(connectButton).toBeDefined();
  });

  test('Activer la connexion MQTT en cliquant sur un bouton', () => {
    const { getByText } = render(<App />);
    const connectButton = getByText('Connect');
    fireEvent.click(connectButton);
    expect(mqtt.connect).toHaveBeenCalled();
    expect(connectButton.textContent).toBe('Disconnect');
    fireEvent.click(connectButton);
    expect(connectButton.textContent).toBe('Connect');
  });

  test('Modifier l\'URL MQTT en cas de changement d\'entrée', () => {
    const { getByPlaceholderText } = render(<App />);
    const urlInput = getByPlaceholderText('url');
    fireEvent.change(urlInput, { target: { value: 'wss://example.com' } });
    expect(urlInput.value).toBe('wss://example.com');
  });

  test('Mise à jour l\'état de mqttUrl en cas de modification de l\'entrée de l\'URL', () => {
    const { getByPlaceholderText } = render(<App />);
    const urlInput = getByPlaceholderText('url');
    fireEvent.change(urlInput, { target: { value: 'wss://example.com' } });
    expect(urlInput.value).toBe('wss://example.com');
  });

  test('Afficher les capteurs dans sidebar', () => {
    const sensorDataList = {
      sensor1: [],
      sensor2: [],
    };
    const { container } = render(<App />, { initialState: { sensorDataList } });
    expect(container.firstChild).toMatchSnapshot();
  });
});
