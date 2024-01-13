





export function slider() {
    return `   
    <div id="onboarding-container">
    <div id="page1" class="flex justify-center items-center flex-col container">
     <div class="w-full flex justify-center items-center">
      <img src="./assets/images/onbording/WallpaperDog-20534536 1.png" alt="">
     </div>
      <p class="font-semibold text-3xl text-center mt-8 mx-6">We provide high quality products just for you</p>
      <div class="flex gap-2">
        <p class="text-black rounded-md text-7xl py-5">_</p>
        <p class="text-gray-400 rounded-md text-7xl py-5">_</p>
        <p class="text-gray-400 rounded-md text-7xl py-5">_</p>
      </div>
      <button id="next1" class=" rounded-[30px] bg-black text-center text-white w-11/12 py-3 px-4 font-normal my-8 mx-6">Next</button>
    </div>
    
    <div id="page2" class="justify-center items-center flex-col hidden container">
      <div class="w-full flex justify-center items-center">
       <img src="./assets/images/onbording/WallpaperDog-20397673 1.png" alt="">
      </div>
       <p class="font-semibold text-3xl text-center mt-8 mx-6">Your satisfaction is our number one periority</p>
       <div class="flex gap-2">
         <p class="text-gray-400 rounded-md text-7xl py-5">_</p>
         <p class="text-black rounded-md text-7xl py-5">_</p>
         <p class="text-gray-400 rounded-md text-7xl py-5">_</p>
       </div>
       <button id="next2" class=" rounded-[30px] bg-black text-center text-white w-11/12 py-3 px-4 font-normal my-8 mx-6">Next</button>
     </div>
  
     <div id="page3" class=" justify-center items-center flex-col hidden container">
      <div class="w-full flex justify-center items-center">
       <img src="./assets/images/onbording/WallpaperDog-20534715 1.png" alt="">
      </div>
       <p class="font-semibold text-3xl text-center mt-4 mx-6">Let’s fulfill your fashion needs with shoearight now!</p>
       <div class="flex gap-2">
         <p class="text-gray-400 rounded-md text-7xl py-5">_</p>
         <p class="text-gray-400 rounded-md text-7xl py-5">_</p>
         <p class="text-black rounded-md text-7xl py-5">_</p>
       </div>
       <a  href="/signup"  id="next3" class=" rounded-[30px] bg-black text-center text-white w-11/12 py-3 px-4 font-normal mb-8 mt-4 mx-6">Get started</a>
     </div>
  </div>`
    
}

function initializeSlider() {
    const page1 = document.getElementById("page1") as HTMLDivElement;
    const page2 = document.getElementById("page2") as HTMLDivElement;
    const page3 = document.getElementById("page3") as HTMLDivElement;
    const next1Button = document.getElementById("next1") as HTMLButtonElement;
    const next2Button = document.getElementById("next2") as HTMLButtonElement;
  
    if (next1Button && next2Button) {
      next1Button.addEventListener("click", () => {
        page1.style.display = "none";
        page2.style.display = "flex";
      });
  
      next2Button.addEventListener("click", () => {
        page2.style.display = "none";
        page3.style.display = "flex";
      });
    }
  }
  
 
  document.addEventListener("DOMContentLoaded", initializeSlider);