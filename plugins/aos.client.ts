import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

export default defineNuxtPlugin(nuxtApp => {
    AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
    });
});