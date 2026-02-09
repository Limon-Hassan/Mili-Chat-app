import React, { Suspense } from 'react';
import ClientMobileProfile from './clientMobileProfile';

export default function page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientMobileProfile />
      </Suspense>
    </>
  );
}
