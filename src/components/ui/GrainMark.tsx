export default function GrainMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 31V12"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M16 13C10.2 12 6.9 8 6.4 3.2C11.2 4.8 14.6 8.2 16 13Z"
        fill="currentColor"
      />
      <path
        d="M16 13C21.8 12 25.1 8 25.6 3.2C20.8 4.8 17.4 8.2 16 13Z"
        fill="currentColor"
        opacity="0.62"
      />
      <path
        d="M16 20C11.8 19 9.2 15.9 8.8 12C12.7 13.4 15 16.3 16 20Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M16 20C20.2 19 22.8 15.9 23.2 12C19.3 13.4 17 16.3 16 20Z"
        fill="currentColor"
        opacity="0.42"
      />
    </svg>
  );
}
