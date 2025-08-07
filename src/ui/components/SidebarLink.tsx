import { NavLink, useLocation } from "react-router";
import * as Icons from "../pages/admin/components/Icons"
import { IconComponent } from "../pages/admin/components/Icon";
import Tooltip from "./Tooltip";

type IconName = keyof typeof Icons;

interface Props {
  href?: string;
  name?: string;
  icon?: IconName;
  iconSize?: number;
  disabled?: boolean;
  disabledTooltip?: string;
}

export const SidebarLink = ({ href, name, icon, iconSize = 20, disabled = false, disabledTooltip }: Props) => {
  const location = useLocation();

  if (disabled) {
    return (
      <Tooltip text={disabledTooltip || ""} position="right">
        <div className="flex items-center gap-4 rounded-[5px] w-full h-full px-4 text-gray-500 cursor-not-allowed opacity-60">
          {icon && <IconComponent name={icon} size={iconSize} color="#9CA3AF" />}
          <span>{name}</span>
        </div>
      </Tooltip>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    // If we're already on the same page, force a refresh to reload data
    if (location.pathname === href) {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <NavLink 
      to={href ?? '/'}
      className={({ isActive }) =>
        [
          "flex items-center gap-4 rounded-[5px] w-full h-full px-4", // clases base
          isActive ? "bg-surface font-normal" : "bg-transparent font-[600] hover:text-white" // clases activas/inactivas
        ].join(" ")
      }
      onClick={handleClick}
    >
      {icon && <IconComponent name={icon} size={iconSize} color="#FFFFFF" />} {name}
    </NavLink>
  )
}
