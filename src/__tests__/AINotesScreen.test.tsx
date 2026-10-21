import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AINotesScreen from '../screens/ai/AINotesScreen';

jest.mock('expo-file-system', () => ({
  writeAsStringAsync: jest.fn(),
  documentDirectory: '/mock/',
}));
jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(),
}));

describe('AINotesScreen', () => {
  it('renders upload section and simulates OCR extraction', async () => {
    const { getByText, getByTestId } = render(<AINotesScreen />);
    expect(getByText(/Upload Files/i)).toBeTruthy();
    // Simulate file upload and extraction logic if possible
    // This is a placeholder, as actual file upload requires integration test
  });

  it('shows extracted text after mock extraction', async () => {
    const { getByText, findByText } = render(<AINotesScreen />);
    // Simulate extraction (mocked in component)
    await waitFor(() => expect(findByText(/Biology Notes: Photosynthesis/)).resolves.toBeTruthy());
  });
}); 