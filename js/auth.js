// ============================
// DriveDeck - Auth (LocalStorage only)
// ============================

;(function () {
  'use strict';

  const STORAGE_KEYS = {
    users: 'driveDeck_users',
    session: 'driveDeck_user_session',
  };

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  function getUsers() {
    const u = readStorage(STORAGE_KEYS.users, []);
    return Array.isArray(u) ? u : [];
  }

  function saveUsers(users) {
    if (!Array.isArray(users)) return;
    writeStorage(STORAGE_KEYS.users, users);
  }

  function getSession() {
    return readStorage(STORAGE_KEYS.session, null);
  }

  function setSession(user) {
    if (!user || !user.email) return false;
    writeStorage(STORAGE_KEYS.session, {
      name: user.name || '',
      email: user.email,
    });
    return true;
  }

  function clearSession() {
    try {
      localStorage.removeItem(STORAGE_KEYS.session);
      return true;
    } catch (err) {
      return false;
    }
  }

  function register(name, email, password) {
    var users = getUsers();
    var normalizedEmail = (email || '').trim().toLowerCase();
    if (!name || !normalizedEmail || !password) {
      return { ok: false, message: 'All fields are required.' };
    }
    if (password.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters.' };
    }
    if (users.some(function (u) { return (u.email || '').toLowerCase() === normalizedEmail; })) {
      return { ok: false, message: 'An account with this email already exists.' };
    }
    users.push({
      name: (name || '').trim(),
      email: normalizedEmail,
      password: password,
    });
    saveUsers(users);
    return { ok: true };
  }

  function login(email, password) {
    var users = getUsers();
    var normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return { ok: false, message: 'Email and password are required.' };
    }
    var user = users.find(function (u) {
      return (u.email || '').toLowerCase() === normalizedEmail && u.password === password;
    });
    if (!user) {
      return { ok: false, message: 'Invalid email or password.' };
    }
    setSession(user);
    return { ok: true, user: user };
  }

  window.DriveDeckAuth = {
    getSession: getSession,
    setSession: setSession,
    clearSession: clearSession,
    getUsers: getUsers,
    register: register,
    login: login,
    storageKeys: STORAGE_KEYS,
  };
})();
