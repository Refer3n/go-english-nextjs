import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const LanguageSwitcher = () => {
  return (
    <ToggleGroup
      type="single"
      defaultValue="EN"
      className="px-4 py-4 bg-primary rounded-full flex items-center gap-1"
    >
      <ToggleGroupItem
        value="UK"
        className="text-white text-base font-bold h-5 w-5 data-[state=on]:text-yellow flex items-center justify-center"
      >
        UK
      </ToggleGroupItem>
      <span className="text-white text-xl h-5 flex items-center">|</span>
      <ToggleGroupItem
        value="EN"
        className="text-white text-base font-bold h-5 w-5 data-[state=on]:text-yellow flex items-center justify-center"
      >
        EN
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default LanguageSwitcher;
