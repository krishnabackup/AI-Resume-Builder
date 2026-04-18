import React from 'react';
import { Eye, Edit, Download, Trash2 } from 'lucide-react';

const ResumeTable = React.memo(({ 
  resumes, 
  loading, 
  openMenu, 
  setOpenMenu, 
  onView, 
  onEdit, 
  onDownload, 
  onDelete 
}) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your resumes...</p>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📄</div>
        <h3>No resumes found</h3>
        <p>Start by creating your first resume</p>
      </div>
    );
  }

  return (
    <table className="resume-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Date Created</th>
          <th>Last Modified</th>
          <th>Format</th>
          <th>AI Score</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {resumes.map((resume, index) => (
          <tr key={resume.id || index}>
            <td className="title-cell">
              <span className="resume-title">{resume.title}</span>
            </td>
            <td>{resume.created}</td>
            <td>{resume.modified}</td>
            <td>
              <span className="format-badge">{resume.format}</span>
            </td>
            <td className={`score ${getScoreColor(resume.score)}`}>
              {resume.score}/100
            </td>
            <td className="actions">
              <button 
                className="action-btn" 
                title="View"
                onClick={() => onView(resume)}
              >
                <Eye className="icon" size={16} />
              </button>
              <div className="dropdown-wrapper">
                <button
                  className="dots-btn"
                  onClick={() =>
                    setOpenMenu(openMenu === index ? null : index)
                  }
                >
                  ⋮
                </button>
                {openMenu === index && (
                  <div className="dropdown-menu">
                    <button onClick={() => onEdit(resume)}>
                      <Edit size={14} />
                      Edit
                    </button>
                    <button onClick={() => onDownload(resume)}>
                      <Download size={14} />
                      Download
                    </button>
                    <button 
                      className="danger" 
                      onClick={() => onDelete(resume)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

ResumeTable.displayName = 'ResumeTable';

export default ResumeTable;
