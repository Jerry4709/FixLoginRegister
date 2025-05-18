interface SpinnerProps {
  full?: boolean;  // Optional boolean prop
}

export default function Spinner({ full }: SpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${full ? 'h-screen' : ''}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}