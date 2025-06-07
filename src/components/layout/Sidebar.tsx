'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, CalendarIcon, ClipboardDocumentListIcon, BriefcaseIcon, 
  UsersIcon, ClockIcon, CurrencyDollarIcon, DocumentIcon,
  PhoneIcon, ChartBarIcon, Cog6ToothIcon, QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
  { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
  { name: 'Matters', href: '/matters', icon: BriefcaseIcon },
  { name: 'Contacts', href: '/contacts', icon: UsersIcon },
  { name: 'Activities', href: '/activities', icon: ClockIcon },
  { name: 'Billing', href: '/billing', icon: CurrencyDollarIcon },
  { name: 'Documents', href: '/documents', icon: DocumentIcon },
  { name: 'Communications', href: '/communications', icon: PhoneIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full w-64 bg-[#1a2233] text-white">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-xl font-bold">Case Management</h1>
      </div>
      <nav className="space-y-1 px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-blue-700 hover:text-white'
              }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 w-64 p-4">
        <Link
          href="/help"
          className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-blue-700 hover:text-white"
        >
          <QuestionMarkCircleIcon
            className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-white"
            aria-hidden="true"
          />
          Help Center
        </Link>
      </div>
    </div>
  );
} 