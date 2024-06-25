import { initializeSplashScreen } from "./Classes/SplashScreen";
import { Sound } from "./Classes/Sounds";

window.onload = () => {
  document.getElementById("editor")!.style.display = "none";
  document.getElementById("splashScreen")!.style.display = "block";
  const sound = new Sound();
  initializeSplashScreen();
};
