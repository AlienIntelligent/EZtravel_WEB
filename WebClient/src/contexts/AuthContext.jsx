/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useGetProfileQuery } from '../store/apis/authApi';
import { resolveRole } from '../utils/auth/roleResolver';
import { resolvePermissions } from '../utils/auth/permissionResolver';
import apiClient, { clearAccessToken, refreshAccessToken, setAccessToken } from '../api/client';

const decodeJwt = (token) => {
 try {
 const base64Url = token.split('.')[1];
 const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
 const jsonPayload = decodeURIComponent(
 window
 .atob(base64)
 .split('')
 .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
 .join('')
 );
 const payload = JSON.parse(jsonPayload);
 // .NET ClaimTypes.Role serializes to the full URI in JWT payloads
 const DOTNET_ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
 const DOTNET_EMAIL_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
 return {
 userId: payload.sub || payload.id || '',
 email: payload.email || payload[DOTNET_EMAIL_CLAIM] || '',
 role: (payload.role || payload[DOTNET_ROLE_CLAIM] || 'TRAVELER').toUpperCase(),
 name: payload.name || payload.unique_name || '',
 status: payload.status || 'ACTIVE'
 };
 } catch (e) {
 console.error('Error decoding JWT token:', e);
 return null;
 }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
 const [token, setToken] = useState(null);
 
 const { data: profileUser, isLoading, isError, isSuccess, error } = useGetProfileQuery(undefined, {
 skip: !token,
 });

 const [status, setStatus] = useState('initializing');
 const [user, setUser] = useState(null);
 const [hasBootstrapped, setHasBootstrapped] = useState(false);

 useEffect(() => {
 let active = true;
 localStorage.removeItem('token');
 localStorage.removeItem('user');
 sessionStorage.removeItem('token');
 sessionStorage.removeItem('user');

 refreshAccessToken()
 .then((session) => {
 if (!active) return;
 setToken(session.token);
 setUser({
 id: session.userId?.toString(),
 userId: session.userId,
 email: session.email,
 role: session.role?.toUpperCase(),
 fullName: session.name || '',
 name: session.name || '',
 status: 'ACTIVE',
 });
 setHasBootstrapped(true);
 })
 .catch(() => {
 if (!active) return;
 clearAccessToken();
 setToken(null);
 setUser(null);
 setStatus('unauthenticated');
 setHasBootstrapped(true);
 });

 const expire = () => {
 clearAccessToken();
 setToken(null);
 setUser(null);
 setStatus('unauthenticated');
 };
 window.addEventListener('eztravel:session-expired', expire);
 return () => {
 active = false;
 window.removeEventListener('eztravel:session-expired', expire);
 };
 }, []);

 useEffect(() => {
 if (!hasBootstrapped) {
 setStatus('initializing');
 return;
 }

 if (!token) {
 setStatus('unauthenticated');
 setUser(null);
 return;
 }

 if (isLoading) {
 setStatus('initializing');
 return;
 }

 if (isError) {
 // Token exists but profile fetch failed (e.g., 401 Unauthorized)
 clearAccessToken();
 setToken(null);
 setUser(null);
 setStatus('unauthenticated');
 return;
 }

 if (isSuccess && profileUser) {
 const storedUser = user;
 
 const isEmptyProfile = !profileUser || Object.keys(profileUser).length === 0;
 
 let mergedUser = isEmptyProfile ? storedUser : {
 ...storedUser,
 ...profileUser
 };

 if ((!mergedUser || !mergedUser.role || !mergedUser.email) && token) {
 const decoded = decodeJwt(token);
 if (decoded) {
 mergedUser = {
 id: decoded.userId?.toString(),
 userId: decoded.userId,
 email: decoded.email,
 role: decoded.role?.toUpperCase(),
 fullName: mergedUser?.fullName || mergedUser?.name || decoded.name || '',
 name: decoded.name || '',
 ...mergedUser
 };
 }
 }

 setUser(mergedUser);
 setStatus('authenticated');
 }
 }, [hasBootstrapped, token, isLoading, isError, isSuccess, profileUser, error]);

 const login = (newToken, userData) => {
 setAccessToken(newToken);
 setToken(newToken);
 setUser(userData);
 setStatus('authenticated');
 };

 const logout = () => {
 apiClient.post('/auth/logout').catch(() => undefined);
 clearAccessToken();
 setToken(null);
 setUser(null);
 setStatus('unauthenticated');
 };

 const role = useMemo(() => resolveRole(user), [user]);
 const permissions = useMemo(() => resolvePermissions(role), [role]);

 const value = {
 isAuthenticated: status === 'authenticated',
 user,
 role,
 permissions,
 status,
 loading: status === 'initializing',
 login,
 logout
 };

 return (
 <AuthContext.Provider value={value}>
 {children}
 </AuthContext.Provider>
 );
};

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) {
 throw new Error('useAuth must be used within an AuthProvider');
 }
 return context;
};
