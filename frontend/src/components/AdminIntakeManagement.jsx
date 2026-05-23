import React, { useState } from 'react';
import { Plus, Trash, CalendarBlank, Check, X, MagnifyingGlass, Calendar, CaretDown } from "@phosphor-icons/react";

const AdminIntakeManagement = ({ intakes, setIntakes, programmes = [], modules = [] }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notification, setNotification] = useState("");

  // Form state
  const [formProg, setFormProg] = useState("");
  const [formMod, setFormMod] = useState("");
  const [formIntake, setFormIntake] = useState("");
  const [formNewIntake, setFormNewIntake] = useState("");
  const [useNewIntake, setUseNewIntake] = useState(false);

  // moduleIntakeMap: { "PROG_NAME::MODULE_CODE": "IntakeName" }
  const [moduleIntakeMap, setModuleIntakeMap] = useState(() => {
    try {
      const stored = localStorage.getItem("ibes_module_intake_map");
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });

  React.useEffect(() => {
    localStorage.setItem("ibes_module_intake_map", JSON.stringify(moduleIntakeMap));
  }, [moduleIntakeMap]);

  const getModulesForProg = (prog) =>
    modules.filter(m => m.programmes && m.programmes.includes(prog));

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setFormProg(""); setFormMod(""); setFormIntake(""); setFormNewIntake(""); setUseNewIntake(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormProg(""); setFormMod(""); setFormIntake(""); setFormNewIntake(""); setUseNewIntake(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formProg || !formMod) { alert("Please select a Programme and Module."); return; }

    let intakeName = useNewIntake ? formNewIntake.trim() : formIntake;
    if (!intakeName) { alert("Please select or enter an intake period."); return; }

    // If new intake, add to intakes list
    if (useNewIntake) {
      if (intakes.includes(intakeName)) {
        intakeName = intakeName; // already exists, just use it
      } else {
        setIntakes(prev => [...prev, intakeName]);
      }
    }

    const key = `${formProg}::${formMod}`;
    setModuleIntakeMap(prev => ({ ...prev, [key]: intakeName }));
    setNotification(`✅ Intake "${intakeName}" assigned to module "${formMod}" successfully.`);
    setTimeout(() => setNotification(""), 4000);
    handleCloseForm();
  };

  const handleRemoveAssignment = (key) => {
    setModuleIntakeMap(prev => { const u = { ...prev }; delete u[key]; return u; });
  };

  const handleDeleteIntake = (intake) => {
    if (window.confirm(`Delete intake "${intake}"? All assignments will be removed.`)) {
      setIntakes(prev => prev.filter(i => i !== intake));
      setModuleIntakeMap(prev => {
        const u = { ...prev };
        Object.keys(u).forEach(k => { if (u[k] === intake) delete u[k]; });
        return u;
      });
    }
  };

  const totalAssigned = Object.values(moduleIntakeMap).filter(Boolean).length;
  const progModules = formProg ? getModulesForProg(formProg) : [];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header Card ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: 'white', padding: '24px 28px',
        borderRadius: '16px', border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', gap: '16px', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef2f2', color: 'var(--ibes-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CalendarBlank size={26} weight="duotone" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Academic Intakes</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
              {intakes.length} intake{intakes.length !== 1 ? 's' : ''} &nbsp;·&nbsp; {totalAssigned} assignment{totalAssigned !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={isFormOpen ? handleCloseForm : handleOpenForm}
          style={{
            backgroundColor: isFormOpen ? '#f1f5f9' : 'var(--ibes-navy)',
            color: isFormOpen ? '#475569' : 'white',
            border: 'none', padding: '12px 22px', borderRadius: '8px',
            fontWeight: '700', cursor: 'pointer', fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
          }}
        >
          {isFormOpen ? <><X size={16} weight="bold" /> Cancel</> : <><Plus size={16} weight="bold" /> Add Intake</>}
        </button>
      </div>

      {/* ── Assignment Form Card (opens on click) ── */}
      {isFormOpen && (
        <div className="fade-in" style={{
          backgroundColor: 'white', borderRadius: '20px',
          border: '1px solid #e2e8f0', boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          {/* Form Header */}
          <div style={{ backgroundColor: 'var(--ibes-navy)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'white' }}>Assign Intake to Module</h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>Select a programme, module, then assign or create an intake period.</p>
            </div>
            <button onClick={handleCloseForm} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>

            {/* Programme Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Programme</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={formProg}
                  onChange={(e) => { setFormProg(e.target.value); setFormMod(""); }}
                  required
                  style={{ width: '100%', padding: '12px 36px 12px 14px', fontSize: '14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', backgroundColor: 'white', color: formProg ? '#0f172a' : '#94a3b8', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit' }}
                >
                  <option value="" disabled>Select a programme...</option>
                  {programmes.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <CaretDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Module Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Programme Module</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={formMod}
                  onChange={(e) => setFormMod(e.target.value)}
                  required
                  disabled={!formProg}
                  style={{ width: '100%', padding: '12px 36px 12px 14px', fontSize: '14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', backgroundColor: !formProg ? '#f8fafc' : 'white', color: formMod ? '#0f172a' : '#94a3b8', cursor: formProg ? 'pointer' : 'not-allowed', appearance: 'none', fontFamily: 'inherit' }}
                >
                  <option value="" disabled>{formProg ? (progModules.length === 0 ? 'No modules for this programme' : 'Select a module...') : 'Select programme first'}</option>
                  {progModules.map(m => <option key={m.code} value={m.code}>{m.name} ({m.code})</option>)}
                </select>
                <CaretDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Intake Select / New */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Intake Period</label>
              {!useNewIntake ? (
                <div style={{ position: 'relative' }}>
                  <select
                    value={formIntake}
                    onChange={(e) => setFormIntake(e.target.value)}
                    style={{ width: '100%', padding: '12px 36px 12px 14px', fontSize: '14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', backgroundColor: 'white', color: formIntake ? '#0f172a' : '#94a3b8', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit' }}
                  >
                    <option value="" disabled>Select an intake...</option>
                    {intakes.map(i => <option key={i} value={i}>{i}</option>)}
                    {intakes.length === 0 && <option disabled>No intakes — create one below</option>}
                  </select>
                  <CaretDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                </div>
              ) : (
                <input
                  type="text"
                  className="ibes-input"
                  value={formNewIntake}
                  onChange={(e) => setFormNewIntake(e.target.value)}
                  placeholder="e.g. September 2026"
                  style={{ padding: '12px 14px', fontSize: '14px' }}
                />
              )}
              <button type="button" onClick={() => { setUseNewIntake(!useNewIntake); setFormIntake(""); setFormNewIntake(""); }}
                style={{ background: 'none', border: 'none', color: 'var(--ibes-navy)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', padding: 0, textDecoration: 'underline' }}>
                {useNewIntake ? '← Select existing intake' : '+ Create new intake period'}
              </button>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{
                width: '100%', backgroundColor: 'var(--ibes-navy)', color: 'white', border: 'none',
                padding: '13px', borderRadius: '10px', fontWeight: '700', fontSize: '15px',
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,31,154,0.2)',
              }}>
                Assign Intake
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Notification ── */}
      {notification && (
        <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderLeft: '4px solid #10b981', borderRadius: '12px', color: '#065f46', fontWeight: '600', fontSize: '14px' }}>
          <Check size={20} color="#10b981" weight="bold" /> {notification}
        </div>
      )}

      {/* ── Active Intake Tags ── */}
      {intakes.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '20px 24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 14px 0', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Intake Cycles</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {intakes.map((intake, idx) => (
              <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 14px', borderRadius: '20px', backgroundColor: '#f0fdf4', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '13px', fontWeight: '600' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                {intake}
                <button onClick={() => handleDeleteIntake(intake)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center' }}>
                  <X size={12} weight="bold" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Programme | Module | Intake | Action Table ── */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#334155', fontWeight: '700' }}>Programme — Module — Intake Registry</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '680px' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                {['Programme', 'Programme Module', 'Intake', 'Action'].map((h, i) => (
                  <th key={h} style={{ padding: '13px 24px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700', textAlign: i === 3 ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {programmes.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                  <MagnifyingGlass size={36} color="#e2e8f0" style={{ display: 'block', margin: '0 auto 10px' }} />
                  No programmes found.
                </td></tr>
              ) : (
                programmes.flatMap((prog, pIdx) => {
                  const progMods = getModulesForProg(prog);
                  const rows = progMods.length > 0 ? progMods : [null];
                  return rows.map((mod, mIdx) => {
                    const key = mod ? `${prog}::${mod.code}` : null;
                    const assigned = key ? moduleIntakeMap[key] : null;
                    return (
                      <tr key={`${pIdx}-${mIdx}`} style={{ borderBottom: '1px solid #f1f5f9' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                        <td style={{ padding: '14px 24px', verticalAlign: 'middle' }}>
                          {mIdx === 0 ? <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '13px', lineHeight: 1.4 }}>{prog}</div> : null}
                        </td>
                        <td style={{ padding: '14px 24px', verticalAlign: 'middle' }}>
                          {mod ? (
                            <div>
                              <div style={{ fontWeight: '600', color: '#334155', fontSize: '13px' }}>{mod.name}</div>
                              <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{mod.code}</div>
                            </div>
                          ) : <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No modules assigned</span>}
                        </td>
                        <td style={{ padding: '14px 24px', verticalAlign: 'middle' }}>
                          {assigned ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#ecfdf5', color: '#065f46', fontSize: '12px', padding: '5px 12px', borderRadius: '20px', fontWeight: '600', border: '1px solid #a7f3d0' }}>
                              <Calendar size={12} /> {assigned}
                            </span>
                          ) : <span style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic' }}>Not assigned</span>}
                        </td>
                        <td style={{ padding: '14px 24px', textAlign: 'right', verticalAlign: 'middle' }}>
                          {mod && assigned && (
                            <button onClick={() => handleRemoveAssignment(key)}
                              style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Trash size={12} /> Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  });
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminIntakeManagement;
