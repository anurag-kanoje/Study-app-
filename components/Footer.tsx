import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2023 StudyBuddy. All rights reserved to "Shree Nandeshwar Gau Seva Samiti Mohala"</p>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer

