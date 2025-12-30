interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  onClear?: () => void;
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className=" rounded-lg p-6  space-y-6 ">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      {children}
    </div>
  );
}
