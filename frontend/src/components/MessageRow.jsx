import LoaderDots from "./LoaderDots";

export default function MessageRow({ role, content, image, typing }) {
  return (
    <div className={`message-row ${role}`}>
      <div className={`bubble ${role}`}>
        {typing ? <LoaderDots /> : (
          image ? <img src={image} alt="upload" className="max-w-[240px] rounded" /> : content
        )}
      </div>
    </div>
  );
}
