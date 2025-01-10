import { act, renderHook } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { observer, subscribers, useIsModalOpen } from './useIsModalOpen';

describe('useIsModalOpen', () => {
  let mockObserverInstance: {
    observe: Mock;
    disconnect: Mock;
    callback: MutationCallback;
  };

  beforeEach(() => {
    // Create mock observer instance
    mockObserverInstance = {
      observe: vi.fn(),
      disconnect: vi.fn(),
      callback: () => {},
    };

    // Mock MutationObserver
    const mockObserverConstructor = vi.fn((callback: MutationCallback) => {
      mockObserverInstance.callback = callback;
      return mockObserverInstance;
    });

    vi.stubGlobal('MutationObserver', mockObserverConstructor);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';

    subscribers.clear();
    if (observer) {
      observer.disconnect();
      vi.stubGlobal('observer', null);
    }
  });

  it('should initialize with modal closed', () => {
    const { result } = renderHook(() => useIsModalOpen());
    expect(result.current).toBe(false);
  });

  it('should create observer on mount', () => {
    renderHook(() => useIsModalOpen());
    expect(observer).not.toBeNull();
    expect(subscribers.size).toBe(1);
    expect(mockObserverInstance.observe).toHaveBeenCalledWith(document.body, {
      childList: true,
      subtree: true,
    });
  });

  it('should cleanup observer when last hook instance unmounts', () => {
    const { unmount } = renderHook(() => useIsModalOpen());
    unmount();
    expect(observer).toBeNull();
    expect(subscribers.size).toBe(0);
  });

  it('should keep observer alive when multiple hooks are mounted', () => {
    const hook1 = renderHook(() => useIsModalOpen());
    const hook2 = renderHook(() => useIsModalOpen());

    expect(observer).not.toBeNull();
    expect(subscribers.size).toBe(2);

    hook1.unmount();
    expect(observer).not.toBeNull();
    expect(subscribers.size).toBe(1);

    hook2.unmount();
    expect(observer).toBeNull();
    expect(subscribers.size).toBe(0);
  });

  it('should detect modal opening', () => {
    const { result } = renderHook(() => useIsModalOpen());

    act(() => {
      const modalElement = document.createElement('div');
      modalElement.setAttribute('data-modal-overlay', 'true');
      document.body.appendChild(modalElement);

      // Trigger the mutation observer callback
      mockObserverInstance.callback(
        [
          {
            type: 'childList',
            target: document.body,
            addedNodes: [modalElement],
            removedNodes: [],
          } as unknown as MutationRecord,
        ],
        mockObserverInstance as unknown as MutationObserver,
      );
    });

    expect(result.current).toBe(true);
  });

  it('should detect modal closing', () => {
    const { result } = renderHook(() => useIsModalOpen());
    const modalElement = document.createElement('div');
    modalElement.setAttribute('data-modal-overlay', 'true');

    // Add modal
    act(() => {
      document.body.appendChild(modalElement);
      mockObserverInstance.callback(
        [
          {
            type: 'childList',
            target: document.body,
            addedNodes: [modalElement],
            removedNodes: [],
          } as unknown as MutationRecord,
        ],
        mockObserverInstance as unknown as MutationObserver,
      );
    });

    expect(result.current).toBe(true);

    // Remove modal
    act(() => {
      modalElement.remove();
      mockObserverInstance.callback(
        [
          {
            type: 'childList',
            target: document.body,
            addedNodes: [],
            removedNodes: [modalElement],
          } as unknown as MutationRecord,
        ],
        mockObserverInstance as unknown as MutationObserver,
      );
    });

    expect(result.current).toBe(false);
  });

  it('should handle multiple modals correctly', () => {
    const { result } = renderHook(() => useIsModalOpen());

    // Add first modal
    act(() => {
      const modalElement1 = document.createElement('div');
      modalElement1.setAttribute('data-modal-overlay', 'true');
      document.body.appendChild(modalElement1);
      mockObserverInstance.callback(
        [
          {
            type: 'childList',
            target: document.body,
            addedNodes: [modalElement1],
            removedNodes: [],
          } as unknown as MutationRecord,
        ],
        mockObserverInstance as unknown as MutationObserver,
      );
    });

    expect(result.current).toBe(true);

    // Add second modal
    act(() => {
      const modalElement2 = document.createElement('div');
      modalElement2.setAttribute('data-modal-overlay', 'true');
      document.body.appendChild(modalElement2);
      mockObserverInstance.callback(
        [
          {
            type: 'childList',
            target: document.body,
            addedNodes: [modalElement2],
            removedNodes: [],
          } as unknown as MutationRecord,
        ],
        mockObserverInstance as unknown as MutationObserver,
      );
    });

    expect(result.current).toBe(true);

    // Remove both modals
    act(() => {
      document.body.innerHTML = '';
      mockObserverInstance.callback(
        [
          {
            type: 'childList',
            target: document.body,
            addedNodes: [],
            removedNodes: [
              document.querySelector('[data-modal-overlay="true"]'),
            ],
          } as unknown as MutationRecord,
        ],
        mockObserverInstance as unknown as MutationObserver,
      );
    });

    expect(result.current).toBe(false);
  });

  it('should not create multiple observers', () => {
    const observerSpy = vi.spyOn(global, 'MutationObserver');

    renderHook(() => useIsModalOpen());
    renderHook(() => useIsModalOpen());

    expect(observerSpy).toHaveBeenCalledTimes(1);
  });

  it('should properly handle observer cleanup with nested mutations', () => {
    const { result } = renderHook(() => useIsModalOpen());

    act(() => {
      const container = document.createElement('div');
      const modalElement = document.createElement('div');
      modalElement.setAttribute('data-modal-overlay', 'true');
      container.appendChild(modalElement);
      document.body.appendChild(container);

      mockObserverInstance.callback(
        [
          {
            type: 'childList',
            target: container,
            addedNodes: [modalElement],
            removedNodes: [],
          } as unknown as MutationRecord,
        ],
        mockObserverInstance as unknown as MutationObserver,
      );
    });

    expect(result.current).toBe(true);
  });
});
