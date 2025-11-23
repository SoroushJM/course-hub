import  { useState } from 'react';
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface CourseOption {
  id: string;
  title: string;
}

interface MultiSelectCourseProps {
  options: CourseOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelectCourse({
  options,
  selected,
  onChange,
  placeholder = "انتخاب پیش‌نیاز..."
}: MultiSelectCourseProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter(option =>
    option.title.toLowerCase().includes(search.toLowerCase()) ||
    option.id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(item => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-[2.5rem] py-2 px-3 text-right"
        >
          <div className="flex flex-wrap gap-1 justify-start items-center">
            {selected.length === 0 && <span className="text-muted-foreground font-normal">{placeholder}</span>}
            {selected.map((id) => {
                const course = options.find(o => o.id === id);
                return (
                    <Badge key={id} variant="secondary" className="ml-1 mb-1">
                        {course ? course.title : id}
                    </Badge>
                )
            })}
          </div>
          <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="جستجو درس..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground border-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 shadow-none"
          />
        </div>
        <ScrollArea className="h-60" dir="rtl">
            <div className="p-1">
                {filteredOptions.length === 0 && (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        موردی یافت نشد.
                    </div>
                )}
                {filteredOptions.map((option) => (
                    <div
                        key={option.id}
                        className={cn(
                            "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 my-2",
                            selected.includes(option.id) ? "bg-accent text-accent-foreground" : ""
                        )}
                        onClick={() => toggleSelection(option.id)}
                    >
                        <Check
                            className={cn(
                                "ml-2 h-4 w-4",
                                selected.includes(option.id) ? "opacity-100" : "opacity-0"
                            )}
                        />
                        <div className="flex flex-col">
                            <span className="font-medium">{option.title}</span>
                            <span className="text-xs text-muted-foreground">{option.id}</span>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
