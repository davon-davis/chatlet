import { ChatWidget } from './ChatWidget'

function App() {
  return (
    <div className="p-10">
      <ChatWidget
        brandColor="#10b981"
        logoUrl="/logo.svg"
        welcomeText="Welcome! Ask me anything."
      />
    </div>
  )
}

export default App
