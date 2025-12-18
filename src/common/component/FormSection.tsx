interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  onClear?: () => void;
}

export function FormSection({ title, children, onClear }: FormSectionProps) {
  return (
    <div className=" rounded-lg p-6 bg-white space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        {onClear && (
          <button onClick={onClear} className="text-sm text-gray-500">
            Clear Form
          </button>
        )}
      </div>

      {children}
    </div>
  );
}
