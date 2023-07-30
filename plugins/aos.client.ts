import AOS from 'aos';

export default defineNuxtPlugin(nuxtApp => {
    AOS.init({
        duration: 500,
        easing: "ease-in-out",
        once: true,
        disable: "mobile",
    });
    return {
        provide: {
            aos: AOS,
        }
    }
});