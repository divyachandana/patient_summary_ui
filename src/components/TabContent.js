import React from 'react';
import './TabContent.css';

function TabContent({ activeTab }) {
  return (
    <div className="tab-content">
      {activeTab === 'health_summary' && <div>Health Summary Content</div>}
      {activeTab === 'personal_details' && <div>Personal Details Content</div>}
      {activeTab === 'allergies' && <div>Allergies Content</div>}
      {activeTab === 'careplans' && <div>Careplans Content</div>}
      {activeTab === 'conditions' && <div>Conditions Content</div>}
      {activeTab === 'encounters' && <div>Encounters Content</div>}
      {activeTab === 'immunizations' && <div>Immunizations Content</div>}
      {activeTab === 'medications' && <div>Medications Content</div>}
      {activeTab === 'observations' && <div>Observations Content</div>}
      {activeTab === 'procedures' && <div>Procedures Content</div>}
      {activeTab === 'visit_summary' && <div>Visit Summary Content</div>}
    </div>
  );
}

export default TabContent;
