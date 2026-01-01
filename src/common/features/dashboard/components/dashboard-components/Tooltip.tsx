const Tooltip = ({ label }: { label: string }) => (
  <div
    className="
      absolute 
      left-full ml-3 
      top-1/2 -translate-y-1/2
      bg-black text-white text-sm
      px-3 py-1.5 rounded-md shadow-lg
      whitespace-nowrap z-[9999]
      opacity-0 group-hover:opacity-100
      pointer-events-none
    "
  >
    {label}
  </div>
);

export default Tooltip;
