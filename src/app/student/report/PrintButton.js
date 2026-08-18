'use client'

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="print:hidden bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 shadow-md mb-8"
    >
      Generate & Download Report
    </button>
  );
}