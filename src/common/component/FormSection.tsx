
interface FormSectionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  onClear?: () => void;
}

export function FormSection({ title, children, onClear }: FormSectionProps) {
  return (
    <div className="border rounded-xl bg-white px-5 py-4 space-y-5">
      {/* Title Row */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>

        {onClear && (
          <button
            onClick={onClear}
            className="text-sm text-gray-500 hover:text-black"
          >
            Clear
          </button>
        )}
      </div>

      {/* Section Body */}
      <div className="border border-gray-200 rounded-xl p-4">
        {children}
      </div>
    </div>
  );
}
