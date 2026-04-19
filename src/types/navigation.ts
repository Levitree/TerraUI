export interface NavigationRoute {
  label: string
  icon: string
  to: string
  /** When this route has subnav items, this is the path to navigate to (first subnav item) */
  defaultTo?: string
}
