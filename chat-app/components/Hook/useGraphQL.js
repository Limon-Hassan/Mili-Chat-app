'use client';
import { useState, useCallback } from 'react';

const GRAPHQL_URL = 'https://mili-chat-app-server.onrender.com/graphql';

export function useGraphQL() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (query, variables = {}) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });

      const json = await res.json();

      if (json.errors) {
        console.log(json);
        throw new Error(json.errors[0].message);
      }

      return json.data;
    } catch (err) {
      console.error(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
}
