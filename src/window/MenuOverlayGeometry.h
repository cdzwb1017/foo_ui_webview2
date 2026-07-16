#pragma once

#include <algorithm>
#include <cstdint>
#include <optional>
#include <string_view>

namespace menu_overlay_geometry {

constexpr std::int64_t kMaxMeasuredEdgePx = 100000;
constexpr std::int64_t kMaxPanelCoordinatePx = kMaxMeasuredEdgePx * 2;

struct Size {
    std::int64_t w = 0;
    std::int64_t h = 0;
};

struct MeasureReport {
    Size root;
    Size submenu;
};

struct Rect {
    int x = 0;
    int y = 0;
    int w = 0;
    int h = 0;
};

struct Placement {
    int viewportW = 0;
    int viewportH = 0;
    int rootSlotW = 0;
    int subSlotW = 0;
    int rootTop = 0;
    int rootVisibleH = 0;
};

struct SubmenuPanelRequest {
    bool visible = false;
    std::int64_t x = 0;
    std::int64_t y = 0;
    std::int64_t w = 0;
    std::int64_t h = 0;
    std::uint64_t sequence = 0;
};

struct SubmenuPanelUpdate {
    bool accepted = false;
    std::optional<Rect> submenu;
    // Independent DWM-backed HWND extents. Unlike `regions`, each extent is a
    // complete rectangle, so it can be used as an actual native window bound
    // without relying on SetWindowRgn to crop a system backdrop.
    Rect rootWindow;
    std::optional<Rect> submenuWindow;
};

// Root-close policy is deliberately independent from HWND operations so the
// lifecycle rule remains testable: a whole-menu close always removes the
// separate submenu surface immediately, while only the root may fade out.
// The child must neither restore root focus nor notify the root renderer here;
// either action could reactivate a stale layer during a root close animation.
struct RootClosePolicy {
    bool animateRoot = false;
    bool hideSubmenuImmediately = true;
    bool clearSubmenuStateImmediately = true;
    bool restoreRootFocus = false;
    bool notifyRootRenderer = false;
};

inline bool IsAnimatedRootCloseReason(std::string_view reason) {
    return reason == "outside" || reason == "escape" || reason == "select" || reason == "blur";
}

inline RootClosePolicy ResolveRootClosePolicy(std::string_view reason,
                                              bool rootWindowValid,
                                              int closeAnimationMs) {
    RootClosePolicy policy;
    policy.animateRoot = rootWindowValid && closeAnimationMs > 0 &&
        IsAnimatedRootCloseReason(reason);
    return policy;
}

inline bool IsValidPositiveSize(const Size& size) {
    return size.w > 0 && size.h > 0 &&
        size.w <= kMaxMeasuredEdgePx && size.h <= kMaxMeasuredEdgePx;
}

inline bool IsValidMeasureReport(const MeasureReport& report, bool hasFirstLevelSubmenu) {
    if (!IsValidPositiveSize(report.root)) return false;
    if (!hasFirstLevelSubmenu) {
        return report.submenu.w == 0 && report.submenu.h == 0;
    }
    return IsValidPositiveSize(report.submenu);
}

inline std::optional<Placement> ComputePlacement(const MeasureReport& report,
                                                 bool hasFirstLevelSubmenu,
                                                 int workWidth,
                                                 int workHeight) {
    if (workWidth <= 0 || workHeight <= 0 ||
        !IsValidMeasureReport(report, hasFirstLevelSubmenu)) {
        return std::nullopt;
    }

    const std::int64_t maxW = workWidth;
    const std::int64_t maxH = workHeight;
    std::int64_t rootSlotW = std::min(report.root.w, maxW);
    std::int64_t subSlotW = 0;

    if (hasFirstLevelSubmenu) {
        const std::int64_t desiredWidth = report.root.w + report.submenu.w;
        if (desiredWidth <= maxW) {
            rootSlotW = report.root.w;
            subSlotW = report.submenu.w;
        } else if (report.root.w <= maxW / 2) {
            rootSlotW = report.root.w;
            subSlotW = maxW - rootSlotW;
        } else if (report.submenu.w <= maxW / 2) {
            subSlotW = report.submenu.w;
            rootSlotW = maxW - subSlotW;
        } else {
            rootSlotW = maxW / 2;
            subSlotW = maxW - rootSlotW;
        }
    }

    const std::int64_t desiredHeight = hasFirstLevelSubmenu
        ? std::max(report.root.h, report.submenu.h)
        : report.root.h;
    const std::int64_t viewportH = std::min(desiredHeight, maxH);
    const std::int64_t rootVisibleH = std::min(report.root.h, viewportH);

    Placement placement;
    placement.rootSlotW = static_cast<int>(rootSlotW);
    placement.subSlotW = static_cast<int>(subSlotW);
    placement.viewportW = static_cast<int>(rootSlotW + subSlotW);
    placement.viewportH = static_cast<int>(viewportH);
    placement.rootVisibleH = static_cast<int>(rootVisibleH);
    placement.rootTop = static_cast<int>(viewportH - rootVisibleH);
    return placement;
}

inline Rect RootPanelRect(const Placement& placement) {
    return Rect{0, placement.rootTop, placement.rootSlotW, placement.rootVisibleH};
}

// The root surface is always a tight native window around the root panel. The
// virtual placement still reserves the maximum first-level submenu slot for
// monitor-boundary decisions, but that reservation is never part of the root
// HWND's DWM-backed rectangle.
inline Rect RootWindowExtent(const Placement& placement) {
    return RootPanelRect(placement);
}

inline std::optional<Rect> ClampSubmenuRect(const Placement& placement, const Rect& requested) {
    if (placement.subSlotW <= 0 || requested.w <= 0 || requested.h <= 0) {
        return std::nullopt;
    }
    const int x = placement.rootSlotW;
    const int maxW = placement.subSlotW;
    const int w = std::min(requested.w, maxW);
    const int h = std::min(requested.h, placement.viewportH);
    const int maxTop = std::max(0, placement.viewportH - h);
    const int y = std::clamp(requested.y, 0, maxTop);
    return Rect{x, y, w, h};
}

// A visible first-level submenu receives its own tight native window. Its
// coordinates remain in the virtual root/submenu layout so the host can keep
// the root's screen anchor fixed while choosing a left or right screen edge
// placement for the separate HWND.
inline std::optional<Rect> SubmenuWindowExtent(const Placement& placement,
                                                const Rect& requested) {
    return ClampSubmenuRect(placement, requested);
}

inline Rect TranslateRect(const Rect& rect, int dx, int dy) {
    return Rect{rect.x + dx, rect.y + dy, rect.w, rect.h};
}

inline bool IsValidSubmenuPanelCoordinates(const SubmenuPanelRequest& request) {
    if (request.x < -kMaxPanelCoordinatePx || request.y < -kMaxPanelCoordinatePx ||
        request.w <= 0 || request.h <= 0) {
        return false;
    }
    if (request.x > kMaxPanelCoordinatePx || request.y > kMaxPanelCoordinatePx ||
        request.w > kMaxMeasuredEdgePx || request.h > kMaxMeasuredEdgePx) {
        return false;
    }
    return request.x <= kMaxPanelCoordinatePx - request.w &&
        request.y <= kMaxPanelCoordinatePx - request.h;
}

// The renderer monotonically increments this for open and close reports. A
// stale asynchronous hover report cannot resurrect a submenu after a newer
// sibling-hover or close report.
inline bool IsNewerSubmenuPanelSequence(std::uint64_t previous, std::uint64_t candidate) {
    return candidate != 0 && candidate > previous;
}

// Pure gate for the overlay-private menu.__submenuPanel IPC. A request is
// accepted only for an established ContentSized placement. Raw renderer
// coordinates are range-checked before the placement clamp is evaluated, so a
// rejected request never produces a candidate region update.
inline SubmenuPanelUpdate EvaluateSubmenuPanelUpdate(
    bool isContentSized,
    const std::optional<Placement>& placement,
    const SubmenuPanelRequest& request) {
    SubmenuPanelUpdate update;
    if (!isContentSized || !placement.has_value()) return update;
    if (!IsNewerSubmenuPanelSequence(0, request.sequence)) return update;

    if (!request.visible) {
        update.accepted = true;
        update.rootWindow = RootWindowExtent(*placement);
        return update;
    }
    if (!IsValidSubmenuPanelCoordinates(request)) return update;

    const Rect requested{
        static_cast<int>(request.x), static_cast<int>(request.y),
        static_cast<int>(request.w), static_cast<int>(request.h)
    };
    update.submenu = ClampSubmenuRect(*placement, requested);
    if (!update.submenu.has_value()) return SubmenuPanelUpdate{};
    update.accepted = true;
    update.rootWindow = RootWindowExtent(*placement);
    update.submenuWindow = SubmenuWindowExtent(*placement, requested);
    return update;
}

class MeasureGate {
public:
    void Begin() { awaiting_ = true; }
    void Cancel() { awaiting_ = false; }
    bool IsAwaiting() const { return awaiting_; }

    bool TryConsume(bool valid) {
        if (!awaiting_ || !valid) return false;
        awaiting_ = false;
        return true;
    }

private:
    bool awaiting_ = false;
};

}  // namespace menu_overlay_geometry