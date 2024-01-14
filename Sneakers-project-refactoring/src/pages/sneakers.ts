import { AxiosError } from "axios";
import { ISneaker, getSneakersApi } from "../apis/sneakers-api";
import { errorHandler } from "../utils/errorHandler";
import { UserInfo } from "../utils/userInfo";
import { Session } from "../utils/session";
import { Searchbar,isSearchClicked } from "../components/searchbar";
import { Match } from "navigo";
import { BrandFilters } from "../components/brand";


declare global {
  interface Window {
    logout: () => void;
    navigate: (path: string) => void;
    handlePageChange: (newPage: number) => void;
  }
}

window.logout = () => {
  const session = new Session();
  session.logout();
  window.navigate("/");
};

let currentPage: number;
let totalItems = 0;

const getSneakersList = async (
  search?: string,
  brands?: string,
  page?: number
) => {
  try {
    const sneakersdata = await getSneakersApi({ search, brands, page });
    totalItems = sneakersdata?.totalPages || 0;

    return sneakersdata;
  } catch (error) {
    errorHandler(<AxiosError>error);
  }
};

const SneakerCard = (sneaker: ISneaker) => {
  return `
    <div class="cursor-pointer" onclick="navigate('/sneakers/${sneaker.id}')">
      <img class="rounded-3xl w-40 h-40" src="${sneaker.imageURL}" />
      <p class="text-ellipsis overflow-hidden whitespace-nowrap text-lg font-medium mt-3">
        ${sneaker.name}
      </p>
      <p class="font-medium">$ ${sneaker.price}</p>
    </div>
  `;
};

const SneakersList = (sneakers: ISneaker[]) => {
  let html = "";
  for (const snk of sneakers) {
    html += SneakerCard(snk);
  }
  return html;
};

export const SneakersPage = async (props: Match | undefined) => {
  const search = props?.params?.search;
  const brands = props?.params?.brands;

  window.handlePageChange = async (newPage: number) => {
   
    const newSneakersList = await getSneakersList(search, brands, newPage);
    document.getElementById("sneakersList")!.innerHTML = SneakersList(
      newSneakersList?.data || []
    );
    currentPage = newPage;
  };

  const sneakersList = await getSneakersList(search, brands, currentPage);
  const userInfo = await UserInfo();

  const totalPages = totalItems;

  return `
    <div class="flex justify-between items-center">
      <div class="py-4">
        <span id="greet" class="font-medium text-gray-500"></span>
        <p class="font-bold capitalize">${userInfo?.username}</p>
      </div>
      <button onclick="logout()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          />
        </svg>
      </button>
    </div>
    <div class="mb-6 mt-1">
      ${Searchbar(props)}
   </div>
   <div class="mb-6 mt-1" style="display: ${isSearchClicked ? 'none' : 'block'};">
   ${await BrandFilters(props)}
 </div>
    ${
      !sneakersList?.data.length
        ? "<div class='flex gap-2 items-center flex-col'><img src='../assets/images/Screenshot 2023-12-22 183909.png'><p class='text-center font-bold w-full'>Not Found</p><p class='text-center'>Sorry, The keyword your entered can not be founded, please check agin or search with the another keyword.</p></div>"
        : ""
    }
    <main class="grid grid-cols-2 md:grid-cols-4 gap-4" id="sneakersList">
      ${SneakersList(sneakersList?.data || [])}
    </main>
    <div class="flex justify-center mt-4">
      <nav class="inline-flex">
        ${Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          return `
            <button
              class="px-3 py-1 border-t border-gray-300 bg-white hover:bg-gray-100 ${
                pageNumber === currentPage ? 'border-indigo-500' : 'text-gray-500'
              }"
              onclick="handlePageChange(${pageNumber})"
            >
              ${pageNumber}
            </button>
          `;
        }).join("")}
      </nav>
    </div>
  `;
};