import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Plus, Trash, BookOpen, ListChecks, Check, X, BookmarkSimple, MagnifyingGlass } from "@phosphor-icons/react";

const AdminModuleManagement = ({ modules, setModules, programmes = [] }) => {
  const [newModule, setNewModule] = useState({
    name: "",
    code: "",
    credits: "",
    programmes: []
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [notification, setNotification] = useState("");
  const [drillDownProgramme, setDrillDownProgramme] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const handleToggleProgramme = (prog, isEditing = false) => {
    if (isEditing) {
      setEditingModule(prev => ({
        ...prev,
        programmes: prev.programmes.includes(prog)
          ? prev.programmes.filter(p => p !== prog)
          : [...prev.programmes, prog]
      }));
    } else {
      setNewModule(prev => ({
        ...prev,
        programmes: prev.programmes.includes(prog)
          ? prev.programmes.filter(p => p !== prog)
          : [...prev.programmes, prog]
      }));
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!newModule.name || !newModule.code || newModule.programmes.length === 0) {
      alert("Please fill in Name, Code and assign at least one programme.");
      return;
    }

    if (modules.some(m => m.code.toLowerCase() === newModule.code.toLowerCase())) {
      alert("A module with this code already exists.");
      return;
    }

    setModules(prev => [...prev, newModule]);
    setNotification(`✅ Module "${newModule.name}" registered successfully.`);
    setNewModule({ name: "", code: "", credits: "", programmes: [] });
    setIsAdding(false);
    setTimeout(() => setNotification(""), 5000);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setModules(prev => prev.map(m => m.code === editingModule.code ? editingModule : m));
    setNotification(`✅ Module "${editingModule.name}" updated successfully.`);
    setEditingModule(null);
    setTimeout(() => setNotification(""), 4000);
  };

  const handleDelete = (code) => {
    if (window.confirm("Are you sure you want to remove this module?")) {
      setModules(prev => prev.filter(m => m.code !== code));
    }
  };

  const handleEdit = (module) => {
    setEditingModule({ ...module });
    setIsAdding(false);
  };

  const getModulesForProg = (prog) => {
    return modules.filter(m => m.programmes.includes(prog));
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 📊 Statistical Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#eff6ff', color: 'var(--ibes-navy)', padding: '16px', borderRadius: '12px' }}><BookOpen size={32} weight="duotone" /></div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{modules.length}</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Total Modules</div>
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fef2f2', color: 'var(--ibes-red)', padding: '16px', borderRadius: '12px' }}><ListChecks size={32} weight="duotone" /></div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{programmes.length}</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Covered Programmes</div>
          </div>
        </div>
      </div>

      {/* 🏙️ Section Header */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', backgroundColor: 'white', padding: isMobile ? '20px' : '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: 'var(--ibes-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookmarkSimple size={28} weight="duotone" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: '#0f172a' }}>Programme Modules</h2>
            {!isMobile && <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Register academic modules and assign them to programmes.</p>}
          </div>
        </div>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingModule(null); }}
          style={{ width: isMobile ? '100%' : 'auto', backgroundColor: isAdding ? '#f1f5f9' : 'var(--ibes-navy)', color: isAdding ? '#475569' : 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', fontSize: '14px' }}
        >
          {isAdding ? "Cancel Registration" : <><Plus weight="bold" /> Register New Module</>}
        </button>
      </div>

      {notification && (
        <div className="fade-in" style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 20px', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Check size={20} /> {notification}
        </div>
      )}

      {/* 📝 Registration Form */}
      {isAdding && (
        <div className="fade-in" style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a' }}>
            <Plus size={24} color="var(--ibes-red)" /> Register New Academic Module
          </h3>
          
          <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: isMobile ? 'span 1' : 'span 2' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Module Name</label>
              <input 
                type="text" className="ibes-input" 
                value={newModule.name} 
                onChange={(e) => setNewModule(prev => ({...prev, name: e.target.value}))}
                placeholder="e.g. Strategic Management" 
                required 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Module Code</label>
              <input 
                type="text" className="ibes-input" 
                value={newModule.code} 
                onChange={(e) => setNewModule(prev => ({...prev, code: e.target.value}))}
                placeholder="e.g. MGT701" 
                required 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Credits / ECTS</label>
              <input 
                type="number" className="ibes-input" 
                value={newModule.credits} 
                onChange={(e) => setNewModule(prev => ({...prev, credits: e.target.value}))}
                placeholder="20" 
              />
            </div>
            
            <div style={{ gridColumn: isMobile ? 'span 1' : 'span 3' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Assign to Programmes</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
                {programmes.map(prog => (
                  <label key={prog} style={{ 
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', 
                    borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer',
                    backgroundColor: newModule.programmes.includes(prog) ? '#eff6ff' : 'white',
                    borderColor: newModule.programmes.includes(prog) ? 'var(--ibes-navy)' : '#e2e8f0',
                    transition: 'all 0.2s', fontSize: '13px'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={newModule.programmes.includes(prog)} 
                      onChange={() => handleToggleProgramme(prog)}
                      style={{ accentColor: 'var(--ibes-navy)' }}
                    />
                    {prog}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: isMobile ? 'span 1' : 'span 3', marginTop: '12px' }}>
              <button 
                type="submit" 
                style={{ width: '100%', backgroundColor: 'var(--ibes-navy)', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 31, 154, 0.2)' }}
              >
                Register Module
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📋 Programme with Modules List */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#334155', fontWeight: '600' }}>Programme Curriculum Ledger</h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '600px' : 'auto' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '16px 24px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Programme Name</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Modules</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programmes.map((prog, idx) => {
                const progModules = getModulesForProg(prog);
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px' }}>{prog}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {progModules.slice(0, 3).map((m, i) => (
                          <span key={i} style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>
                            {m.name}
                          </span>
                        ))}
                        {progModules.length > 3 && (
                          <span style={{ fontSize: '11px', color: 'var(--ibes-navy)', fontWeight: '600', alignSelf: 'center' }}>
                            +{progModules.length - 3} more
                          </span>
                        )}
                        {progModules.length === 0 && (
                          <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>No modules assigned</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button 
                        onClick={() => setDrillDownProgramme(prog)}
                        style={{ background: '#eff6ff', color: 'var(--ibes-navy)', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                      >
                        Manage Modules
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🪟 Modal Popup via Portal — renders into document.body */}
      {drillDownProgramme && ReactDOM.createPortal(
        <>
          {/* Backdrop */}
          <div
            onClick={() => setDrillDownProgramme(null)}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.55)',
              backdropFilter: 'blur(4px)',
              zIndex: 9000,
            }}
          />

          {/* Modal Box */}
          <div
            className="modal-enter"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              zIndex: 9001,
              width: isMobile ? '95vw' : '720px',
              maxWidth: '95vw',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              backgroundColor: 'var(--ibes-navy)',
              flexShrink: 0,
            }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800', color: 'white' }}>
                  Curriculum Modules
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.65)', maxWidth: '480px', lineHeight: 1.4 }}>
                  {drillDownProgramme}
                </p>
              </div>
              <button
                onClick={() => setDrillDownProgramme(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  borderRadius: '8px',
                  width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  marginLeft: '16px',
                }}
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Modal Body — scrollable */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {getModulesForProg(drillDownProgramme).length === 0 ? (
                <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                  <MagnifyingGlass size={60} color="#e2e8f0" style={{ marginBottom: '16px' }} />
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>
                    No modules registered for this programme yet.
                  </p>
                  <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#cbd5e1' }}>
                    Register a new module above and assign it to this programme.
                  </p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                      <th style={{ padding: '14px 24px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Module Name & Code</th>
                      <th style={{ padding: '14px 24px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Credits</th>
                      <th style={{ padding: '14px 24px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getModulesForProg(drillDownProgramme).map((mod, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{mod.name}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', fontFamily: 'monospace' }}>{mod.code}</div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ backgroundColor: '#eff6ff', color: 'var(--ibes-navy)', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '700' }}>
                            {mod.credits || '—'} ECTS
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDelete(mod.code)}
                            style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Trash size={14} /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 32px',
              borderTop: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                {getModulesForProg(drillDownProgramme).length} module{getModulesForProg(drillDownProgramme).length !== 1 ? 's' : ''} assigned
              </span>
              <button
                onClick={() => setDrillDownProgramme(null)}
                style={{ backgroundColor: 'var(--ibes-navy)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
              >
                Close
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default AdminModuleManagement;
