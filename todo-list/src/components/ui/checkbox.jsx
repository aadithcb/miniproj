export function Checkbox({ checked, onCheckedChange }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onCheckedChange}
      className="w-5 h-5 cursor-pointer"
    />
  );
}
