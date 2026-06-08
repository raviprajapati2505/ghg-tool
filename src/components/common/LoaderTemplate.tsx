export default function LoaderTemplate() {
  const text = "SUSTAINO-AI";

  return (
    <div
      className="d-flex justify-content-center align-items-center position-absolute"
      style={{ height: "100vh",width:"100vw", backgroundColor: "black", opacity:0.8, zIndex: 5000 }}
    >
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="animated-letter"
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
