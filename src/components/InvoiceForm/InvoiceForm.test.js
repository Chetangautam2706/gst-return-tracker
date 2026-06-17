import React from 'react';
import ReactDOM from 'react-dom';
import InvoiceForm from './InvoiceForm';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<InvoiceForm />, div);
  ReactDOM.unmountComponentAtNode(div);
});