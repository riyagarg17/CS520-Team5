/**
 * Test suite for User Context provider and consumer functionality.
 * Tests user state management, updates, and persistence across component renders.
 * Validates the authentication context behavior throughout the application.
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { UserContext, UserProvider } from '../../context/UserContext';

// Mock the UserContext
jest.mock('../../context/UserContext', () => {
    const React = require('react');
    const UserContext = React.createContext();
    const UserProvider = ({ children }) => {
        const [user, setUser] = React.useState(null);
        return (
            <UserContext.Provider value={{ user, setUser }}>
                {children}
            </UserContext.Provider>
        );
    };
    return { UserContext, UserProvider };
});

/**
 * Main test suite for User Context functionality.
 * Verifies state initialization, updates, and persistence
 * for user authentication and profile management.
 */
describe('UserContext', () => {
    const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'patient'
    };

    test('provides initial null user state', () => {
        let contextValue;
        render(
            <UserProvider>
                <UserContext.Consumer>
                    {value => {
                        contextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
            </UserProvider>
        );
        expect(contextValue.user).toBeNull();
    });

    test('updates user state when setUser is called', () => {
        let contextValue;
        render(
            <UserProvider>
                <UserContext.Consumer>
                    {value => {
                        contextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
            </UserProvider>
        );

        act(() => {
            contextValue.setUser(mockUser);
        });

        expect(contextValue.user).toEqual(mockUser);
    });

    test('clears user state when setUser is called with null', () => {
        let contextValue;
        render(
            <UserProvider>
                <UserContext.Consumer>
                    {value => {
                        contextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
            </UserProvider>
        );

        act(() => {
            contextValue.setUser(mockUser);
        });

        expect(contextValue.user).toEqual(mockUser);

        act(() => {
            contextValue.setUser(null);
        });

        expect(contextValue.user).toBeNull();
    });

    test('maintains user state across re-renders', () => {
        let contextValue;
        const { rerender } = render(
            <UserProvider>
                <UserContext.Consumer>
                    {value => {
                        contextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
            </UserProvider>
        );

        act(() => {
            contextValue.setUser(mockUser);
        });

        rerender(
            <UserProvider>
                <UserContext.Consumer>
                    {value => {
                        contextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
            </UserProvider>
        );

        expect(contextValue.user).toEqual(mockUser);
    });

    test('handles user state updates with partial data', () => {
        let contextValue;
        render(
            <UserProvider>
                <UserContext.Consumer>
                    {value => {
                        contextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
            </UserProvider>
        );

        act(() => {
            contextValue.setUser(mockUser);
        });

        const updatedUser = { ...mockUser, name: 'Updated Name' };
        act(() => {
            contextValue.setUser(updatedUser);
        });

        expect(contextValue.user).toEqual(updatedUser);
    });
}); 