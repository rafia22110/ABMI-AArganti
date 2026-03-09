import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchInput from './SearchInput';
import React from 'react';

const mockT = {
  placeholder: 'Search for datasets...',
  button: 'Search',
  buttonLoading: 'Searching...',
  save: 'Save search',
};

describe('SearchInput', () => {
  const defaultProps = {
    query: '',
    setQuery: vi.fn(),
    onSearch: vi.fn(),
    onSave: vi.fn(),
    isLoading: false,
    t: mockT,
  };

  it('renders correctly with initial props', () => {
    render(<SearchInput {...defaultProps} />);
    expect(screen.getByPlaceholderText(mockT.placeholder)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: mockT.button })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: mockT.save })).toBeInTheDocument();
  });

  it('updates query on input change', () => {
    render(<SearchInput {...defaultProps} />);
    const input = screen.getByPlaceholderText(mockT.placeholder);
    fireEvent.change(input, { target: { value: 'climate data' } });
    expect(defaultProps.setQuery).toHaveBeenCalledWith('climate data');
  });

  it('calls onSearch when form is submitted', () => {
    const onSearch = vi.fn();
    render(<SearchInput {...defaultProps} query="agriculture" onSearch={onSearch} />);

    const searchButton = screen.getByRole('button', { name: mockT.button });
    // Using fireEvent.submit on the form
    const form = searchButton.closest('form');
    fireEvent.submit(form!);

    expect(onSearch).toHaveBeenCalledWith('agriculture');
  });

  it('calls onSave when save button is clicked', () => {
    const onSave = vi.fn();
    render(<SearchInput {...defaultProps} query="energy" onSave={onSave} />);

    const saveButton = screen.getByRole('button', { name: mockT.save });
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith('energy');
  });

  it('displays loading text and disables elements when isLoading is true', () => {
    render(<SearchInput {...defaultProps} isLoading={true} />);

    expect(screen.getByPlaceholderText(mockT.placeholder)).toBeDisabled();
    expect(screen.getByRole('button', { name: mockT.buttonLoading })).toBeDisabled();
    expect(screen.getByRole('button', { name: mockT.save })).toBeDisabled();
    expect(screen.queryByText(mockT.button)).not.toBeInTheDocument();
  });

  it('disables buttons when query is empty or whitespace', () => {
    const { rerender } = render(<SearchInput {...defaultProps} query="" />);

    expect(screen.getByRole('button', { name: mockT.button })).toBeDisabled();
    expect(screen.getByRole('button', { name: mockT.save })).toBeDisabled();

    rerender(<SearchInput {...defaultProps} query="   " />);
    expect(screen.getByRole('button', { name: mockT.button })).toBeDisabled();
    expect(screen.getByRole('button', { name: mockT.save })).toBeDisabled();
  });
});
