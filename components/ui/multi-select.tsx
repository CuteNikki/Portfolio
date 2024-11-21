import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ISelectProps {
  values: {
    key: string;
    value: string;
  }[];
  children?: React.ReactNode;
  onSelectionChange?: (selectedItems: string[]) => void;
}
const MultiSelect = ({ values, children, onSelectionChange }: ISelectProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectChange = (value: string) => {
    let updatedSelectedItems;

    if (!selectedItems.includes(value)) {
      updatedSelectedItems = [...selectedItems, value];
    } else {
      updatedSelectedItems = selectedItems.filter((item) => item !== value);
    }

    setSelectedItems(updatedSelectedItems);

    if (onSelectionChange) {
      onSelectionChange(updatedSelectedItems);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex gap-2 font-bold'>
          {children}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56'
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {values.map((value: ISelectProps['values'][0], index: number) => {
          return (
            <DropdownMenuCheckboxItem
              onSelect={(e) => e.preventDefault()}
              key={index}
              checked={selectedItems.includes(value.key)}
              onCheckedChange={() => handleSelectChange(value.key)}
            >
              {value.value}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MultiSelect;
