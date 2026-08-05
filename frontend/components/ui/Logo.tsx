export function Logo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="40" height="40" rx="10" fill="#4f46e5" />
      <path
        d="M12 16L20 11L28 16V24C28 27.3137 24.4183 30 20 30C15.5817 30 12 27.3137 12 24V16Z"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M16 20L18.5 22.5L24 17"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
