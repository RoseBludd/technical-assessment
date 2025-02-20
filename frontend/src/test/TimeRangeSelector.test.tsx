import { render, screen, fireEvent } from '@testing-library/react';
import TimeRangeSelector from '../components/TimeRangeSelector';

describe('TimeRangeSelector Component', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    value: 'day' as const,
    onChange: mockOnChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all time range options', () => {
    render(<TimeRangeSelector {...defaultProps} />);
    
    expect(screen.getByText('Hour')).toBeInTheDocument();
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
  });

  it('highlights the selected time range', () => {
    render(<TimeRangeSelector {...defaultProps} />);
    
    const selectedButton = screen.getByText('Day');
    expect(selectedButton).toHaveClass('bg-secondary');
  });

  it('calls onChange when a different range is selected', () => {
    render(<TimeRangeSelector {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Hour'));
    expect(mockOnChange).toHaveBeenCalledWith('hour');
  });
});