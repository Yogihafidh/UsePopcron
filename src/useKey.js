import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(
    function () {
      // Callback fungsi
      function callBack(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      }

      // Event DOM (Side Effect)
      document.addEventListener("keydown", callBack);

      // Clean up fungsi
      return function () {
        document.removeEventListener("keydown", callBack);
      };
    },
    [key, action]
  );
}
