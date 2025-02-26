import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"

const Header = () => {
  return (
    <header className="bg-transparent text-white">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-poppins">
          StudyBuddy
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/chat">Chat</Link>
            </li>
            <li>
              <Link href="/search">Search</Link>
            </li>
            <li>
              <Link href="/video-summary">Video Summary</Link>
            </li>
            <li>
              <Link href="/study-plan">Study Plan</Link>
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <ModeToggle />
            </li>
          </ul>
        </nav>
      </div>
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="mb-8">
          <img
            src="/placeholder.svg?height=200&width=200"
            alt="StudyBuddy Mascot"
            className="mx-auto w-48 h-48 float"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4 font-poppins">Learn Smarter, Not Harder!</h1>
        <p className="text-xl mb-8 font-open-sans">
          - Scan Notes in 1 Click
          <br />- Get AI Study Buddies
          <br />- Earn Fun Rewards
        </p>
        <Button size="lg" className="pulse font-poppins">
          Start Learning Free
        </Button>
      </div>
    </header>
  )
}

export default Header

