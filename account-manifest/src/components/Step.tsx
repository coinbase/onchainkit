type StepProps = {
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
  description?: React.ReactNode;
};

export function Step({ disabled, label, description, children }: StepProps) {
  return (
    <div
      className={`flex w-full items-center gap-4 ${disabled ? 'opacity-50' : ''}`}
    >
      <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border-2 border-gray-300 p-4">
        {label}
      </div>
      <div className="flex-shrink-0 flex-grow-0 basis-[206px]">{children}</div>
      {description && (
        <div className="text-gray-500 text-sm">{description}</div>
      )}
    </div>
  );
}
