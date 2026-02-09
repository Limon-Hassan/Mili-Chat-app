import React, { Suspense } from 'react';
import ClientShowProfile from './ClientShowProfile';

export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientShowProfile />
      </Suspense>
    </>
  );
}
