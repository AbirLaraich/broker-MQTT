import React from 'react';
import { render } from '@testing-library/react';
import SensorPage from './SensorPage';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

describe('SensorPage', () => {
  const sensorDataList = {
    temp_bureau: [
      { value: '25', type: 'POSITIVE_NUMBER' },
      { value: '26', type: 'POSITIVE_NUMBER' },
      { value: '27', type: 'POSITIVE_NUMBER' }
    ],
    ventilateur: [
      { value: 'ON', type: 'ON_OFF' },
      { value: 'OFF', type: 'ON_OFF' }
    ],
    temperature_salle_A111: [
      { value: '22', type: 'POSITIVE_NUMBER' }
    ]
  };

  test('renders sensor name and current value', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/temp_bureau']}>
        <Routes>
          <Route path="/:sensorName" element={<SensorPage sensorDataList={sensorDataList} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('temp_bureau')).toBeTruthy();
    expect(getByText('Valeur: 27')).toBeTruthy(); 
  });

  test('renders historical data if available', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/temp_bureau']}>
        <Routes>
          <Route path="/:sensorName" element={<SensorPage sensorDataList={sensorDataList} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Historique')).toBeTruthy();
    expect(getByText('valeur: 25')).toBeTruthy();
    expect(getByText('valeur: 26')).toBeTruthy();
    expect(getByText('valeur: 27')).toBeTruthy();
  });

  test('renders "Aucune donnée historique disponible" if no historical data available', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/temperature_salle_A111']}>
        <Routes>
          <Route path="/:sensorName" element={<SensorPage sensorDataList={sensorDataList} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Aucune donnée historique disponible')).toBeTruthy();
  });
});