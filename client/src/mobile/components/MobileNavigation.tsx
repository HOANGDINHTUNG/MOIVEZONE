// src/components/MobileNavigation.tsx
import { NavLink } from "react-router-dom";
import { mobileNavigation } from "../../constants/Navigation";

const MobileNavigation = () => {
  return (
    <section className="lg:hidden h-14 bg-white/80 dark:bg-black/70 backdrop-blur-2xl fixed bottom-0 w-full z-40 border-t border-neutral-200/60 dark:border-neutral-800">
      <div className="flex items-center justify-between h-full text-neutral-500 dark:text-neutral-400 px-4">
        {mobileNavigation.map((nav) => (
          <NavLink
            key={nav.label + "mobilenavigation"}
            to={nav.href}
            className={({ isActive }) =>
              `px-3 flex items-center flex-col justify-center gap-0.5 text-xs ${
                isActive ? "text-neutral-900 dark:text-white" : ""
              }`
            }
          >
            <div className="text-2xl">{nav.icon}</div>
            <p>{nav.label}</p>
          </NavLink>
        ))}
      </div>
    </section>
  );
};

export default MobileNavigation;
