// Tremor Tabs [v1.0.0]

import React from "react"
import * as TabsPrimitives from "@radix-ui/react-tabs"

import { cx, focusRing } from "@/lib/utils"

const Tabs = (
  props: Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitives.Root>, "orientation">
) => {
  return <TabsPrimitives.Root tremor-id="tremor-raw" {...props} />
}

Tabs.displayName = "Tabs"

type TabsListVariant = "line" | "solid"

const TabsListVariantContext = React.createContext<TabsListVariant>("line")

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitives.List> {
  variant?: TabsListVariant
}

const variantStyles: Record<TabsListVariant, string> = {
  line: cx(
    // base
    "flex items-center justify-start border-b",
    // border color
    "border-brd-control"
  ),
  solid: cx(
    // base
    "inline-flex items-center justify-center rounded-md p-1",
    // background color
    "bg-soft"
  ),
}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitives.List>, TabsListProps>(
  ({ className, variant = "line", children, ...props }, forwardedRef) => (
    <TabsPrimitives.List
      ref={forwardedRef}
      className={cx(variantStyles[variant], className)}
      {...props}
    >
      <TabsListVariantContext.Provider value={variant}>{children}</TabsListVariantContext.Provider>
    </TabsPrimitives.List>
  )
)

TabsList.displayName = "TabsList"

function getVariantStyles(tabVariant: TabsListVariant) {
  switch (tabVariant) {
    case "line":
      return cx(
        // base
        "-mb-px items-center justify-center border-b-2 border-transparent px-3 pb-2 text-sm font-medium whitespace-nowrap transition-all",
        // text color
        "text-gray-500 dark:text-gray-500",
        // hover
        "hover:text-gray-700 dark:hover:text-gray-400",
        // border hover
        "hover:border-gray-300 dark:hover:border-gray-400",
        // selected
        "data-[state=active]:border-blue-500 data-[state=active]:text-blue-500",
        "dark:data-[state=active]:border-blue-500 dark:data-[state=active]:text-blue-500",
        // disabled
        "data-disabled:pointer-events-none",
        "data-disabled:text-gray-300 dark:data-disabled:text-gray-700"
      )
    case "solid":
      return cx(
        // base
        "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap ring-1 transition-all ring-inset",
        // text color
        "text-gray-500 dark:text-gray-400",
        // hover
        "hover:text-gray-700",
        // ring
        "ring-transparent",
        // selected
        "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm",
        "dark:data-[state=active]:bg-inverse dark:data-[state=active]:text-cnt-inverse",
        // disabled
        "data-disabled:pointer-events-none data-disabled:text-gray-400 data-disabled:opacity-50 dark:data-disabled:text-gray-600"
      )
  }
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitives.Trigger>
>(({ className, children, ...props }, forwardedRef) => {
  const variant = React.useContext(TabsListVariantContext)
  return (
    <TabsPrimitives.Trigger
      ref={forwardedRef}
      className={cx(getVariantStyles(variant), focusRing, className)}
      {...props}
    >
      {children}
    </TabsPrimitives.Trigger>
  )
})

TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitives.Content>
>(({ className, ...props }, forwardedRef) => (
  <TabsPrimitives.Content
    ref={forwardedRef}
    className={cx("outline-hidden", focusRing, className)}
    {...props}
  />
))

TabsContent.displayName = "TabsContent"

export { Tabs, TabsContent, TabsList, TabsTrigger }
