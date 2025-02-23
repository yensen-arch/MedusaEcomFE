import React, { useState, useEffect } from "react";

const MatrixText = ({ originalText, finalText, isHovering }) => {
  const [text, setText] = useState(originalText);
  const randomChar = () => {
    const chars = "AB^(~`>)Zxgyu0123456789@#$%&";
    return chars[Math.floor(Math.random() * chars.length)];
  };

  useEffect(() => {
    let hoverTimeout;

    if (isHovering) {
      hoverTimeout = setTimeout(() => {
        const animateText = async () => {
          const iterations = 3;
          const delay = 10;
          const maxLength = Math.max(originalText.length, finalText.length);

          if (originalText.length < finalText.length) {
            setText(
              (current) =>
                current +
                Array(finalText.length - current.length)
                  .fill(".")
                  .join("")
            );
          }

          for (let i = 0; i < iterations; i++) {
            for (let pos = 0; pos < maxLength; pos++) {
              if (!isHovering) {
                setText(originalText);
                return;
              }

              setText((current) => {
                const chars = current.split("");
                if (pos < chars.length) {
                  chars[pos] = randomChar();
                }
                return chars.join("");
              });
              await new Promise((r) => setTimeout(r, delay));
            }
          }

          for (let i = 0; i < finalText.length; i++) {
            if (!isHovering) {
              setText(originalText);
              return;
            }
            setText((current) => {
              const chars = current.split("");
              chars[i] = finalText[i];
              return chars.join("");
            });
            await new Promise((r) => setTimeout(r, delay * 2));
          }
        };

        animateText();
      }, 300); // Delay of 300ms
    } else {
      clearTimeout(hoverTimeout);
      setText(originalText);
    }

    return () => clearTimeout(hoverTimeout);
  }, [isHovering, originalText, finalText]);

  return <span>{text}</span>;
};

export default MatrixText;
