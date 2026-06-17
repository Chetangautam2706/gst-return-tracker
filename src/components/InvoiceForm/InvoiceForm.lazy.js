import React, { lazy, Suspense } from 'react';

const LazyInvoiceForm = lazy(() => import('./InvoiceForm'));

const InvoiceForm = props => (
  <Suspense fallback={null}>
    <LazyInvoiceForm {...props} />
  </Suspense>
);

export default InvoiceForm;
