import { AxiosError } from "axios";
import { render } from "../router";
import { getSingleProductApi } from "../apis/singleproduct-api";



export async function handelSinglePage(id: number = 1): Promise<void> {
  try {
    const response = await getSingleProductApi(id)
    console.log(response);
    render(renderSneakerPage(response));
   
}catch (error) {
        const err = <AxiosError>error;
      if (err.response) {
        console.error("Response Data:", err.response.data);
        console.error("Response Status:", err.response.status);
       
      }
    }
}



function renderSneakerPage(product:any) {
  const sizes = product.sizes.split("|");
  const colors = product.colors.split("|");
    return `
    <div class="w-full">
    <img src="${product.imageURL}" class="w-full relative" />
    <a onClick="backFunc()" class="absolute top-6 left-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
    </a>
    <div>
      <div class="flex justify-between mx-2 mt-4 item-center">
        <div class="text-xl font-semibold">
          ${product.name}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6 self-center">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </div>
      <div class="flex justify-start items-center gap-3 m-2">
      <p class="rounded-xl font-semibold bg-gray-300 text-center p-2">5,371 Sold</p>
      <div class="font-semibold text-center flex gap-2 justify-center"> <svg class="inline" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524v-12.005zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/></svg>
      <p>4.3(5,389 reviews)</p>
      </div>
      </div>
      <hr class="w-11/12 m-2">
      <div class="flex flex-col m-2">
        <p class="text-xl font-semibold">Description</p>
        <p class="description max-h-[3rem] overflow-hidden text-overflow-ellipsis">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora accusantium odit, eaque iusto dolore numquam nobis expedita corrupti ut eius officiis facilis assumenda ex beatae illo ducimus recusandae illum animi.</p>
      </div>
      <div class="flex justify-between m-2">
        <div class="flex flex-col items-start ">
        <p class="text-xl font-semibold">Sizes</p>
        <div class="flex gap-2 mt-2">
          ${sizes.map((item :string) => {
            return `<div class="border p-1 rounded-full">${item}</div>`;
          }).join('')}
        </div>
        </div>
        <div class="flex flex-col items-start">
          <p class="text-xl font-semibold">Colors</p>
          <div class="flex gap-2 mt-2">
          ${colors.map((item: string) => {
            return `<div class="border p-3 rounded-full" style="background-color:${item};"></div>`;
          }).join('')}
        </div>
        </div>
      </div>
      <div class="flex gap-4 m-2 justify-start items-center">
        <p class="text-xl font-semibold">Quantity</p>
        <div class="flex justify-between font-semibold text-md px-4 py-2 rounded-[30px] bg-gray-200 w-[100px]">
          <p id="decreaseQuantity" onClick="handleDecrease()">-</p>
          <p id="currentQuantity" >1</p>
          <p id="increaseQuantity" onClick="handleIncrease()">+</p>
        </div>
      </div>
      <hr class="w-11/12 m-2">
      <div class="flex mt-5 mb-7 items-center gap-3">
      <div class="flex flex-col m-2">
      <p class="text-gray-300">Total Price</p>
      <div class="font-bold text-2xl">$${product.price}.00</div>
      </div>
      <a href="/orderitem.html" class="flex justify-center items-center gap-2 rounded-[30px] bg-black text-center text-white w-[250px] h-14 p-2" >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>

     <p> Add to cart</p>
     </a>
      </div>
    </div>
  </div>

`;
}


window.backFunc=() => {
    window.location.href = "/sneakers";   
}



