'use client';
import { useEffect, useRef } from 'react';

export default function useScrollToBottom(deps = []) {
  const bottomRef = useRef(null);

  useEffect(() => {
    const container = bottomRef.current?.parentElement;
    if (!container) return;
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });

    const handleScroll = () => {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        150;
      if (isNearBottom) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    handleScroll();
  }, deps);

  return bottomRef;
}
