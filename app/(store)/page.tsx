import { Carousel } from "@/components/Carousel";
import { PromoSection } from "@/components/PromoSection";
import { ShopByCategory } from "@/components/ShopByCategory";

export default function page() {
  return (
    <>
      <Carousel />
      <PromoSection />
      <ShopByCategory />
    </>
  );
}
