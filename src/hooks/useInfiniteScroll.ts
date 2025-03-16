import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll(
  callback: () => void,
  { threshold = 1.0, rootMargin = '20px' }: UseInfiniteScrollOptions = {}
) {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<IntersectionObserver>();
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin,
      threshold,
    };

    const handleIntersect: IntersectionObserverCallback = async ([entry]) => {
      if (entry.isIntersecting && !isFetching) {
        setIsFetching(true);
        await callback();
        setIsFetching(false);
      }
    };

    if (targetRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersect, options);
      observerRef.current.observe(targetRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, isFetching, rootMargin, threshold]);

  return {
    targetRef,
    isFetching,
  };
} 