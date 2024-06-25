import { initializeSplashScreen } from "./Classes/SplashScreen";

window.onload = () => {
  document.getElementById("editor")!.style.display = "none";
  document.getElementById("splashScreen")!.style.display = "block";

  initializeSplashScreen();
};
