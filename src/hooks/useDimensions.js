import { useState, useEffect } from 'react';

export default function useDimensions(elementRef) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(elementRef.current.offsetWidth);
  }, [width, elementRef])

  useEffect(() => {
    setHeight(elementRef.current.offsetHeight);
  }, [height, elementRef])

  useEffect(() => {
    const onResize = (e) => {
      setWidth(elementRef.current.offsetWidth);
      setHeight(elementRef.current.offsetHeight);
    };
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [width, height, elementRef]);

  return [width, height];
}
