import { LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router"

interface FooterItemProps {
  icon: LucideIcon
  title: string
  to: string
}

const FooterItem = ({ icon, title, to }: FooterItemProps) => {
  const location = useLocation()
  const Icon = icon

  return (
    <Link to={to}>
      <div className="flex flex-col items-center">
        <Icon
          size={24}
          color={location.pathname == to ? "#0047AB" : undefined}
        />
        {/* <span className="text-xs mt-1">{title}</span> */}
        <span
          className={`text-xs mt-1 ${
            location.pathname == to ? "font-semibold" : ""
          }`}
        >
          {title}
        </span>
      </div>
    </Link>
  )
}

interface FooterProps {
  items: FooterItemProps[]
}

const Footer = ({ items }: FooterProps) => {
  return (
    <footer className="bg-white shadow-sm sticky z-50 bottom-0">
      <div className="flex justify-around items-center p-4">
        {items.map((item, index) => (
          <FooterItem key={index} {...item} />
        ))}
      </div>
    </footer>
  )
}

export default Footer
