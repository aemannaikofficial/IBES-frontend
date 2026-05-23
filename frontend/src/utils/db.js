/**
 * 🌍 IBES API Service Bridge
 * Transitions from client-side IndexedDB to server-side MongoDB.
 */

const API_BASE =
    import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getFromDB = async(key) => {
    try {
        if (key === 'ibes_apps') {
            const res = await fetch(`${API_BASE}/api/applications`);
            return await res.json();
        }
        if (key === 'ibes_leaders') {
            const res = await fetch(`${API_BASE}/api/leaders`);
            return await res.json();
        }
        if (key === 'ibes_programmes') {
            const res = await fetch(`${API_BASE}/api/programmes`);
            return await res.json();
        }
        return null;
    } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        return null;
    }
};

export const saveToDB = async(key) => {
    // Legacy support for App.jsx sync logic
    console.log(`Syncing ${key} with cloud...`);
    return true;
};

// --- MongoDB Auth & Persistence ---

export const apiLogin = async(role, email, password) => {
    try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, email, password })
        });
        const data = await res.json();
        return res.ok ? data : null;
    } catch (error) {
        console.error("Auth API Error:", error);
        return null;
    }
};

export const apiSaveApplication = async(app) => {
    try {
        const isUpdate = app._id || (app.id && app.id.length > 20);
        const method = isUpdate ? 'PUT' : 'POST';
        const url = isUpdate ? `${API_BASE}/api/applications/${app._id || app.id}` : `${API_BASE}/api/applications`;

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(app)
        });
        return await res.json();
    } catch (error) {
        console.error("API Save Application failed:", error);
        return null;
    }
};

export const apiSaveLeader = async(leader) => {
    try {
        const res = await fetch(`${API_BASE}/api/leaders`);
        const existing = await res.json();
        const match = existing.find(l => l.email === leader.email);

        const method = match ? 'PUT' : 'POST';
        const url = match ? `${API_BASE}/api/leaders/${leader.email}` : `${API_BASE}/api/leaders`;

        const saveRes = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leader)
        });
        return await saveRes.json();
    } catch (error) {
        console.error("API Save Leader failed:", error);
        return null;
    }
};

export const apiDeleteLeader = async(email) => {
    try {
        await fetch(`${API_BASE}/api/leaders/${email}`, { method: 'DELETE' });
        return true;
    } catch (error) {
        console.error("API Delete Leader failed:", error);
        return false;
    }
};

/**
 * 📤 Uploads files to the backend and returns their accessible URLs.
 * @param {File[]} files - Array of File objects from input
 * @returns {Promise<string[]>} - Array of URLs for the uploaded files
 */
export const apiUploadFiles = async(files) => {
    if (!files || files.length === 0) return [];

    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    try {
        const res = await fetch(`${API_BASE}/api/upload`, {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        if (data.success) {
            return data.urls.map(url => `${API_BASE}${url}`);
        }
        return [];
    } catch (err) {
        console.error("File upload failed:", err);
        return [];
    }
};