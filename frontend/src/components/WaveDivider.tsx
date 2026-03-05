export default function WaveDivider() {
  return (
    <div className="w-full overflow-hidden leading-none" aria-hidden="true">
      <svg
        viewBox="0 0 1200 40"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-8 text-border"
        fill="none"
      >
        <path
          d="M0,20 C100,5 200,35 300,20 C400,5 500,35 600,20 C700,5 800,35 900,20 C1000,5 1100,35 1200,20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M0,26 C100,11 200,41 300,26 C400,11 500,41 600,26 C700,11 800,41 900,26 C1000,11 1100,41 1200,26"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}
