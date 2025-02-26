import { render, screen } from '@testing-library/react';
import AcmeLogo from './acme-logo';

jest.mock('./ui/sidebar', () => jest.fn(() => <></>));
describe('Acme logo', () => {
  it('renders by default', () => {
    render(<AcmeLogo />);
    expect(screen.getByText('ACME')).toBeInTheDocument();
    expect(screen.getByText('Industries')).toBeInTheDocument();
  });
});
