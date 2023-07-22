import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

export default defineNuxtPlugin(nuxtApp => {
    AOS.init({
        duration: 500,
        easing: "ease-in-out",
        once: true,
    });
});