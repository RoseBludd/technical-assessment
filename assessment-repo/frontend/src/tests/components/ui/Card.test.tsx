import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

describe('Card Component', () => {
  it('renders card with all its parts', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
        <CardContent>Test Content</CardContent>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className to card', () => {
    render(
      <Card className="custom-class">
        <CardContent>Content</CardContent>
      </Card>
    );

    expect(screen.getByText('Content').parentElement).toHaveClass(
      'custom-class'
    );
  });
});
