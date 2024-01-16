import { AxiosError } from "axios";
import { ISneaker, getSneakersApi } from "../apis/sneakers-api";
import { errorHandler } from "../utils/errorHandler";
import { UserInfo } from "../utils/userInfo";
import { Session } from "../utils/session";
import { Searchbar,isSearchClicked,searchInput} from "../components/searchbar";
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
    <div class="cursor-pointer m-1" onclick="navigate('/sneakers/${sneaker.id}')">
      <img class="rounded-3xl w-full h-40" src="${sneaker.imageURL}" />
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

  setTimeout(() => {
    const whatDate = <HTMLDivElement>document.querySelector("#whatDate");
    const now = new Date();
    const currentHour = now.getHours();
    const pElement = document.createElement("p");
    
    if (currentHour >= 5 && currentHour < 12) {
    pElement.textContent = "Good morning!🤚";
    whatDate.appendChild(pElement);
    } else if (currentHour >= 12 && currentHour < 18) {
    pElement.textContent = "Good afternoon!🤚";
    whatDate.appendChild(pElement);
    } else if (currentHour >= 18 || currentHour < 23) {
    pElement.textContent = "Good evening!🤚";
    whatDate.appendChild(pElement);
    }
    }, 50);

  return `
  
    <div class="flex justify-between items-center">
    
    <div class="w-full flex justify-between">
    <div class="flex gap-1">
    <img src="../assets/images/Screenshot 2023-12-22 224515.png" alt="" class="w-[80px] h-[75px]">
  <div class="flex flex-col text-lg text-black font-semibold items-start justify-between py-2">
      <div id="whatDate" class="font-medium text-gray-500"></div>
        
        <p class="font-bold capitalize">${userInfo?.username}</p>
      </div>
      </div>
      </div>
      <button onclick="logout()" class="font-bold capitalize cursor-pointer flex justify-center  gap-1 py-2">
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
  </svg>
  Logout
      </button>
    </div>
    <div class="mb-6 mt-1">
      ${Searchbar(props)}
   </div>
   <div class=" justify-between" style="display: ${isSearchClicked ? 'flex' : 'none'};">
   <span >Results for ${searchInput?.value}</span>
   <span >${sneakersList?.data.length} found</span>
   </div>
   <div class="mb-6 mt-1" style="display: ${isSearchClicked ? 'none' : 'block'};">
   ${await BrandFilters(props)}
 </div>
    ${
      !sneakersList?.data.length
        ? "<div class='flex gap-2 items-center flex-col'><img src='../assets/images/Screenshot 2023-12-22 183909.png'><p class='text-center font-bold w-full'>Not Found</p><p class='text-center'>Sorry, The keyword your entered can not be founded, please check agin or search with the another keyword.</p></div>"
        : ""
    }
    <main class="mx-auto grid w-full h-[550px] mt-4 mb-2 grid-cols-2 items-start justify-center overflow-y-scroll" id="sneakersList">
      ${SneakersList(sneakersList?.data || [])}
    </main>
    ${totalPages>1 ? `<div class="flex justify-center ">
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
  </div>` : ''}
  <div class="fixed left-0 bottom-0 flex justify-center w-full bg-white">
    <div class="mt-3  mb-4 mx-8 flex  gap-8 md:gap-11 justify-center">
    <a href="/sneakers"  class="flex flex-col items-center cursor-pointer group">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9.75 21.75V16.4925C9.75 16.125 10.125 15.75 10.5 15.75H13.5C13.875 15.75 14.25 16.125 14.25 16.5V21.75C14.25 21.9489 14.329 22.1397 14.4697 22.2803C14.6103 22.421 14.8011 22.5 15 22.5H21C21.1989 22.5 21.3897 22.421 21.5303 22.2803C21.671 22.1397 21.75 21.9489 21.75 21.75V11.25C21.7502 11.1514 21.7309 11.0538 21.6933 10.9627C21.6558 10.8716 21.6006 10.7888 21.531 10.719L19.5 8.6895V3.75C19.5 3.55109 19.421 3.36032 19.2803 3.21967C19.1397 3.07902 18.9489 3 18.75 3H17.25C17.0511 3 16.8603 3.07902 16.7197 3.21967C16.579 3.36032 16.5 3.55109 16.5 3.75V5.6895L12.531 1.719C12.4613 1.64915 12.3786 1.59374 12.2875 1.55593C12.1963 1.51812 12.0987 1.49866 12 1.49866C11.9014 1.49866 11.8037 1.51812 11.7126 1.55593C11.6214 1.59374 11.5387 1.64915 11.469 1.719L2.469 10.719C2.3994 10.7888 2.34423 10.8716 2.30665 10.9627C2.26908 11.0538 2.24983 11.1514 2.25 11.25V21.75C2.25 21.9489 2.32902 22.1397 2.46967 22.2803C2.61032 22.421 2.80109 22.5 3 22.5H9C9.19891 22.5 9.38968 22.421 9.53033 22.2803C9.67098 22.1397 9.75 21.9489 9.75 21.75Z" fill="#212529"/>
      </svg>
      
        <p>Home</p>
    </a>
    <a href="" class="flex flex-col items-center cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 1.5C12.9946 1.5 13.9484 1.89509 14.6517 2.59835C15.3549 3.30161 15.75 4.25544 15.75 5.25V6H8.25V5.25C8.25 4.25544 8.64509 3.30161 9.34835 2.59835C10.0516 1.89509 11.0054 1.5 12 1.5ZM17.25 6V5.25C17.25 3.85761 16.6969 2.52226 15.7123 1.53769C14.7277 0.553123 13.3924 0 12 0C10.6076 0 9.27226 0.553123 8.28769 1.53769C7.30312 2.52226 6.75 3.85761 6.75 5.25V6H1.5V21C1.5 21.7956 1.81607 22.5587 2.37868 23.1213C2.94129 23.6839 3.70435 24 4.5 24H19.5C20.2956 24 21.0587 23.6839 21.6213 23.1213C22.1839 22.5587 22.5 21.7956 22.5 21V6H17.25ZM3 7.5H21V21C21 21.3978 20.842 21.7794 20.5607 22.0607C20.2794 22.342 19.8978 22.5 19.5 22.5H4.5C4.10218 22.5 3.72064 22.342 3.43934 22.0607C3.15804 21.7794 3 21.3978 3 21V7.5Z" fill="#212529"/>
          </svg>
        <p>Cart</p>
    </a>
    <div class="flex flex-col items-center cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M0 3.75C0 3.55109 0.0790176 3.36032 0.21967 3.21967C0.360322 3.07902 0.551088 3 0.75 3H3C3.1673 3.00005 3.32978 3.05603 3.4616 3.15904C3.59342 3.26205 3.68701 3.40618 3.7275 3.5685L4.335 6H21.75C21.8639 6.00003 21.9763 6.02602 22.0787 6.07598C22.1811 6.12594 22.2708 6.19857 22.3409 6.28836C22.411 6.37814 22.4598 6.48272 22.4834 6.59416C22.5071 6.7056 22.5051 6.82096 22.4775 6.9315L20.2275 15.9315C20.187 16.0938 20.0934 16.238 19.9616 16.341C19.8298 16.444 19.6673 16.5 19.5 16.5H6C5.8327 16.5 5.67022 16.444 5.5384 16.341C5.40658 16.238 5.31299 16.0938 5.2725 15.9315L2.415 4.5H0.75C0.551088 4.5 0.360322 4.42098 0.21967 4.28033C0.0790176 4.13968 0 3.94891 0 3.75ZM4.71 7.5L6.585 15H18.915L20.79 7.5H4.71ZM7.5 19.5C7.10218 19.5 6.72064 19.658 6.43934 19.9393C6.15804 20.2206 6 20.6022 6 21C6 21.3978 6.15804 21.7794 6.43934 22.0607C6.72064 22.342 7.10218 22.5 7.5 22.5C7.89782 22.5 8.27936 22.342 8.56066 22.0607C8.84196 21.7794 9 21.3978 9 21C9 20.6022 8.84196 20.2206 8.56066 19.9393C8.27936 19.658 7.89782 19.5 7.5 19.5ZM4.5 21C4.5 20.2044 4.81607 19.4413 5.37868 18.8787C5.94129 18.3161 6.70435 18 7.5 18C8.29565 18 9.05871 18.3161 9.62132 18.8787C10.1839 19.4413 10.5 20.2044 10.5 21C10.5 21.7956 10.1839 22.5587 9.62132 23.1213C9.05871 23.6839 8.29565 24 7.5 24C6.70435 24 5.94129 23.6839 5.37868 23.1213C4.81607 22.5587 4.5 21.7956 4.5 21ZM18 19.5C17.6022 19.5 17.2206 19.658 16.9393 19.9393C16.658 20.2206 16.5 20.6022 16.5 21C16.5 21.3978 16.658 21.7794 16.9393 22.0607C17.2206 22.342 17.6022 22.5 18 22.5C18.3978 22.5 18.7794 22.342 19.0607 22.0607C19.342 21.7794 19.5 21.3978 19.5 21C19.5 20.6022 19.342 20.2206 19.0607 19.9393C18.7794 19.658 18.3978 19.5 18 19.5ZM15 21C15 20.2044 15.3161 19.4413 15.8787 18.8787C16.4413 18.3161 17.2044 18 18 18C18.7956 18 19.5587 18.3161 20.1213 18.8787C20.6839 19.4413 21 20.2044 21 21C21 21.7956 20.6839 22.5587 20.1213 23.1213C19.5587 23.6839 18.7956 24 18 24C17.2044 24 16.4413 23.6839 15.8787 23.1213C15.3161 22.5587 15 21.7956 15 21Z" fill="#212529"/>
          </svg>
        <p>Orders</p>
    </div>
    <div class="flex flex-col items-center cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="current" class="hover:fill-current text-gray-500" >
            <g clip-path="url(#clip0_1_2438)">
              <path d="M18.204 0.489006C18.5356 0.406061 18.8817 0.399753 19.2161 0.470561C19.5505 0.541369 19.8644 0.687431 20.1339 0.89766C20.4034 1.10789 20.6214 1.37676 20.7715 1.68385C20.9216 1.99095 20.9997 2.3282 21 2.67001V4.50001H21.75C22.3467 4.50001 22.919 4.73706 23.341 5.15902C23.7629 5.58097 24 6.15327 24 6.75001V20.25C24 20.8467 23.7629 21.419 23.341 21.841C22.919 22.263 22.3467 22.5 21.75 22.5H2.25C1.65326 22.5 1.08097 22.263 0.65901 21.841C0.237053 21.419 1.47137e-07 20.8467 1.47137e-07 20.25V6.75001C-0.000209191 6.17079 0.222964 5.6138 0.623066 5.19498C1.02317 4.77616 1.56938 4.52776 2.148 4.50151L18.204 0.489006ZM8.343 4.50001H19.5V2.67001C19.4997 2.55621 19.4736 2.44396 19.4235 2.34177C19.3735 2.23958 19.3008 2.15012 19.2111 2.08016C19.1213 2.01021 19.0168 1.96159 18.9055 1.938C18.7941 1.91441 18.6789 1.91647 18.5685 1.94401L8.343 4.50001ZM2.25 6.00001C2.05109 6.00001 1.86032 6.07902 1.71967 6.21968C1.57902 6.36033 1.5 6.55109 1.5 6.75001V20.25C1.5 20.4489 1.57902 20.6397 1.71967 20.7803C1.86032 20.921 2.05109 21 2.25 21H21.75C21.9489 21 22.1397 20.921 22.2803 20.7803C22.421 20.6397 22.5 20.4489 22.5 20.25V6.75001C22.5 6.55109 22.421 6.36033 22.2803 6.21968C22.1397 6.07902 21.9489 6.00001 21.75 6.00001H2.25Z" fill="#212529"/>
            </g>
            <defs>
              <clipPath id="clip0_1_2438">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        <p>Wallet</p>
    </div>
    <div class="flex flex-col items-center cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 12C13.1935 12 14.3381 11.5259 15.182 10.682C16.0259 9.83807 16.5 8.69347 16.5 7.5C16.5 6.30653 16.0259 5.16193 15.182 4.31802C14.3381 3.47411 13.1935 3 12 3C10.8065 3 9.66193 3.47411 8.81802 4.31802C7.97411 5.16193 7.5 6.30653 7.5 7.5C7.5 8.69347 7.97411 9.83807 8.81802 10.682C9.66193 11.5259 10.8065 12 12 12ZM15 7.5C15 8.29565 14.6839 9.05871 14.1213 9.62132C13.5587 10.1839 12.7956 10.5 12 10.5C11.2044 10.5 10.4413 10.1839 9.87868 9.62132C9.31607 9.05871 9 8.29565 9 7.5C9 6.70435 9.31607 5.94129 9.87868 5.37868C10.4413 4.81607 11.2044 4.5 12 4.5C12.7956 4.5 13.5587 4.81607 14.1213 5.37868C14.6839 5.94129 15 6.70435 15 7.5ZM21 19.5C21 21 19.5 21 19.5 21H4.5C4.5 21 3 21 3 19.5C3 18 4.5 13.5 12 13.5C19.5 13.5 21 18 21 19.5ZM19.5 19.494C19.4985 19.125 19.269 18.015 18.252 16.998C17.274 16.02 15.4335 15 12 15C8.565 15 6.726 16.02 5.748 16.998C4.731 18.015 4.503 19.125 4.5 19.494H19.5Z" fill="#212529"/>
          </svg>
        <p>Profile</p>
    </div>
</div>
</div>
  `;
};






function greetUser() {
  const greet = <HTMLSpanElement>document.getElementById("greet");
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    greet.innerHTML = " Good morning &#128075;";
  } else if (currentHour >= 12 && currentHour < 17) {
    greet.innerHTML = " Good afternoon &#128075;";
  } else if (currentHour >= 17 && currentHour < 20) {
    greet.innerHTML = " Good evening &#128075;";
  } else {
    greet.innerHTML = " Good night &#128075;";
  }
  console.log("Current Hour:", currentHour);
}

document.addEventListener("DOMContentLoaded", function() {
  greetUser();
});