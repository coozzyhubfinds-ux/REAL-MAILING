import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  UsersIcon,
  EnvelopeIcon,
  ChartBarIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';

const navItems = [
  { to: '/', label: 'Dashboard', icon: HomeIcon },
  { to: '/leads', label: 'Leads', icon: UsersIcon },
  { to: '/templates', label: 'Templates', icon: Squares2X2Icon },
  { to: '/campaigns', label: 'Campaigns', icon: EnvelopeIcon },
  { to: '/analytics', label: 'Analytics', icon: ChartBarIcon }
];

const Sidebar = ({ open, onToggle }) => {
  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: open ? 0 : -260 }}
      transition={{ type: 'spring', stiffness: 240, damping: 25 }}
      className="fixed inset-y-0 left-0 z-30 w-64 bg-slateGray/80 backdrop-blur-lg shadow-glow md:relative"
    >
      <div className="flex h-full flex-col px-6 py-8">
        <button
          onClick={onToggle}
          className="mb-10 hidden w-max rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-widest text-electricPink md:block"
        >
          Toggle
        </button>
        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-gradient-to-r from-neonPink/90 to-electricPink/80 text-white shadow-glow'
                    : 'text-white/70 hover:text-white hover:bg-slateGray/60'
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-midnight/70 p-4 text-xs text-white/60">
          <p className="font-semibold text-white">Render Deployment</p>
          <p>Backend & frontend ready for Render hosting. Update env vars and push!</p>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;

