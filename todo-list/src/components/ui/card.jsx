export function Card({ className, children }) {
  return <div className={`p-4 shadow-md rounded bg-gray-800 ${className}`}>{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-2">{children}</div>;
}
