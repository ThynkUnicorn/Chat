// src/components/WelcomePrompt.jsx
function WelcomePrompt({ onSubmit }) {
return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
    <h1 className="text-2xl md:text-3xl font-semibold mb-6">What’s on the agenda today?</h1>

    <div className="bg-white shadow-lg rounded-full flex items-center px-4 py-3 w-full max-w-xl space-x-2">
        <input
        type="text"
        placeholder="Ask anything"
        className="flex-1 outline-none text-gray-800"
        onKeyDown={(e) => e.key === "Enter" && onSubmit(e.target.value)}
        />
        <button
        onClick={() => onSubmit("Instagram Audit")}
        className="bg-gray-100 text-sm px-3 py-1 rounded-full"
        >
        Instagram Audit
        </button>
        <button className="bg-gray-100 text-sm px-3 py-1 rounded-full">Upload Image</button>
        <button className="bg-gray-100 text-sm px-3 py-1 rounded-full">Paste URL</button>
        <button
        onClick={() => onSubmit("Start chat")}
        className="bg-black text-white rounded-full p-2 ml-2"
        >
        ▶
        </button>
    </div>
    </div>
);
}
export default WelcomePrompt;
  