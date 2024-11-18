// biome-ignore lint/style/noNamespaceImport: Recommended by Radix
import * as Popover from '@radix-ui/react-popover';
import { Code } from './Code.tsx';
import InfoIcon from './svg/infoIcon.tsx';
export type PropDef = {
  name: string;
  required?: boolean;
  default?: string | boolean | undefined;
  type: string;
  typeSimple?: string;
  description?: string | React.ReactNode;
};

const FIXED_PROP_COLUMN_WIDTH = '37%';

const popoverContentClassName =
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 mx-2 rounded-md border border-border bg-white p-3 text-sm shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in dark:border-stone-800 dark:bg-stone-900';

const PropsTable = ({ data }: { data: PropDef[] }) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-border border-b">
          <th
            className="pb-2 text-left font-normal"
            style={{ width: FIXED_PROP_COLUMN_WIDTH }}
          >
            Prop
          </th>
          <th className="w-[43%] pb-2 text-left font-normal">Type</th>
          <th className="w-1/5 pb-2 text-left font-normal">Default</th>
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
                      <InfoIcon className="size-[14px] text-[#4c4c4c] dark:text-stone-400" />
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        side="top"
                        align="center"
                        className={popoverContentClassName}
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
              <div className="inline-flex gap-1">
                <Code variant="gray">{prop.typeSimple ?? prop.type}</Code>
                {Boolean(prop.typeSimple) && Boolean(prop.type) && (
                  <Popover.Root>
                    <Popover.Trigger>
                      <InfoIcon className="size-[14px] text-[#4c4c4c] dark:text-stone-400" />
                    </Popover.Trigger>
                    <Popover.Content
                      side="top"
                      align="center"
                      className={popoverContentClassName}
                    >
                      <div
                        style={{
                          paddingTop: 'var(--inset-padding-top)',
                          paddingRight: 'var(--inset-padding-right)',
                          paddingBottom: 'var(--inset-padding-bottom)',
                          paddingLeft: 'var(--inset-padding-left)',
                        }}
                      >
                        <Code variant="ghost">{prop.type}</Code>
                      </div>
                    </Popover.Content>
                  </Popover.Root>
                )}
              </div>
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
