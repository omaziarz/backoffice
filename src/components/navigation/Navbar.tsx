import { NavItem } from './NavItem';

export function Navbar() {
  return (
    <nav className="navbar bg-base-200 sticky mb-10 top-0 justify-between">
      <div className="flex gap-2">
        <NavItem href="/">Dashboard</NavItem>
        <NavItem href="/applications">Applications</NavItem>
      </div>
      <NavItem href="/api/auth/signout">Logout</NavItem>
    </nav>
  );
}
