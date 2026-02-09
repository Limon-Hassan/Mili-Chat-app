import React, { Suspense } from 'react';
import ClientMessage from './clientMessage';

export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientMessage />
      </Suspense>
    </>
  );
}
