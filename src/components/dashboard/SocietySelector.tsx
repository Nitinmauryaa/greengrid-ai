import { SOCIETIES } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SocietySelectorProps {
  value: string;
  onChange: (id: string) => void;
}

export function SocietySelector({ value, onChange }: SocietySelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[240px] bg-card border-border">
        <SelectValue placeholder="Select Society" />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        {SOCIETIES.map(s => (
          <SelectItem key={s.id} value={s.id} className="focus:bg-accent">
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
