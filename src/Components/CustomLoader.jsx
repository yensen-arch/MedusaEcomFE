const CustomLoader = () => {
  return (
    <div className="flex space-x-0.5 items-center">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-0.5 h-4 bg-black animate-bounce"
          style={{
            animationDelay: `${i * 0.15}s`,
            animationTimingFunction: "ease-in-out",
          }}
        />
      ))}
    </div>
  );
};

export default CustomLoader;
