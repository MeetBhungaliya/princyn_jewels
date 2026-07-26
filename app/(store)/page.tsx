import { Carousel } from "@/components/Carousel";
import { PromoSection } from "@/components/PromoSection";
import { ShopByCategory } from "@/components/ShopByCategory";
import { bannerRepository, categoryRepository } from "@/lib/repositories/content";

export default async function page() {
  const [banners, categories] = await Promise.all([bannerRepository.active(), categoryRepository.active()]);
  return (
    <>
      <Carousel banners={banners.map((banner) => ({ id: banner.id, desktopImageUrl: banner.desktopImage, mobileImageUrl: banner.mobileImage, altText: banner.title || "Princyn Jewels promotion" }))} />
      <PromoSection />
      <ShopByCategory categories={categories.map((category) => ({ id: category.id, name: category.name, tagline: category.tagline, imageUrl: category.imagePath, link: `/category/${category.slug}` }))} />
    </>
  );
}
