/**
 * Custom Vue Directive: v-reveal
 * Uses Intersection Observer to add a visibility class when the element enters the viewport.
 */
export default {
    mounted(el, binding) {
        // Initial state: add the base reveal class
        el.classList.add('reveal');

        // Create an observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Add visible class when element is in view
                        el.classList.add('reveal-visible');

                        // Unobserve if we only want the animation once
                        if (!binding.modifiers.repeat) {
                            observer.unobserve(el);
                        }
                    } else if (binding.modifiers.repeat) {
                        // Remove class if it's a repeating animation
                        el.classList.remove('reveal-visible');
                    }
                });
            },
            {
                threshold: binding.value?.threshold || 0.15,
                rootMargin: binding.value?.rootMargin || '0px 0px -50px 0px',
            }
        );

        observer.observe(el);
        el._revealObserver = observer;
    },
    unmounted(el) {
        if (el._revealObserver) {
            el._revealObserver.disconnect();
            delete el._revealObserver;
        }
    }
};
