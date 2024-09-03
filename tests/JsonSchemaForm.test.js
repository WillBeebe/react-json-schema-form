import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import JsonSchemaForm from '../src';

describe('JsonSchemaForm', () => {
  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        minLength: 1,
      },
    },
    required: ['name'],
  };

  const uiSchema = {
    name: {
      'ui:autofocus': true,
      'ui:placeholder': 'Name',
    },
  };

  it('renders the form with a name field and submits correctly', async () => {
    const onSubmit = jest.fn();
    render(
      <JsonSchemaForm schema={schema} uiSchema={uiSchema} onSubmit={onSubmit} />
    );

    // Check if the name field is rendered
    const nameInput = screen.getByLabelText('Name');
    expect(nameInput).toBeInTheDocument();

    // Check if the placeholder is set correctly
    expect(nameInput).toHaveAttribute('placeholder', 'Name');

    // Check if the autofocus is working
    expect(nameInput).toHaveFocus();

    // Fill in the name field
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Check if onSubmit was called with the correct data
    expect(onSubmit).toHaveBeenCalledWith({ name: 'John Doe' });
  });

  it('shows validation error when submitting an empty form', async () => {
    const onSubmit = jest.fn();
    render(
      <JsonSchemaForm schema={schema} uiSchema={uiSchema} onSubmit={onSubmit} />
    );

    // Submit the form without filling in the name
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Check if the validation error message is displayed
    const errorMessage = await screen.findByText(/is a required property/i);
    expect(errorMessage).toBeInTheDocument();

    // Check that onSubmit was not called
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
