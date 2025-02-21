import React, { useState, useEffect } from "react";

const MatrixText = ({ originalText, finalText }) => {
  const [text, setText] = useState(originalText);
  const [isHovering, setIsHovering] = useState(false);

  const randomChar = () => {
    const chars = "AB^(~`>)Zxgyu0123456789@#$%&";
    return chars[Math.floor(Math.random() * chars.length)];
  };

  useEffect(() => {
    if (!isHovering) {
      setText(originalText);
      return;
    }

    const animateText = async () => {
      const iterations = 1;
      const delay = 20;
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
  }, [isHovering, originalText, finalText]);
  return (
    <span
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="font-mono"
    >
      {text}
    </span>
  );
};

export default MatrixText;
