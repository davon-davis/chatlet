import { ChatWidget } from "./ChatWidget";

function App() {
  return (
    <div className="h-screen w-screen p-10">
      <h1 className="text-2xl font-bold">Chatlet</h1>
      <p className="text-sm text-gray-500">
        A simple chat widget for your website.
      </p>
      <ChatWidget
        brandColor="#10b981"
        logoUrl="/logo.svg"
        welcomeText="Welcome! Ask me anything."
      />
    </div>
  );
}

export default App;
