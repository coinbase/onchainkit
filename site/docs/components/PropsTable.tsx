import { Code } from './Code.tsx';
import * as Popover from '@radix-ui/react-popover';
import InfoIcon from './svg/infoIcon.tsx';
export type PropDef = {
  name: string;
  required?: boolean;
  default?: string | boolean | undefined;
  type?: string;
  typeSimple: string;
  description?: string | React.ReactNode;
};

const FIXED_PROP_COLUMN_WIDTH = '37%';

const PropsTable = ({ data }: { data: PropDef[] }) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th
            className="pb-1 text-left font-normal"
            style={{ width: FIXED_PROP_COLUMN_WIDTH }}
          >
            Prop
          </th>
          <th className="pb-1 text-left font-normal">Type</th>
          <th className="pb-1 text-left font-normal">Default</th>
        </tr>
      </thead>
      <tbody>
        {data.map((prop) => (
          <tr key={prop.name} className="text-sm">
            <td className="py-2">
              <div className="inline-flex gap-1">
                <Code variant="blue">{prop.name}</Code>
                {prop.description && (
                  <Popover.Root>
                    <Popover.Trigger>
                      {/* <IconButton variant="ghost" size="1" color="gray"> */}
                      {/* <AccessibleIcon label="Prop description"> */}
                      <InfoIcon className="size-[14px] text-[#4c4c4c]" />
                      {/* </AccessibleIcon> */}
                      {/* </IconButton> */}
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        side="top"
                        align="center"
                        className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 rounded-md border border-gray-200 bg-white p-4 text-sm shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in"
                        style={{ maxWidth: 350 }}
                        onOpenAutoFocus={(event) => {
                          event.preventDefault();
                          (event.currentTarget as HTMLElement)?.focus();
                        }}
                      >
                        <div>{prop.description}</div>
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                )}
              </div>
            </td>
            <td>
              <Code variant="gray">{prop.typeSimple}</Code>
            </td>
            <td>
              {prop?.default ? (
                <Code variant="gray">{prop?.default}</Code>
              ) : (
                <span>-</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PropsTable;
