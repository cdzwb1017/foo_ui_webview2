#pragma once

namespace background_suspend_policy {

inline constexpr unsigned kLocked = 1u << 0;
inline constexpr unsigned kCovered = 1u << 1;

struct Projection {
    bool hideSurface;
    bool useLowMemory;
};

constexpr Projection Project(unsigned reasons) {
    // A covered foreground window is not the only possible consumer of the
    // DirectComposition surface: DWM may still need it for taskbar previews.
    // Session lock has no visible consumer, so only that reason may remove it.
    return {
        (reasons & kLocked) != 0,
        reasons != 0,
    };
}

}  // namespace background_suspend_policy
