"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@doresume/ui/components/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@doresume/ui/components/sidebar";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

export interface NavMainSubItem {
  title: string;
  url: string;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon: ReactNode;
  items?: NavMainSubItem[];
}

const NavCollapsibleItem = ({
  item,
  pathname,
}: {
  item: NavMainItem;
  pathname: string;
}) => {
  const isSectionActive =
    pathname === item.url || pathname.startsWith(`${item.url}/`);
  const [userOpen, setUserOpen] = useState<boolean | undefined>();
  const open = userOpen ?? isSectionActive;

  return (
    <Collapsible
      onOpenChange={setUserOpen}
      open={open}
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger
        render={
          <SidebarMenuButton
            className="group/collapsible"
            tooltip={item.title}
          />
        }
      >
        {item.icon}
        <span>{item.title}</span>
        <ChevronRightIcon className="ml-auto transition-transform group-aria-expanded/collapsible:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.items?.map((subItem) => (
            <SidebarMenuSubItem key={subItem.title}>
              <SidebarMenuSubButton
                isActive={pathname === subItem.url}
                render={<Link aria-label={subItem.title} href={subItem.url} />}
              >
                <span>{subItem.title}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const NavMain = ({ items }: { items: NavMainItem[] }) => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          if (!item.items?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={pathname === item.url}
                  tooltip={item.title}
                  render={<Link aria-label={item.title} href={item.url} />}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <NavCollapsibleItem
              item={item}
              key={item.title}
              pathname={pathname}
            />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
