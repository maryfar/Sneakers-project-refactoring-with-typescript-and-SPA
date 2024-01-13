import Navigo from "navigo";
import { LoginPage } from "./pages/login";
import { SignupPage } from "./pages/signup";
import { SneakersPage } from "./pages/sneakers";
import { slider } from "./pages/slider";
import { handelSinglePage } from "./pages/singleproduct";


export function render(context: string) {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = context;
}

const router = new Navigo("/");

declare global {
  interface Window {
    navigate: (_: string) => void;
  }
}

window.navigate = (route: string) => {
  router.navigate(route);
};

router.on("/", function () {
  render(LoginPage());
});

router.on("start", function () {
  render(slider());
});

router.on("signup", function () {
  render(SignupPage());
});

router.on("/sneakers", async function (params) {
  console.log("params", params);

  render(await SneakersPage(params));
});


router.on("/sneakers/:id", async function (params) {
  handelSinglePage(Number(params?.data?.id));
});



router.resolve();
