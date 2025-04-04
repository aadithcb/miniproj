export function Input({ className, ...props }) {
  return <input className={`p-2 rounded bg-gray-700 text-white ${className}`} {...props} />;
}
