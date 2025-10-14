import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import HandGestureController from "./HandGestureController";

const ImageViewer = ({ image, onClose, onNext, onPrev, onZoom, zoomed }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      imgRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }
    );
  }, [image]);

  return (
    <>
      {/* gesture controller hidden video */}
      <HandGestureController onNext={onNext} onPrev={onPrev} onZoom={onZoom} />

      <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 px-4">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
        >
          ✖ Close
        </button>

        <div className="max-w-4xl w-full flex flex-col items-center">
          <div className="relative overflow-hidden rounded-xl shadow-2xl">
            <img
              ref={imgRef}
              src={image}
              alt="Selected"
              className={`max-h-[80vh] transition-transform duration-400 ease-out ${zoomed ? "scale-125" : "scale-100"}`}
              style={{ willChange: "transform" }}
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button onClick={onPrev} className="bg-gray-700 px-4 py-2 rounded-lg">
              ⬅ Prev
            </button>
            <button onClick={onZoom} className="bg-gray-700 px-4 py-2 rounded-lg">
              🔍 {zoomed ? "Unzoom" : "Zoom"}
            </button>
            <button onClick={onNext} className="bg-gray-700 px-4 py-2 rounded-lg">
              ➡ Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageViewer;
