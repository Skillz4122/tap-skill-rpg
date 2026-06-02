import "./style.css";
import { renderHomeScreen } from "./screens/home.js";
import { loadGame } from "./systems/saveSystem.js";

const app = document.querySelector("#app");

loadGame();
renderHomeScreen(app);