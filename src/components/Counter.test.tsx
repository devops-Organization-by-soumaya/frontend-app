import { render, screen, fireEvent } from '@testing-library/react'
import Counter from './Counter'
import React from 'react'

test('increments count when button is clicked', () => {
  render(<Counter />)

  const button = screen.getByText('Increment')
  const countText = screen.getByText(/Count: 0/i)

  expect(countText).toBeInTheDocument()

  fireEvent.click(button)

  expect(screen.getByText(/Count: 1/i)).toBeInTheDocument()
})
