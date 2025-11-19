'use client';
import { useEffect, useRef } from 'react';

export default function useScrollToBottom(deps = []) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, deps);

  return bottomRef;
}
