// TerraUI component exports. Grouped by role, alphabetical within groups.

// Primitives
export { default as TAlert } from './TAlert.vue'
export { default as TAvatar } from './TAvatar.vue'
export { default as TBadge } from './TBadge.vue'
export { default as TButton } from './TButton.vue'
export { default as TCard } from './TCard.vue'
export { default as THeading } from './THeading.vue'
export { default as TIcon } from './TIcon.vue'
export { default as TLogo } from './TLogo.vue'
export { default as TSeparator } from './TSeparator.vue'
export { default as TSkeleton } from './TSkeleton.vue'
export { default as TStatusIndicator } from './TStatusIndicator.vue'

// Layout / navigation
export { default as TControlBar } from './TControlBar.vue'
export { default as TFilterLabel } from './TFilterLabel.vue'
export { default as TNavLink } from './TNavLink.vue'
export { default as TNavbar } from './TNavbar.vue'
export { default as TNavigationMenu } from './TNavigationMenu.vue'
export { default as TSubNavbar } from './TSubNavbar.vue'
export { default as TTabSelector } from './TTabSelector.vue'
export type { Tab } from './TTabSelector.vue'
export type { NavItem } from './TNavigationMenu.vue'

// Dashboard shell
export * from './dashboard'

// Data display
export { default as TAccordion } from './TAccordion.vue'
export { default as TEmptyState } from './TEmptyState.vue'
export { default as TLoadingState } from './TLoadingState.vue'
export { default as TStatTile } from './TStatTile.vue'
export { default as TTable } from './TTable.vue'
export type { TAccordionItem } from './TAccordion.vue'

// Overlays
export { default as TDropdown } from './TDropdown.vue'
export { default as TDropdownMenu } from './TDropdownMenu.vue'
export { default as TFloatingWindow } from './TFloatingWindow.vue'
export { default as TModal } from './TModal.vue'
export { default as TToast } from './TToast.vue'
export { default as TToastContainer } from './TToastContainer.vue'
export { default as TWindowsContainer } from './TWindowsContainer.vue'
export type {
  TDropdownMenuItem,
  TDropdownMenuItemColor,
  TDropdownMenuContent,
} from './TDropdownMenu.vue'

// Window renderers (importing this module registers built-in window types)
export * from './windows'

// Forms (re-export sub-barrel)
export * from './forms'

// Component-level types
export type { ButtonVariant, ButtonSize } from './TButton.vue'
export type { BadgeVariant } from './TBadge.vue'
export type { IndicatorSize, IndicatorStatus } from './TStatusIndicator.vue'
export type { LogoSize } from './TLogo.vue'
export type { IconSize } from './TIcon.vue'
export type { AlertColor, AlertVariant } from './TAlert.vue'
export type { AvatarSize, AvatarColor } from './TAvatar.vue'
