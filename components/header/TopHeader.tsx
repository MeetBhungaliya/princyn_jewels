import { Brand } from "@/components/header/Brand";

export function TopHeader() {
  return (
    <div className="container mx-auto flex items-center justify-start py-3">
      <div className="flex flex-1 justify-start">
        <div className="flex items-center lg:hidden">
          <Brand compact />
        </div>

        <div className="hidden items-center lg:flex">
          <Brand />
        </div>
      </div>
    </div>
  );
}
