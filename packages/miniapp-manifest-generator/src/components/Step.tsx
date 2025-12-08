type StepProps = {
  disabled?: boolean;
  number: number;
  label: string;
  children: React.ReactNode;
  description?: React.ReactNode;
};

export function Step({
  disabled,
  number,
  label,
  description,
  children,
}: StepProps) {
  return (
    <div
      data-testid="manifestStep"
      className={`flex w-full items-center gap-4 py-4 ${disabled ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center self-start rounded-full border-2 border-[#E5E7EB] bg-[#E5E7EB] p-4 text-black">
          {number}
        </div>
        <div className="p-2 font-medium text-black text-sm">
          <div>{label}</div>
          <div className="py-2 text-gray-500 text-sm">{description}</div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
