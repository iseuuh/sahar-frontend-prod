import { render, screen } from '@testing-library/react';
import Home from './pages/Home';

test('Vérifie la présence du titre Sahâr Nail Care', () => {
  render(<Home />);
  const titre = screen.getByText(/sahâr nail care/i);
  expect(titre).toBeInTheDocument();
});