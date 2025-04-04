export function Select({ value, onChange, children }) {
    return (
      <select
        value={value}
        onChange={onChange}
        className="p-2 border rounded bg-gray-200 dark:bg-gray-800"
      >
        {children}
      </select>
    );
  }
  