import { Brand } from "@/components/header/Brand";
import { SocialLinks } from "@/components/header/SocialLinks";
import { ThemeSwitcher } from "@/components/header/ThemeSwitcher";

export function TopHeader() {
  return (
    <div className="container py-3 flex items-center justify-between mx-auto">
      <div className="hidden w-1/3 lg:flex">
        <SocialLinks />
      </div>

      <div className="flex flex-1 justify-start lg:w-1/3">
        <div className="lg:hidden flex items-center">
          <Brand compact />
        </div>

        <div className="hidden lg:flex items-center">
          <Brand />
        </div>
      </div>

      <div className="flex w-auto items-center justify-end gap-2 lg:w-1/3">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
