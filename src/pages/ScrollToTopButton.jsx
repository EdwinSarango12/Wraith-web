import { useState, useEffect, useRef } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0);
  const [bottomOffset, setBottomOffset] = useState(24); // distancia al fondo
  const footerRef = useRef(null);

  useEffect(() => {
    footerRef.current = document.querySelector("footer");

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollY / docHeight;

      setVisible(scrollY > 200);
      setBgOpacity(Math.min(scrollPercent * 1.2, 1));

      // Evitar que la flecha se superponga con el footer
      if (footerRef.current) {
        const footerTop = footerRef.current.getBoundingClientRect().top;
        if (footerTop < window.innerHeight) {
          // mover hacia arriba según lo que invada el footer
          const overlap = window.innerHeight - footerTop;
          setBottomOffset(overlap + 24); // +24px para mantener margen
        } else {
          setBottomOffset(24); // posición normal
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {visible && (
        <div
          className="fixed left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center group cursor-pointer transition-all duration-300"
          style={{ bottom: `${bottomOffset}px` }}
          onClick={scrollToTop}
        >
          <span className="mb-2 text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
            Volver al inicio
          </span>
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: `rgba(0,0,0,${bgOpacity})` }}
          >
            <FaArrowUp className="text-white text-xl" />
          </div>
        </div>
      )}
    </>
  );
};

export default ScrollToTopButton;
