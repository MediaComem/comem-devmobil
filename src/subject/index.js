import subject from "courses-md/dist/client";

window.subject = subject;

// import "@fortawesome/fontawesome-free/css/all.css";

import "./assets/bootstrap-btn.css";
import "./assets/fonts/DroidSerif/DroidSerif.css";
import "./assets/fonts/UbuntuMono/UbuntuMono.css";
import "./assets/fonts/YanoneKaffeesatz/YanoneKaffeesatz.css";
import "./assets/slides.css";
import "./assets/micromodal.css";

import heigLogo from "./assets/heig.svg";

subject.setLogo({
  url: "https://heig-vd.ch",
  imageUrl: heigLogo,
  height: 40,
});

subject.start();
