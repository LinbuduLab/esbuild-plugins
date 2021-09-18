import { useState } from 'preact/hooks';

export default function PreactCounter() {
  const [count, setCount] = useState(0);
  const add = () => setCount((i) => i + 1);
  const subtract = () => setCount((i) => i - 1);

  return (
    <div id="preact" class="counter">
      <button onClick={subtract}>-</button>
      <pre>{count}</pre>
      <button onClick={add}>+</button>
    </div>
  );
}
