import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../Bridge.js', () => ({
    bridge: {
        invoke: vi.fn(),
    },
}));

import { bridge } from '../Bridge.js';
import { ui } from './ui.js';

describe('ui popup policy request contracts', () => {
    beforeEach(() => {
        vi.mocked(bridge.invoke).mockReset();
    });

    it('forwards popup behavior inside the runtime behavior slot', async () => {
        await ui.setPopupBehavior({
            windowId: 'popup-1',
            profile: 'standard',
            behavior: { owner: 'none', noActivate: true },
        });

        expect(bridge.invoke).toHaveBeenCalledWith(
            'window.setPopupBehavior',
            {
                windowId: 'popup-1',
                profile: 'standard',
                behavior: { owner: 'none', noActivate: true },
            },
        );
    });

    it('wraps backdrop patch fields in the runtime backdropPolicy slot', async () => {
        await ui.setBackdropPolicy({
            windowId: 'popup-1',
            activeEffect: 'none',
            darkMode: true,
        });

        expect(bridge.invoke).toHaveBeenCalledWith(
            'window.setBackdropPolicy',
            {
                windowId: 'popup-1',
                backdropPolicy: {
                    activeEffect: 'none',
                    darkMode: true,
                },
            },
        );
    });
});