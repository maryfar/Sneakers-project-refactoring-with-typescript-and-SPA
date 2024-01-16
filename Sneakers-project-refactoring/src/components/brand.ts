import { Match } from "navigo";
import { getSneakersBrandsApi } from "../apis/sneakers-api";
import { errorHandler } from "../utils/errorHandler";
import { AxiosError } from "axios";

declare global {
  interface Window {
    setFilterBrand: (brand: string) => void;
  }
}

window.setFilterBrand = (brand: string) => {
  const params = new URLSearchParams({ brands: brand });

  if (params.has("brands") && brand.toLowerCase() === "all") {
    params.delete("brands");
  }

  window.navigate(`/sneakers?${params.toString()}`);
};

const getBrands = async () => {
  try {
    return await getSneakersBrandsApi();
  } catch (error) {
    errorHandler(<AxiosError>error);
  }
};

const BrandItem = (title: string, isSelected = false) => {
  return `<div onclick="setFilterBrand('${title}')" class="border whitespace-nowrap cursor-pointer self-center border-solid border-gray-900 rounded-3xl px-5 font-medium ${
    isSelected ? "bg-gray-900 text-white" : ""
  }">${title}</div>`;
};

const Brands = (brands: string[], selectedBrand?: string) => {
  let html = BrandItem("All", !selectedBrand);

  for (const brand of brands) {
    html += BrandItem(brand, selectedBrand?.split("+").join(" ") === brand);
  }
  return html;
};

export const BrandFilters = async (props: Match | undefined) => {
  const brands = await getBrands();

  return `
    <div>
      <p class="font-semibold text-lg">Most Popular</p>
      <div class="flex overflow-scroll py-2 gap-2 mt-1">${Brands(
        brands || [],
        props?.params?.brands
      )}</div>
    </div>`;
};
