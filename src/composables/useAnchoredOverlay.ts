import {
  nextTick,
  onScopeDispose,
  ref,
  toValue,
  watch,
  type CSSProperties,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

/**
 * Shared positioning engine for teleported anchored overlays (dropdowns,
 * selects, pickers, popovers). Replaces the per-component `getBoundingClientRect`
 * + `position: fixed` math that each overlay used to hand-roll. It:
 *
 *  - measures the *real* panel size before placing it (no hard-coded heights);
 *  - flips on the main axis when the preferred side lacks room;
 *  - on the cross axis, prefers re-aligning to the opposite trigger edge
 *    (panel-right → trigger-right, or panel-left → trigger-left) before falling
 *    back to clamping the panel inside the viewport;
 *  - can size the panel to the trigger (`'trigger'` / `'min-trigger'`);
 *  - tracks the trigger on scroll (capture phase, so nested scroll containers
 *    are caught), window resize, and trigger/panel resize (`ResizeObserver`),
 *    all coalesced through `requestAnimationFrame`.
 *
 * The component keeps ownership of open/close, dismiss, and keyboard handling —
 * this only owns geometry. Bind the returned `floatingStyles` to the panel's
 * `:style` and pass the same `isOpen` ref the panel's `v-if` uses.
 */

export type OverlaySide = 'top' | 'bottom' | 'left' | 'right'
export type OverlayAlign = 'start' | 'center' | 'end'
/** `'trigger'` pins width to the trigger; `'min-trigger'` uses it as a floor (the
 *  panel can grow to its content, capped by its own `max-width`); `'auto'` leaves
 *  width entirely to the panel's CSS. */
export type OverlayWidth = 'trigger' | 'min-trigger' | 'auto'

export interface AnchoredPlacement {
  side: OverlaySide
  align: OverlayAlign
}

export interface UseAnchoredOverlayOptions {
  /** Preferred side of the trigger to open toward. Default `'bottom'`. */
  side?: MaybeRefOrGetter<OverlaySide>
  /** Preferred cross-axis alignment. Default `'start'`. */
  align?: MaybeRefOrGetter<OverlayAlign>
  /** Gap in px between trigger and panel. Default `4`. */
  sideOffset?: MaybeRefOrGetter<number>
  /** Keep the panel at least this far from the viewport edges. Default `8`. */
  viewportMargin?: MaybeRefOrGetter<number>
  /** How the panel's width relates to the trigger. Default `'auto'`. */
  width?: MaybeRefOrGetter<OverlayWidth>
  /** Allow the main-axis flip when the preferred side is short on space. Default `true`. */
  flip?: MaybeRefOrGetter<boolean>
  /** Allow cross-axis re-alignment / clamping to stay in the viewport. Default `true`. */
  shift?: MaybeRefOrGetter<boolean>
  /** Cap `max-height` to the space available on the chosen side. Default `false`. */
  constrainHeight?: MaybeRefOrGetter<boolean>
}

export interface UseAnchoredOverlayReturn {
  /** Bind to the panel's `:style`. */
  floatingStyles: Ref<CSSProperties>
  /** The resolved side/align after flip/shift (e.g. for arrows or animation). */
  placement: Ref<AnchoredPlacement>
  /** Force an immediate reposition (rarely needed — tracking is automatic). */
  update: () => void
}

const isVertical = (side: OverlaySide) => side === 'top' || side === 'bottom'

export function useAnchoredOverlay(
  triggerRef: Ref<HTMLElement | null>,
  panelRef: Ref<HTMLElement | null>,
  isOpen: Ref<boolean>,
  options: UseAnchoredOverlayOptions = {},
): UseAnchoredOverlayReturn {
  const floatingStyles = ref<CSSProperties>({})
  const placement = ref<AnchoredPlacement>({ side: 'bottom', align: 'start' })

  const compute = () => {
    const trigger = triggerRef.value
    const panel = panelRef.value
    if (!trigger || !panel || !isOpen.value) return

    const side = toValue(options.side) ?? 'bottom'
    const align = toValue(options.align) ?? 'start'
    const offset = toValue(options.sideOffset) ?? 4
    const margin = toValue(options.viewportMargin) ?? 8
    const widthMode = toValue(options.width) ?? 'auto'
    const allowFlip = toValue(options.flip) ?? true
    const allowShift = toValue(options.shift) ?? true
    const constrainHeight = toValue(options.constrainHeight) ?? false

    const t = trigger.getBoundingClientRect()
    const pw = panel.offsetWidth
    const ph = panel.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight

    // --- main-axis flip: only when the preferred side lacks room and the
    //     opposite side has more. Uses the measured panel extent, not a guess.
    let resolvedSide = side
    if (allowFlip) {
      const need = (isVertical(side) ? ph : pw) + offset + margin
      if (side === 'bottom' && vh - t.bottom < need && t.top > vh - t.bottom) resolvedSide = 'top'
      else if (side === 'top' && t.top < need && vh - t.bottom > t.top) resolvedSide = 'bottom'
      else if (side === 'right' && vw - t.right < need && t.left > vw - t.right)
        resolvedSide = 'left'
      else if (side === 'left' && t.left < need && vw - t.right > t.left) resolvedSide = 'right'
    }

    const style: CSSProperties = { position: 'fixed' }
    if (widthMode === 'trigger') style.width = `${t.width}px`
    else if (widthMode === 'min-trigger') style.minWidth = `${t.width}px`

    let resolvedAlign = align

    // Cross-axis placement: prefer the requested alignment, then re-align to the
    // opposite trigger edge, then clamp. `start`/`end` are resolved per side.
    const placeCross = (
      panelExtent: number,
      viewport: number,
      triggerStart: number,
      triggerEnd: number,
    ): { pos: number; max?: number } => {
      const startPos = triggerStart
      const endPos = triggerEnd - panelExtent
      const centerPos = triggerStart + (triggerEnd - triggerStart) / 2 - panelExtent / 2
      let pos = align === 'start' ? startPos : align === 'end' ? endPos : centerPos

      if (!allowShift) return { pos }

      // Panel can't fit in the viewport at all → pin and cap.
      if (panelExtent >= viewport - 2 * margin) return { pos: margin, max: viewport - 2 * margin }

      if (pos + panelExtent > viewport - margin) {
        // Overflows the far edge → align panel's far edge to the trigger's far edge.
        pos = endPos >= margin ? endPos : viewport - margin - panelExtent
        resolvedAlign = 'end'
      } else if (pos < margin) {
        // Overflows the near edge → align panel's near edge to the trigger's near edge.
        pos = startPos + panelExtent <= viewport - margin ? startPos : margin
        resolvedAlign = 'start'
      }
      return { pos }
    }

    if (isVertical(resolvedSide)) {
      if (resolvedSide === 'bottom') style.top = `${t.bottom + offset}px`
      else style.bottom = `${vh - t.top + offset}px`

      if (constrainHeight) {
        const space =
          resolvedSide === 'bottom' ? vh - t.bottom - offset - margin : t.top - offset - margin
        style.maxHeight = `${Math.max(0, space)}px`
      }

      const cross = placeCross(pw, vw, t.left, t.right)
      style.left = `${cross.pos}px`
      if (cross.max != null) style.maxWidth = `${cross.max}px`
    } else {
      if (resolvedSide === 'right') style.left = `${t.right + offset}px`
      else style.right = `${vw - t.left + offset}px`

      const cross = placeCross(ph, vh, t.top, t.bottom)
      style.top = `${cross.pos}px`
      if (cross.max != null) style.maxHeight = `${cross.max}px`
      else if (constrainHeight) style.maxHeight = `${vh - 2 * margin}px`
    }

    placement.value = { side: resolvedSide, align: resolvedAlign }
    floatingStyles.value = style
  }

  // --- auto-update: coalesce every trigger through one rAF per frame ----------
  let rafId: number | null = null
  const scheduleUpdate = () => {
    if (rafId != null || typeof window === 'undefined') return
    rafId = window.requestAnimationFrame(() => {
      rafId = null
      compute()
    })
  }

  let observer: ResizeObserver | null = null

  const start = () => {
    stop()
    if (typeof window === 'undefined') return
    compute()
    // Re-measure next frame in case content/min-width changed the panel size.
    scheduleUpdate()
    // Capture phase so scroll inside nested ancestor containers is caught too.
    window.addEventListener('scroll', scheduleUpdate, true)
    window.addEventListener('resize', scheduleUpdate)
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(scheduleUpdate)
      if (triggerRef.value) observer.observe(triggerRef.value)
      if (panelRef.value) observer.observe(panelRef.value)
    }
  }

  const stop = () => {
    if (rafId != null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', scheduleUpdate, true)
      window.removeEventListener('resize', scheduleUpdate)
    }
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  watch(
    isOpen,
    (open) => {
      if (open) {
        // Park the panel offscreen-but-fixed and hidden so it never flashes at
        // the static (end-of-body) position before the first measure.
        floatingStyles.value = { position: 'fixed', top: '0', left: '0', visibility: 'hidden' }
        nextTick(start)
      } else {
        // Leave the last styles in place so any leave-transition animates from
        // where the panel actually was; just detach the listeners.
        stop()
      }
    },
    { immediate: true },
  )

  onScopeDispose(stop)

  return { floatingStyles, placement, update: scheduleUpdate }
}
