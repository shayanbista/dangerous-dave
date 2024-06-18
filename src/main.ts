import { initializeSplashScreen } from './splashScreen';


window.onload = () => {
  document.getElementById('editor')!.style.display = 'none';
  document.getElementById('splashScreen')!.style.display = 'block';
  initializeSplashScreen();
};