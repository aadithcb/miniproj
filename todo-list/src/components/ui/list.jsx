export function List({ children, className }) {
  return <ul className={`list-none ${className}`}>{children}</ul>;
}

export function ListItem({ children, className }) {
  return <li className={`p-2 bg-gray-700 rounded-lg ${className}`}>{children}</li>;
}
